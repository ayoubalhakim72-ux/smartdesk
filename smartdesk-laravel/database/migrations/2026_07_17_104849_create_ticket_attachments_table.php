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
         Schema::create('ticket_attachments', function (Blueprint $table) {

        $table->id();

        $table->unsignedBigInteger('ticketid');

        $table->unsignedBigInteger('userid');

        $table->string('filename');

        $table->string('filepath');

        $table->bigInteger('filesize');

        $table->timestamp('date');

        $table->foreign('ticketid')
              ->references('id')
              ->on('tickets')
              ->onDelete('cascade');

        $table->foreign('userid')
              ->references('id')
              ->on('users')
              ->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_attachments');
    }
};
