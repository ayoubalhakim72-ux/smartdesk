<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrioritySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('priorities')->insert([
            ['priority' => 'Low'],
            ['priority' => 'Medium'],
            ['priority' => 'High'],
            ['priority' => 'Critical'],
        ]);
    }
}