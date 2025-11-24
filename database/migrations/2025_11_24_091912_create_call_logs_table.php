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
        Schema::create('call_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
            $table->foreignId('called_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('called_at');
            $table->enum('call_status', [
                'connected',
                'not_connected',
                'busy',
                'no_answer',
                'wrong_number',
                'switched_off',
                'not_reachable'
            ]);
            $table->enum('call_disposition', [
                'interested',
                'not_interested',
                'call_back_later',
                'hot_lead',
                'meeting_scheduled',
                'wrong_person',
                'language_barrier',
                'already_using_service',
                'budget_constraints',
                'not_decision_maker'
            ])->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->text('call_notes')->nullable();
            $table->text('pitch_response')->nullable();
            $table->timestamp('next_follow_up_at')->nullable();
            $table->string('recording_url')->nullable();
            $table->timestamps();

            $table->index('lead_id');
            $table->index('called_by');
            $table->index('called_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('call_logs');
    }
};
