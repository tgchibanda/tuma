<?php

namespace App\Exceptions;

use RuntimeException;

class TumaException extends RuntimeException
{
    public function __construct(
        string $message = '',
        protected int $statusCode = 400,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $statusCode, $previous);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function render(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'data'    => null,
            'errors'  => null,
        ], $this->statusCode);
    }
}
