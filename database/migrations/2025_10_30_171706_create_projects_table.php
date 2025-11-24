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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('project_name');
            $table->text('onboarding_notes')->nullable();
            $table->date('date_of_onboarding')->nullable();
            $table->date('project_start_date')->nullable();

            // Client Information
            $table->string('client_name');
            $table->string('website')->nullable();
            $table->string('email_address');
            $table->string('alternate_email_address')->nullable();
            $table->string('phone_number');
            $table->string('alternate_phone_number')->nullable();

            // Project Assignment
            $table->foreignId('assigned_to')->nullable()->constrained('employees')->onDelete('set null'); // SEO team member
            $table->foreignId('project_manager_id')->nullable()->constrained('employees')->onDelete('set null'); // Project Manager

            // Project Status
            $table->enum('project_health', ['Red', 'Green', 'Orange'])->default('Green');
            $table->enum('project_status', ['Active', 'On Hold', 'Suspended'])->default('Active');

            // Blog Information (conditional based on services)
            $table->integer('blogs_count')->nullable();
            $table->date('monthly_report_date')->nullable();

            // Payment Information
            $table->decimal('payment_amount', 10, 2)->nullable();
            $table->enum('payment_type', ['one_time', 'monthly', 'quarterly'])->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
