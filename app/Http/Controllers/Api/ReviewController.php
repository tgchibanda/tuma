<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SwapMatch;
use App\Models\User;
use App\Models\UserReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    use ApiResponse;

    /**
     * Post a review/rating after a completed match.
     * POST /api/v1/matches/{ulid}/rate
     */
    public function store(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'score'       => ['required', 'integer', 'min:1', 'max:5'],
            'review_text' => ['nullable', 'string', 'max:500'],
        ]);

        $userId = $request->user()->id;
        $match  = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder', 'receiveOrder'])
            ->first();

        if (! $match) return $this->notFound('Match not found.');
        if (! $match->involvesUser((object) ['id' => $userId])) return $this->forbidden('Access denied.');

        if ($match->status !== SwapMatch::STATUS_COMPLETED) {
            return $this->error('Reviews can only be submitted after a match is completed.', 422);
        }

        if (UserReview::where('swap_match_id', $match->id)->where('reviewer_id', $userId)->exists()) {
            return $this->error('You have already submitted a review for this transaction.', 422);
        }

        // Determine who is being reviewed (the OTHER party)
        $reviewedUserId = $userId === $match->sendOrder->user_id
            ? $match->receiveOrder->user_id
            : $match->sendOrder->user_id;

        $review = UserReview::create([
            'reviewer_id'      => $userId,
            'reviewed_user_id' => $reviewedUserId,
            'swap_match_id'    => $match->id,
            'score'            => $request->score,
            'review_text'      => $request->review_text,
            'is_visible'       => true,
        ]);

        // Update the reviewed user's rolling average rating
        $this->updateUserRating($reviewedUserId);

        return $this->created([
            'id'          => $review->id,
            'score'       => $review->score,
            'review_text' => $review->review_text,
        ], 'Review submitted. Thank you.');
    }

    /**
     * Get public reviews for a user profile.
     * GET /api/v1/users/{ulid}/reviews
     */
    public function indexForUser(string $ulid): JsonResponse
    {
        $user = User::where('ulid', $ulid)->firstOrFail();

        $reviews = UserReview::where('reviewed_user_id', $user->id)
            ->where('is_visible', true)
            ->with('reviewer')
            ->orderByDesc('created_at')
            ->paginate(10);

        $formatted = $reviews->getCollection()->map(fn($r) => [
            'id'           => $r->id,
            'score'        => $r->score,
            'review_text'  => $r->review_text,
            'created_at'   => $r->created_at->toIso8601String(),
            'created_human'=> $r->created_at->diffForHumans(),
            'reviewer'     => [
                'display_name' => $r->reviewer->display_first_name,
                'avatar_url'   => $r->reviewer->avatar_url,
            ],
        ]);

        return $this->paginated($reviews, 'Reviews retrieved.', $formatted);
    }

    private function updateUserRating(int $userId): void
    {
        $avg = UserReview::where('reviewed_user_id', $userId)
            ->where('is_visible', true)
            ->avg('score');

        User::where('id', $userId)->update([
            'rating' => $avg ? round($avg, 2) : null,
        ]);
    }
}
