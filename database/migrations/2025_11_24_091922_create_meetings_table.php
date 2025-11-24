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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
            $table->foreignId('scheduled_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('scheduled_at');
            $table->integer('duration_minutes')->default(30);
            $table->string('meeting_type')->default('physical'); // physical, online, phone
            $table->string('meeting_link')->nullable(); // for online meetings
            $table->string('location')->nullable(); // for physical meetings
            $table->enum('status', [
                'scheduled',
                'rescheduled',
                'completed',
                'no_show',
                'cancelled'
            ])->default('scheduled');
            $table->enum('outcome', [
                'converted',
                'follow_up_needed',
                'not_interested',
                'proposal_sent',
                'thinking'
            ])->nullable();
            $table->text('meeting_notes')->nullable();
            $table->text('action_items')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('reschedule_count')->default(0);
            $table->foreignId('rescheduled_from')->nullable()->constrained('meetings')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('lead_id');
            $table->index('scheduled_by');
            $table->index('assigned_to');
            $table->index('scheduled_at');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
