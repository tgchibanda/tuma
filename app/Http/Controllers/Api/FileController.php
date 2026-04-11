<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\CashDelivery;
use App\Models\PlatformDeposit;
use App\Models\UserDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    use ApiResponse;

    /**
     * Serve a deposit proof (sender or admin only).
     * GET /api/v1/files/deposits/{id}/proof
     */
    public function depositProof(Request $request, int $id): StreamedResponse
    {
        $deposit = PlatformDeposit::with('swapMatch.sendOrder')->findOrFail($id);
        $user    = $request->user();

        // Access: admin, or the sender who uploaded it
        $isAdmin  = $user->role === 'admin';
        $isSender = $deposit->depositor_user_id === $user->id;

        abort_unless($isAdmin || $isSender, 403, 'Access denied.');
        abort_unless($deposit->proof_file, 404, 'No proof file found.');

        return $this->streamFile($deposit->proof_file, 'deposit-proof');
    }

    /**
     * Serve a delivery proof photo (either party or admin).
     * GET /api/v1/files/deliveries/{id}/proof/{type}
     * type: id | handover | combined
     */
    public function deliveryProof(Request $request, int $id, string $type): StreamedResponse
    {
        $delivery = CashDelivery::with('swapMatch.sendOrder.user', 'swapMatch.receiveOrder.user')->findOrFail($id);
        $user     = $request->user();

        $sendUserId    = $delivery->swapMatch->sendOrder->user_id ?? null;
        $receiveUserId = $delivery->swapMatch->receiveOrder->user_id ?? null;
        $isAdmin       = $user->role === 'admin';
        $isParty       = in_array($user->id, [$sendUserId, $receiveUserId]);

        abort_unless($isAdmin || $isParty, 403, 'Access denied.');

        $file = match ($type) {
            'id'       => $delivery->recipient_id_photo,
            'handover' => $delivery->handover_amount_photo,
            'combined' => $delivery->combined_verification_photo,
            default    => null,
        };

        abort_unless($file, 404, 'Photo not found.');

        return $this->streamFile($file, 'delivery-' . $type);
    }

    /**
     * Serve a KYC document (owner or admin only).
     * GET /api/v1/files/kyc/{id}
     */
    public function kycDocument(Request $request, int $id): StreamedResponse
    {
        $doc  = UserDocument::findOrFail($id);
        $user = $request->user();

        $isAdmin = $user->role === 'admin';
        $isOwner = $doc->user_id === $user->id;

        abort_unless($isAdmin || $isOwner, 403, 'Access denied.');

        return $this->streamFile($doc->file_path, 'kyc-document');
    }

    private function streamFile(string $path, string $namePrefix): StreamedResponse
    {
        abort_unless(Storage::disk('local')->exists($path), 404, 'File not found.');

        $mimeType = Storage::disk('local')->mimeType($path);
        $size     = Storage::disk('local')->size($path);
        $ext      = pathinfo($path, PATHINFO_EXTENSION);

        return response()->stream(function () use ($path) {
            $stream = Storage::disk('local')->readStream($path);
            fpassthru($stream);
            if (is_resource($stream)) fclose($stream);
        }, 200, [
            'Content-Type'        => $mimeType,
            'Content-Length'      => $size,
            'Content-Disposition' => 'inline; filename="' . $namePrefix . '.' . $ext . '"',
            'Cache-Control'       => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
