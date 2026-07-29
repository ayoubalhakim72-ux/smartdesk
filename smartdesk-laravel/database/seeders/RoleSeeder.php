<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            ['role' => 'Admin'],
            ['role' => 'IT Support Agent'],
            ['role' => 'Employee'],
            ['role' => 'Manager'],
        ]);

        
    }
}