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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();

            // User who created the task
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');

            // User to whom the task is assigned
            $table->foreignId('assigned_to')->constrained('users')->onDelete('cascade');

            // Project association
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');

            // Task status: Pending, Completed, Approved (Closed)
            $table->enum('status', ['Pending', 'Completed', 'Approved'])->default('Pending');

            // Due date for the task
            $table->date('due_date')->nullable();

            // Timestamp when task was completed by assignee
            $table->timestamp('completed_at')->nullable();

            // User who approved/closed the task
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
