<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Administration',
            ],
            [
                'name' => 'Human Resource',
            ],
            [
                'name' => 'Sales',
            ],
            [
                'name' => 'Development',
            ],
            [
                'name' => 'Search Engine Optimization',
            ],
            [
                'name' => 'Graphics Designing',
            ],
            [
                'name' => 'Performance Marketing',
            ],
            [
                'name' => 'Content Writing',
            ],
            [
                'name' => 'Operations',
            ],
            [
                'name' => 'Project Management',
            ],

        ];

        foreach ($teams as $team) {
            Team::firstOrCreate(
                ['name' => $team['name']]
            );
        }

    }
}
