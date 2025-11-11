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
        Schema::create('content_flows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('primary_keyword');
            $table->json('secondary_keywords')->nullable();
            $table->json('faqs')->nullable();
            $table->enum('approval_status', ['Awaiting Approval', 'Client Approved', 'Internally Approved'])->default('Awaiting Approval');
            $table->date('published_on')->nullable();
            $table->decimal('ai_score', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_flows');
    }
};
