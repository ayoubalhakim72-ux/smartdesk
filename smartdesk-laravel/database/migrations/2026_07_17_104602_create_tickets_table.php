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
         Schema::create('tickets', function (Blueprint $table) {

        $table->id();

        $table->unsignedBigInteger('priorityid');

        $table->unsignedBigInteger('statusid');

        $table->unsignedBigInteger('categoryid');

        $table->unsignedBigInteger('createdby');

        $table->unsignedBigInteger('assignedto')->nullable();

        $table->timestamp('creation_date');

        $table->timestamp('update_date')->nullable();

        $table->timestamp('closed_date')->nullable();

        $table->string('title');

        $table->text('description');

        $table->foreign('priorityid')
              ->references('id')
              ->on('priorities')
              ->onDelete('restrict');

        $table->foreign('statusid')
              ->references('id')
              ->on('statuses')
              ->onDelete('restrict');

        $table->foreign('categoryid')
              ->references('id')
              ->on('categories')
              ->onDelete('restrict');

        $table->foreign('createdby')
              ->references('id')
              ->on('users')
              ->onDelete('restrict');

        $table->foreign('assignedto')
              ->references('id')
              ->on('users')
              ->onDelete('set null');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
