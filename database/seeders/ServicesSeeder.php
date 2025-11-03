<?php

namespace Database\Seeders;

use App\Models\Services;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Search Engine Optimization',
            ],
            [
                'name' => 'Performance Maketing',
            ],
            [
                'name' => 'UI/UX Design',
            ],
            [
                'name' => 'Web Development',
            ],
            [
                'name' => 'Content Marketing',
            ],
            [
                'name' => 'Social Media Marketing',
            ],
            [
                'name' => 'Email Marketing',
            ],
            [
                'name' => 'eCommerce Marketing',
            ],
            [
                'name' => 'Graphics Designing',
            ],
        ];

        foreach ($services as $service) {
            Services::firstOrCreate(
                ['name' => $service['name']]
            );
        }
    }
}
