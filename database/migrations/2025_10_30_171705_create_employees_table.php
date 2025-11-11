<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Disable transactions for this migration
     */
    public $withinTransaction = false;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('team_id')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();

            // Employment Details
            $table->date('date_of_joining')->nullable();
            $table->date('date_of_exit')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->unsignedBigInteger('reporting_manager_id')->nullable();

            // Identity Documents
            $table->string('aadhar_number')->nullable();
            $table->string('pan_number')->nullable();
            $table->string('uan_number')->nullable();

            // Bank Account Details
            $table->string('account_holder_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();

            $table->timestamps();
        });

        // Add foreign keys separately
        Schema::table('employees', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');
            $table->foreign('reporting_manager_id')->references('id')->on('employees')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
