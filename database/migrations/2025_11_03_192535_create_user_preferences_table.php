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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('page'); // e.g., 'projects.index', 'users.index'
            $table->string('preference_key'); // e.g., 'column_visibility'
            $table->json('preference_value'); // stores the actual preference data
            $table->timestamps();

            // Ensure one preference per user per page per key
            $table->unique(['user_id', 'page', 'preference_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
