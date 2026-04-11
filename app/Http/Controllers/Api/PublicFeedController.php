<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\PublicTransactionFeed;
use App\Models\SwapMatch;
use Illuminate\Http\JsonResponse;

class PublicFeedController extends Controller
{
    use ApiResponse;

    /**
     * Public transaction feed — anonymised, includes demo records.
     * GET /api/v1/feed
     */
    public function index(): JsonResponse
    {
        $items = PublicTransactionFeed::where('is_visible', 1)
            ->orderByDesc('completed_at')
            ->paginate(20);

        return $this->paginated($items, 'Feed retrieved.', $items->getCollection()->map(fn($i) => [
            'id'               => $i->id,
            'display_sender'   => $i->display_sender,
            'display_receiver' => $i->display_receiver,
            'amount_aud'       => (float) $i->amount_aud,
            'amount_usd'       => (float) $i->amount_usd,
            'delivery_location'=> $i->delivery_location,
            'completed_at'     => $i->completed_at?->toIso8601String(),
            'is_demo'          => (bool) $i->is_demo,
        ]));
    }

    /**
     * Aggregate stats for the landing page.
     * GET /api/v1/feed/stats
     */
    public function stats(): JsonResponse
    {
        $totalVolume = PublicTransactionFeed::where('is_visible', 1)->sum('amount_aud');
        $totalCount  = PublicTransactionFeed::where('is_visible', 1)->count();
        $cities      = PublicTransactionFeed::where('is_visible', 1)->distinct('delivery_location')->count('delivery_location');
        $completed   = SwapMatch::where('status', 'completed')->count();
        $total       = SwapMatch::count();
        $successRate = $total > 0 ? round(($completed / $total) * 100) : 98;

        return $this->success([
            'total_volume_aud' => (float) $totalVolume,
            'total_count'      => $totalCount,
            'cities_count'     => $cities,
            'success_rate'     => $successRate,
        ], 'Stats retrieved.');
    }
}
