<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoticeBoardSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = DB::table('users')->where('email', 'admin@ezimconnect.com')->value('id');

        if (! $adminId) {
            $this->command->warn('  ⚠ Admin user not found. Skipping noticeboard seed.');
            return;
        }

        $posts = [
            [
                'title'        => 'Welcome to eZimConnect!',
                'content'      => 'eZimConnect is a peer-to-peer currency swap platform connecting Australians with their families in Zimbabwe. Send money home without the high fees of traditional remittance services. Our escrow system keeps your funds safe every step of the way. Get started by completing your KYC verification, then create your first order.',
                'post_type'    => 'announcement',
                'is_pinned'    => 1,
                'is_published' => 1,
                'published_at' => now(),
                'expires_at'   => null,
                'posted_by'    => $adminId,
                'view_count'   => 0,
            ],
            [
                'title'        => 'How to stay safe on eZimConnect',
                'content'      => 'Tips for safe trading: (1) Always complete your KYC before trading. (2) Never share your transaction PIN with anyone, including eZimConnect staff. (3) Only use the in-app chat for transaction communication — do not move conversations to WhatsApp or SMS. (4) Always verify the recipient details before confirming cash delivery. (5) If something feels wrong, raise a dispute immediately.',
                'post_type'    => 'tip',
                'is_pinned'    => 0,
                'is_published' => 1,
                'published_at' => now()->subDays(2),
                'expires_at'   => null,
                'posted_by'    => $adminId,
                'view_count'   => 0,
            ],
            [
                'title'        => 'Current AUD/USD Rate Update',
                'content'      => 'The current platform exchange rate is AUD 1 = USD 0.63. This is updated regularly by our team. You can view the full rate history chart on your dashboard. Set a rate alert in your account settings to be notified when the rate reaches your preferred level.',
                'post_type'    => 'rate_update',
                'is_pinned'    => 0,
                'is_published' => 1,
                'published_at' => now()->subDay(),
                'expires_at'   => now()->addDays(7),
                'posted_by'    => $adminId,
                'view_count'   => 0,
            ],
        ];

        foreach ($posts as $post) {
            DB::table('noticeboard_posts')->updateOrInsert(
                ['title' => $post['title'], 'posted_by' => $adminId],
                array_merge($post, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        $this->command->info('  ✓ Noticeboard posts seeded (' . count($posts) . ' posts)');
    }
}
