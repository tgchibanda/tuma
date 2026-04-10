<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoticeboardSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = DB::table('users')->where('email', 'admin@tuma.com')->value('id');
        DB::table('noticeboard_posts')->insert([
            ['title' => 'Welcome to TuMa!', 'content' => 'TuMa is a peer-to-peer platform connecting the Zimbabwean diaspora in Australia with trusted cash deliverers in Zimbabwe. No bank transfers required on the Zimbabwe side — just fast, safe, and affordable.', 'post_type' => 'announcement', 'is_pinned' => 1, 'is_published' => 1, 'published_at' => now(), 'expires_at' => null, 'posted_by' => $adminId, 'view_count' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'How to stay safe on TuMa', 'content' => 'Always complete KYC before trading. Only transact with users who have verified profiles and good ratings. Use Secure Delivery for your first few trades. Report any suspicious behaviour immediately.', 'post_type' => 'tip', 'is_pinned' => 0, 'is_published' => 1, 'published_at' => now(), 'expires_at' => null, 'posted_by' => $adminId, 'view_count' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Current AUD/USD Rate: 0.63', 'content' => 'The current platform rate is AUD 1.00 = USD 0.63. This rate is reviewed and updated regularly. You can always negotiate the final rate directly with your matched user.', 'post_type' => 'rate_update', 'is_pinned' => 0, 'is_published' => 1, 'published_at' => now(), 'expires_at' => null, 'posted_by' => $adminId, 'view_count' => 0, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}