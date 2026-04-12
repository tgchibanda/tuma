<?php
namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderExpiredNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public function __construct(public readonly mixed $data = null) {}
    public function via(mixed $notifiable): array { return ['database']; }
    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('eZimConnect — Order Update')
            ->greeting('Hi ' . $notifiable->display_first_name . ',')
            ->line('Your order status has changed.')
            ->action('View Orders', url('/orders'))
            ->line('Thank you for using eZimConnect.');
    }
    public function toDatabase(mixed $notifiable): array
    {
        return ['message' => 'Your order status has changed.', 'action_url' => '/orders'];
    }
}
