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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('company_name')->nullable();
            $table->string('designation')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('source')->default('scrubbing_team'); // scrubbing_team, website, referral, etc
            $table->enum('status', [
                'new',
                'assigned',
                'in_progress',
                'connected',
                'hot_lead',
                'meeting_scheduled',
                'meeting_completed',
                'converted',
                'lost',
                'unqualified'
            ])->default('new');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->text('notes')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('current_owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('last_contacted_at')->nullable();
            $table->timestamp('next_follow_up_at')->nullable();
            $table->string('lost_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('current_owner_id');
            $table->index('next_follow_up_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
