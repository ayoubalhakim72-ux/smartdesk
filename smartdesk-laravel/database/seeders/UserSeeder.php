<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([

           

            [
                'firstname' => 'John',
                'username' => 'john',
                'email' => 'john@smartdesk.com',
                'password' => Hash::make('password'),
                'roleid' => 2,
                'creationdate' => now(),
                'isbanned' => 0,
                'banreason' => null,
            ],

            [
                'firstname' => 'Sarah',
                'username' => 'sarah',
                'email' => 'sarah@smartdesk.com',
                'password' => Hash::make('password'),
                'roleid' => 2,
                'creationdate' => now(),
                'isbanned' => 0,
                'banreason' => null,
            ],

            [
                'firstname' => 'Ali',
                'username' => 'ali',
                'email' => 'ali@smartdesk.com',
                'password' => Hash::make('password'),
                'roleid' => 3,
                'creationdate' => now(),
                'isbanned' => 0,
                'banreason' => null,
            ],

            [
                'firstname' => 'Maya',
                'username' => 'maya',
                'email' => 'maya@smartdesk.com',
                'password' => Hash::make('password'),
                'roleid' => 3,
                'creationdate' => now(),
                'isbanned' => 0,
                'banreason' => null,
            ],

            [
                'firstname' => 'Rami',
                'username' => 'rami',
                'email' => 'rami@smartdesk.com',
                'password' => Hash::make('password'),
                'roleid' => 3,
                'creationdate' => now(),
                'isbanned' => 1,
                'banreason' => 'Repeated policy violations',
            ],

            [
                'firstname' => 'David',
                'username' => 'david',
                'email' => 'david@smartdesk.com',
                'password' => Hash::make('password'),
                'roleid' => 4,
                'creationdate' => now(),
                'isbanned' => 0,
                'banreason' => null,
            ],

            [
                'firstname' => 'Nour',
                'username' => 'nour',
                'email' => 'nour@smartdesk.com',
                'password' => Hash::make('password'),
                'roleid' => 4,
                'creationdate' => now(),
                'isbanned' => 0,
                'banreason' => null,
            ],

        ]);
    }
}