<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SwapMatch;
use App\Models\User;
use App\Models\UserReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/v1/matches/{ulid}/rate
     * Creates or updates the authenticated user's review for a completed match.
     * Only one review per person per match — submitting again updates it.
     */
    public function store(Request $request, string $ulid): JsonResponse
    {
        $request->validate([
            'score'       => ['required', 'integer', 'min:1', 'max:5'],
            'review_text' => ['nullable', 'string', 'max:500'],
            'comment'     => ['nullable', 'string', 'max:500'], // frontend alias
        ]);

        $userId = $request->user()->id;
        $match  = SwapMatch::where('ulid', $ulid)
            ->with(['sendOrder', 'receiveOrder'])
            ->first();

        if (! $match) return $this->notFound('Match not found.');

        // Inline involvement check — no involvesUser(stdClass) call
        if ($match->sendOrder?->user_id !== $userId && $match->receiveOrder?->user_id !== $userId) {
            return $this->forbidden('Access denied.');
        }

        if ($match->status !== SwapMatch::STATUS_COMPLETED) {
            return $this->error('Reviews can only be submitted for completed transactions.', 422);
        }

        // Accept review_text OR comment — frontend sends 'comment'
        $reviewText = $request->review_text ?? $request->comment;

        // Upsert: if a review already exists, update it
        $existing = UserReview::where('swap_match_id', $match->id)
            ->where('reviewer_id', $userId)
            ->first();

        if ($existing) {
            $existing->update([
                'score'       => $request->score,
                'review_text' => $reviewText,
            ]);
            $this->recalcRating($existing->reviewed_user_id);
            return $this->success([
                'id'          => $existing->id,
                'score'       => $existing->score,
                'review_text' => $existing->review_text,
            ], 'Review updated.');
        }

        $reviewedUserId = $userId === $match->sendOrder->user_id
            ? $match->receiveOrder->user_id
            : $match->sendOrder->user_id;

        $review = UserReview::create([
            'reviewer_id'      => $userId,
            'reviewed_user_id' => $reviewedUserId,
            'swap_match_id'    => $match->id,
            'score'            => $request->score,
            'review_text'      => $reviewText,
            'is_visible'       => true,
        ]);

        $this->recalcRating($reviewedUserId);

        return $this->created([
            'id'          => $review->id,
            'score'       => $review->score,
            'review_text' => $review->review_text,
        ], 'Review submitted. Thank you.');
    }

    /**
     * GET /api/v1/matches/{ulid}/my-review
     * Returns the authenticated user's own review for this match (if any).
     */
    public function myReview(Request $request, string $ulid): JsonResponse
    {
        $match  = SwapMatch::where('ulid', $ulid)->firstOrFail();
        $review = UserReview::where('swap_match_id', $match->id)
            ->where('reviewer_id', $request->user()->id)
            ->first();

        return $this->success($review ? [
            'id'          => $review->id,
            'score'       => $review->score,
            'review_text' => $review->review_text,
            'created_at'  => $review->created_at?->toDateString(),
        ] : null, 'Review retrieved.');
    }

    /**
     * DELETE /api/v1/matches/{ulid}/my-review
     * Deletes the authenticated user's review for this match.
     */
    public function destroyMyReview(Request $request, string $ulid): JsonResponse
    {
        $match  = SwapMatch::where('ulid', $ulid)->firstOrFail();
        $review = UserReview::where('swap_match_id', $match->id)
            ->where('reviewer_id', $request->user()->id)
            ->first();

        if (! $review) return $this->notFound('No review found.');

        $reviewedUserId = $review->reviewed_user_id;
        $review->delete();
        $this->recalcRating($reviewedUserId);

        return $this->success(null, 'Review deleted.');
    }

    /**
     * GET /api/v1/users/{ulid}/reviews
     * Public reviews for a user's profile page.
     */
    public function indexForUser(string $ulid): JsonResponse
    {
        $user    = User::where('ulid', $ulid)->firstOrFail();
        $reviews = UserReview::where('reviewed_user_id', $user->id)
            ->where('is_visible', true)
            ->with('reviewer')
            ->orderByDesc('created_at')
            ->paginate(10);

        return $this->paginated($reviews, 'Reviews retrieved.', $reviews->getCollection()->map(fn($r) => [
            'id'          => $r->id,
            'score'       => $r->score,
            'review_text' => $r->review_text,
            'reviewer'    => [
                'display_name' => $r->reviewer->display_first_name,
                'avatar_url'   => $r->reviewer->avatar_url,
            ],
            'created_at'  => $r->created_at->toDateString(),
        ]));
    }

    /**
     * GET /api/v1/user/reviews
     * Reviews the authenticated user has written.
     */
    public function indexForMe(Request $request): JsonResponse
    {
        $reviews = UserReview::where('reviewer_id', $request->user()->id)
            ->with('reviewedUser')
            ->orderByDesc('created_at')
            ->paginate(10);

        return $this->paginated($reviews, 'Your reviews retrieved.', $reviews->getCollection()->map(fn($r) => [
            'id'            => $r->id,
            'score'         => $r->score,
            'review_text'   => $r->review_text,
            'reviewed_user' => [
                'display_name' => $r->reviewedUser->display_first_name,
                'avatar_url'   => $r->reviewedUser->avatar_url,
            ],
            'match_ulid'    => $r->swapMatch?->ulid,
            'created_at'    => $r->created_at->toDateString(),
        ]));
    }

    private function recalcRating(int $userId): void
    {
        $avg = UserReview::where('reviewed_user_id', $userId)
            ->where('is_visible', true)
            ->avg('score');
        User::where('id', $userId)->update(['rating' => $avg ? round($avg, 2) : null]);
    }
}
