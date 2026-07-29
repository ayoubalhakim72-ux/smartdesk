<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('statuses')->insert([
            ['status' => 'Open'],
            ['status' => 'In Progress'],
            ['status' => 'Resolved'],
            ['status' => 'Closed'],
        ]);
    }
}