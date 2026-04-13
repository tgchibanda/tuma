<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\UserDocument;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class KycController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /**
     * GET /api/v1/kyc
     * Returns current KYC status and all documents for the user.
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user()->load('documents');

        $docs = $user->documents->map(fn($d) => [
            'id'               => $d->id,
            'document_type'    => $d->document_type,
            'status'           => $d->status,
            'rejection_reason' => $d->rejection_reason,
            'uploaded_at'      => $d->created_at->toIso8601String(),
            'reviewed_at'      => $d->reviewed_at?->toIso8601String(),
        ]);

        $uploaded      = $docs->pluck('document_type')->toArray();
        $required      = ['passport', 'selfie'];
        $missing       = array_values(array_diff($required, $uploaded));
        $hasPending    = $docs->where('status', 'pending')->count() > 0;
        $hasRejections = $docs->where('status', 'rejected')->count() > 0;

        return $this->success([
            'kyc_status'      => $user->kyc_status,
            'kyc_reviewed_at' => $user->kyc_reviewed_at?->toIso8601String(),
            'documents'       => $docs,
            'missing'         => $missing,
            'all_submitted'   => count($missing) === 0,
            'pending_review'  => $hasPending,
            'has_rejections'  => $hasRejections,
            'can_submit'      => in_array($user->kyc_status, ['pending', 'rejected']),
        ], 'KYC status retrieved.');
    }

    /**
     * POST /api/v1/kyc/upload
     * Upload a document. Auto-marks kyc_status as 'submitted' once all required docs are present.
     * Uses SYNC notification (not queued) so a missing jobs table never breaks the upload.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'document_type' => ['required', 'in:passport,national_id,drivers_licence,selfie,proof_of_address'],
            'file'          => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
        ]);

        $user = $request->user();

        if (! in_array($user->kyc_status, ['pending', 'rejected'])) {
            return $this->error('Your KYC has already been approved or is currently under review.', 422);
        }

        // Store file securely (not publicly accessible)
        $path = $request->file('file')->store(
            'kyc/' . $user->id,
            'local'
        );

        // Replace any existing pending/rejected doc of the same type
        $existing = UserDocument::where('user_id', $user->id)
            ->where('document_type', $request->document_type)
            ->where('status', '!=', 'approved')
            ->first();

        if ($existing) {
            Storage::disk('public')->delete($existing->file_path);
            $existing->delete();
        }

        $doc = UserDocument::create([
            'user_id'           => $user->id,
            'document_type'     => $request->document_type,
            'file_path'         => $path,
            'original_filename' => $request->file('file')->getClientOriginalName(),
            'mime_type'         => $request->file('file')->getMimeType(),
            'status'            => 'pending',
        ]);

        // Check if all required documents are now uploaded (pending or approved)
        $uploadedTypes = UserDocument::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->pluck('document_type')
            ->toArray();

        $required = ['passport', 'selfie'];
        if (count(array_intersect($required, $uploadedTypes)) === count($required)) {
            $user->kyc_status = 'submitted';
            $user->save();

            // Notify admin — use SYNC notification to avoid needing the jobs table
            try {
                $admin = \App\Models\User::where('role', 'admin')->first();
                if ($admin) {
                    // Notify synchronously (no queue) so missing jobs table doesn't break upload
                    $admin->notifyNow(new \App\Notifications\DepositProofUploadedAdminNotification($user));
                }
            } catch (\Throwable $e) {
                // Never let notification failure break the upload response
                \Illuminate\Support\Facades\Log::warning('Admin KYC notification failed: ' . $e->getMessage());
            }
        }

        $this->auditService->log('kyc.document_uploaded', $user, $doc);

        return $this->created([
            'id'            => $doc->id,
            'document_type' => $doc->document_type,
            'status'        => $doc->status,
            'kyc_status'    => $user->fresh()->kyc_status,
        ], 'Document uploaded successfully.');
    }

    /**
     * DELETE /api/v1/kyc/documents/{id}
     * Delete a pending document. If no required docs remain, revert kyc_status to 'pending'.
     */
    public function deleteDocument(Request $request, int $id): JsonResponse
    {
        $doc = UserDocument::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->where('status', 'pending')
            ->firstOrFail();

        $user = $request->user();

        // Remove file from disk
        Storage::disk('public')->delete($doc->file_path);
        $doc->delete();

        // Recalculate KYC status:
        // If user had 'submitted' status but now lacks required documents → revert to 'pending'
        if ($user->kyc_status === 'submitted') {
            $remainingRequired = UserDocument::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'approved'])
                ->whereIn('document_type', ['passport', 'selfie'])
                ->distinct('document_type')
                ->count('document_type');

            if ($remainingRequired < 2) {
                $user->kyc_status = 'pending';
                $user->save();
            }
        }

        return $this->success([
            'kyc_status' => $user->fresh()->kyc_status,
        ], 'Document deleted. KYC status updated.');
    }
}
