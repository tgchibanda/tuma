<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * Send an SMS message to a phone number.
     *
     * Currently logs to file for development.
     * Replace the body of this method with a real provider:
     *
     * Twilio example:
     *   $client = new \Twilio\Rest\Client(config('services.twilio.sid'), config('services.twilio.token'));
     *   $client->messages->create($to, ['from' => config('services.twilio.from'), 'body' => $message]);
     *
     * AWS SNS example:
     *   $sns = new \Aws\Sns\SnsClient([...]);
     *   $sns->publish(['PhoneNumber' => $to, 'Message' => $message]);
     */
    public function send(string $to, string $message): bool
    {
        // Development: log the SMS instead of sending
        Log::channel('daily')->info('SMS', [
            'to'      => $to,
            'message' => $message,
            'time'    => now()->toIso8601String(),
        ]);

        // In production: return true on success, false on failure
        return true;
    }
}
