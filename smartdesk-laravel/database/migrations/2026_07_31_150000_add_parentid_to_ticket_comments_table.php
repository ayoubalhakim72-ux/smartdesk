<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_comments', function (Blueprint $table) {
            $table->unsignedBigInteger('parentid')->nullable();

            $table->foreign('parentid')
                ->references('id')
                ->on('ticket_comments')
                ->onDelete('cascade');

            $table->index(['ticketid', 'parentid']);
        });
    }

    public function down(): void
    {
        Schema::table('ticket_comments', function (Blueprint $table) {
            $table->dropForeign(['parentid']);
            $table->dropIndex(['ticketid', 'parentid']);
            $table->dropColumn('parentid');
        });
    }
};
