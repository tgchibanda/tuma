<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\PlatformDeposit;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReconciliationController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditService $auditService) {}

    /**
     * Upload a bank statement CSV and auto-match rows to pending deposits.
     * POST /api/v1/admin/reconciliation/upload
     *
     * Expected CSV columns (flexible — tries multiple common formats):
     *   Date, Description/Narration, Amount, Reference
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $path    = $request->file('csv_file')->store('reconciliation', 'local');
        $fullPath= storage_path('app/' . $path);

        if (! file_exists($fullPath)) {
            return $this->error('Failed to process uploaded file.', 500);
        }

        $rows    = $this->parseCsv($fullPath);
        $matched = [];
        $unmatched = [];

        // Get all pending deposits with their references
        $pendingDeposits = PlatformDeposit::whereIn('status', ['pending'])
            ->whereNotNull('our_bank_reference')
            ->get()
            ->keyBy('our_bank_reference');

        foreach ($rows as $row) {
            $ref = $this->extractReference($row);
            $amt = $this->extractAmount($row);

            if ($ref && isset($pendingDeposits[$ref])) {
                $deposit = $pendingDeposits[$ref];
                $amountMatch = $amt && abs($amt - (float) $deposit->amount_aud) < 0.01;

                $matched[] = [
                    'csv_row'        => $row,
                    'deposit_id'     => $deposit->id,
                    'deposit_reference'=> $deposit->our_bank_reference,
                    'deposit_amount' => (float) $deposit->amount_aud,
                    'csv_amount'     => $amt,
                    'amount_matches' => $amountMatch,
                    'match_ulid'     => $deposit->swapMatch?->ulid,
                    'auto_verify'    => $amountMatch,
                ];
            } else {
                $unmatched[] = [
                    'csv_row'            => $row,
                    'extracted_reference'=> $ref,
                    'extracted_amount'   => $amt,
                    'reason'             => $ref ? 'Reference not found in pending deposits' : 'No reference found in row',
                ];
            }
        }

        $this->auditService->log('reconciliation.uploaded', $request->user(), null, [], [
            'rows_total'    => count($rows),
            'rows_matched'  => count($matched),
            'rows_unmatched'=> count($unmatched),
        ]);

        // Clean up temp file
        \Illuminate\Support\Facades\Storage::disk('local')->delete($path);

        return $this->success([
            'summary'   => [
                'total_rows'    => count($rows),
                'matched'       => count($matched),
                'unmatched'     => count($unmatched),
                'auto_verifiable'=> collect($matched)->where('auto_verify', true)->count(),
            ],
            'matched'   => $matched,
            'unmatched' => $unmatched,
        ], 'Bank statement processed. Review matched deposits before verifying.');
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function parseCsv(string $path): array
    {
        $rows    = [];
        $headers = null;
        $handle  = fopen($path, 'r');

        if (! $handle) return [];

        while (($line = fgetcsv($handle, 1000, ',')) !== false) {
            if (! $headers) {
                $headers = array_map('strtolower', array_map('trim', $line));
                continue;
            }
            if (count($line) === count($headers)) {
                $rows[] = array_combine($headers, array_map('trim', $line));
            }
        }

        fclose($handle);
        return $rows;
    }

    /**
     * Try to find the TuMa reference (TM-XXXXXXXX) in any column.
     */
    private function extractReference(array $row): ?string
    {
        $text = implode(' ', array_values($row));
        if (preg_match('/TM-[A-Z0-9]{8}/i', $text, $matches)) {
            return strtoupper($matches[0]);
        }
        return null;
    }

    /**
     * Try to find a numeric amount in common CSV column names.
     */
    private function extractAmount(array $row): ?float
    {
        $amountKeys = ['amount', 'credit', 'debit', 'value', 'sum'];
        foreach ($amountKeys as $key) {
            if (isset($row[$key]) && is_numeric(str_replace([',', '$', ' '], '', $row[$key]))) {
                return (float) str_replace([',', '$', ' '], '', $row[$key]);
            }
        }
        return null;
    }
}
