<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\UserDocument;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KycController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /**
     * Get KYC status and uploaded documents.
     * GET /api/v1/kyc
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

        // Determine what documents are still needed
        $uploaded  = $docs->pluck('document_type')->toArray();
        $required  = ['passport', 'selfie'];
        $missing   = array_values(array_diff($required, $uploaded));
        $allPending= $docs->where('status', 'pending')->count();
        $anyRejected = $docs->where('status', 'rejected')->count();

        return $this->success([
            'kyc_status'     => $user->kyc_status,
            'kyc_reviewed_at'=> $user->kyc_reviewed_at?->toIso8601String(),
            'documents'      => $docs,
            'missing'        => $missing,
            'all_submitted'  => count($missing) === 0,
            'pending_review' => $allPending > 0,
            'has_rejections' => $anyRejected > 0,
            'can_submit'     => $user->kyc_status === 'pending' || $user->kyc_status === 'rejected',
        ], 'KYC status retrieved.');
    }

    /**
     * Upload a KYC document.
     * POST /api/v1/kyc/upload
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'document_type' => ['required', 'in:passport,national_id,drivers_licence,selfie,proof_of_address'],
            'file'          => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
        ]);

        $user = $request->user();

        if (! in_array($user->kyc_status, ['pending', 'rejected'])) {
            return $this->error('Your KYC has already been approved or is under review.', 422);
        }

        // Store file securely (not publicly accessible)
        $path = $request->file('file')->store(
            'kyc/' . $user->id,
            'local'
        );

        // Replace existing document of the same type if any
        $existing = UserDocument::where('user_id', $user->id)
            ->where('document_type', $request->document_type)
            ->where('status', '!=', 'approved')
            ->first();

        if ($existing) {
            Storage::disk('local')->delete($existing->file_path);
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

        // If all required docs are now uploaded, move KYC to submitted
        $uploadedTypes = UserDocument::where('user_id', $user->id)
            ->where('status', '!=', 'rejected')
            ->pluck('document_type')
            ->toArray();

        $required = ['passport', 'selfie'];
        if (count(array_intersect($required, $uploadedTypes)) === count($required)) {
            $user->kyc_status = 'submitted';
            $user->save();

            // Notify admin
            app(\App\Services\NotificationService::class)->notifyAlways(
                \App\Models\User::where('role', 'admin')->first(),
                new \App\Notifications\DepositProofUploadedAdminNotification($user),
                ['inapp']
            );
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
     * Delete a pending document (so user can re-upload).
     * DELETE /api/v1/kyc/documents/{id}
     */
    public function deleteDocument(Request $request, int $id): JsonResponse
    {
        $doc = UserDocument::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->where('status', 'pending')
            ->firstOrFail();

        Storage::disk('local')->delete($doc->file_path);
        $doc->delete();

        return $this->success(null, 'Document deleted.');
    }
}
