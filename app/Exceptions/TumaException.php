<?php
// FILE: app/Exceptions/TumaException.php

namespace App\Exceptions;

use RuntimeException;

class TumaException extends RuntimeException
{
    public function __construct(
        string $message,
        private readonly int $statusCode = 422
    ) {
        parent::__construct($message);
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
        ], $this->statusCode);
    }
}
