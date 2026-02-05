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
        Schema::table('projects', function (Blueprint $table) {
            // Business Details
            $table->string('business_name')->nullable()->after('client_name');
            $table->string('business_type')->nullable()->after('business_name');

            // Business Address
            $table->text('business_address')->nullable()->after('alternate_phone_number');
            $table->string('city')->nullable()->after('business_address');
            $table->string('state')->nullable()->after('city');
            $table->string('country')->nullable()->after('state');
            $table->string('postal_code')->nullable()->after('country');

            // Communication Preferences
            $table->enum('preferred_contact_method', ['email', 'phone', 'whatsapp', 'video_call'])->nullable()->after('postal_code');
            $table->string('timezone')->nullable()->after('preferred_contact_method');

            // Industry/Niche
            $table->string('industry')->nullable()->after('timezone');

            // Social Media Links (JSON array)
            $table->json('social_media_links')->nullable()->after('industry');

            // Competitors (JSON array)
            $table->json('competitors')->nullable()->after('social_media_links');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'business_name',
                'business_type',
                'business_address',
                'city',
                'state',
                'country',
                'postal_code',
                'preferred_contact_method',
                'timezone',
                'industry',
                'social_media_links',
                'competitors',
            ]);
        });
    }
};
