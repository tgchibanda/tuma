<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SwapMatch;
use App\Models\TransactionFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    use ApiResponse;

    /**
     * Submit post-transaction feedback (internal — goes to admin analytics only).
     * POST /api/v1/matches/{ulid}/feedback
     */
    public function store(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'smoothness_score'     => ['required', 'integer', 'min:1', 'max:5'],
            'responsiveness_score' => ['required', 'integer', 'min:1', 'max:5'],
            'suggestion'           => ['nullable', 'string', 'max:1000'],
        ]);

        $userId = $request->user()->id;
        $match  = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder', 'receiveOrder'])
            ->first();

        if (! $match) return $this->notFound('Match not found.');
        if ($match->sendOrder?->user_id !== $userId && $match->receiveOrder?->user_id !== $userId) return $this->forbidden('Access denied.');
        if ($match->status !== SwapMatch::STATUS_COMPLETED) {
            return $this->error('Feedback can only be submitted after a match is completed.', 422);
        }

        if (TransactionFeedback::where('swap_match_id', $match->id)->where('user_id', $userId)->exists()) {
            return $this->error('You have already submitted feedback for this transaction.', 422);
        }

        TransactionFeedback::create([
            'swap_match_id'        => $match->id,
            'user_id'              => $userId,
            'smoothness_score'     => $request->smoothness_score,
            'responsiveness_score' => $request->responsiveness_score,
            'suggestion'           => $request->suggestion,
        ]);

        return $this->created(null, 'Thank you for your feedback.');
    }
}
