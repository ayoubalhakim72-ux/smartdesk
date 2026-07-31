<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    public function run(): void
    {
        $resolvedStatus = DB::table('statuses')
            ->where('status', 'Resolved')
            ->first();

        $returnedStatus = DB::table('statuses')
            ->where('status', 'Returned')
            ->first();

        // Preserve the existing status ID so tickets that used Resolved now use Returned.
        if ($resolvedStatus && !$returnedStatus) {
            DB::table('statuses')
                ->where('id', $resolvedStatus->id)
                ->update(['status' => 'Returned']);
        } elseif ($resolvedStatus && $returnedStatus) {
            DB::table('tickets')
                ->where('statusid', $resolvedStatus->id)
                ->update(['statusid' => $returnedStatus->id]);

            DB::table('statuses')
                ->where('id', $resolvedStatus->id)
                ->delete();
        }

        foreach (['Open', 'In Progress', 'Returned', 'Closed'] as $status) {
            DB::table('statuses')->updateOrInsert(['status' => $status]);
        }
    }
}
