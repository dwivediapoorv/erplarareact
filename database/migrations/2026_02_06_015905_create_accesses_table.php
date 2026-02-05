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
        Schema::create('accesses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Seed default access types
        $defaultAccesses = [
            'Google Analytics',
            'Google Search Console',
            'Google Ads',
            'Google Business Profile',
            'Meta Business Suite',
            'Facebook',
            'Twitter',
            'Instagram',
            'Pinterest',
            'Shpopify Admin',
            'WordPress Admin',
            'Hosting/cPanel',
        ];

        foreach ($defaultAccesses as $access) {
            \App\Models\Access::create(['name' => $access]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accesses');
    }
};
