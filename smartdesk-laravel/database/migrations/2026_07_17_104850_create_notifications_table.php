<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {

        $table->id();

        $table->unsignedBigInteger('userid');

        $table->unsignedBigInteger('ticketid');

        $table->text('message');

        $table->timestamp('date');

        $table->foreign('userid')
              ->references('id')
              ->on('users')
              ->onDelete('cascade');

        $table->foreign('ticketid')
              ->references('id')
              ->on('tickets')
              ->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
