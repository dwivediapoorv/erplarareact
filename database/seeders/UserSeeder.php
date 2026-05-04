<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Aarti Rathi',
                'email' => 'hrconnect@digirockett.com',
                'password' => 'password',
                'first_name' => 'Aarti',
                'last_name' => 'Rathi',
                'phone' => '+919910281749',
                'team_id' => '2',
                'salary' => 21600,
                'date_of_joining' => '2024-02-05',
            ],
            [
                'name' => 'Anurag Sharma',
                'email' => 'anurag@digirockett.com',
                'password' => 'password',
                'first_name' => 'Anurag',
                'last_name' => 'Sharma',
                'phone' => '+919354517293',
                'team_id' => '7',
                'salary' => 59800,
                'date_of_joining' => '2023-10-17',
            ],
            [
                'name' => 'Apoorv Dwivedi',
                'email' => 'apoorv@digirockett.com',
                'password' => 'password',
                'first_name' => 'Apoorv',
                'last_name' => 'Dwivedi',
                'phone' => '+919711574747',
                'team_id' => '1',
                'salary' => 60000,
                'date_of_joining' => '2023-07-19',
            ],
            [
                'name' => 'Bhumika Singh',
                'email' => 'Bhumika@digirockett.com',
                'password' => 'password',
                'first_name' => 'Bhumika',
                'last_name' => 'Singh',
                'phone' => '+919999999906',
                'team_id' => '8',
                'salary' => 30000,
                'date_of_joining' => '2025-07-21',
            ],
            [
                'name' => 'Kajal Singh',
                'email' => 'kajal.s@digirockett.com',
                'password' => 'password',
                'first_name' => 'Kajal',
                'last_name' => 'Singh',
                'phone' => '+919999999914',
                'team_id' => '5',
                'salary' => 10000,
                'date_of_joining' => '2025-07-04',
            ],
            [
                'name' => 'Navneet Raj',
                'email' => 'raj.navneet@digirockett.com',
                'password' => 'password',
                'first_name' => 'Navneet',
                'last_name' => 'Raj',
                'phone' => '+919999999920',
                'team_id' => '5',
                'salary' => 24000,
                'date_of_joining' => '2024-08-08',
            ],
            [
                'name' => 'Nikhar Makkar',
                'email' => 'nikhar.makkar@digirockett.com',
                'password' => 'password',
                'first_name' => 'Nikhar',
                'last_name' => 'Makkar',
                'phone' => '+918837614969',
                'team_id' => '10',
                'salary' => 44000,
                'date_of_joining' => '2022-05-02',
            ],
            [
                'name' => 'Pratyaksh Srivastava ',
                'email' => 'pratyaksh.srivastava@digirockett.com',
                'password' => 'password',
                'first_name' => 'Pratyaksh',
                'last_name' => 'Srivastava',
                'phone' => '+919999999924',
                'team_id' => '6',
                'salary' => 27500,
                'date_of_joining' => '2024-12-15',
            ],
            [
                'name' => 'Ritika Singh',
                'email' => 'ritika.singh@digirockett.com',
                'password' => 'password',
                'first_name' => 'Ritika',
                'last_name' => 'Singh',
                'phone' => '+919905484507',
                'team_id' => '4',
                'salary' => 30000,
                'date_of_joining' => '2025-05-19',
            ],
            [
                'name' => 'Shashwat Srivastava',
                'email' => 'shashwat.srivastava@digirockett.com',
                'password' => 'password',
                'first_name' => 'Shashwat',
                'last_name' => 'Srivastava',
                'phone' => '+918948628976',
                'team_id' => '7',
                'salary' => 30000,
                'date_of_joining' => '2024-07-15',
            ],
            [
                'name' => 'Shubhranshu Srivastava',
                'email' => 'shubh@digirockett.com',
                'password' => 'password',
                'first_name' => 'Shubhranshu',
                'last_name' => 'Srivastava',
                'phone' => '+918860301476',
                'team_id' => '1',
                'salary' => 200000,
                'date_of_joining' => '2022-04-01',
            ],
            [
                'name' => 'Shweta Singh',
                'email' => 'shweta.singh@digirockett.com',
                'password' => 'password',
                'first_name' => 'Shweta',
                'last_name' => 'Singh',
                'phone' => '+919999999938',
                'team_id' => '10',
                'salary' => 25000,
                'date_of_joining' => '2025-05-09',
            ],
            [
                'name' => 'Sidharth Anant',
                'email' => 'sidharth.anant@digirockett.com',
                'password' => 'password',
                'first_name' => 'Sidharth',
                'last_name' => 'Anant',
                'phone' => '+917830010567',
                'team_id' => '10',
                'salary' => 80000,
                'date_of_joining' => '2022-07-04',
            ],
            [
                'name' => 'Sumit Sisodiya',
                'email' => 'sumit.s@digirockett.com',
                'password' => 'password',
                'first_name' => 'Sumit',
                'last_name' => 'Sisodiya',
                'phone' => '+919999999942',
                'team_id' => '5',
                'salary' => 15000,
                'date_of_joining' => '2025-06-23',
            ],
            [
                'name' => 'Sunny Kumar',
                'email' => 'sunny@digirockett.com',
                'password' => 'password',
                'first_name' => 'Sunny',
                'last_name' => 'Kumar',
                'phone' => '+918505902240',
                'team_id' => '1',
                'salary' => 200000,
                'date_of_joining' => '2022-04-01',
            ],
            [
                'name' => 'Ujjawal Srivastava',
                'email' => 'Ujjawal@digirockett.com',
                'password' => 'password',
                'first_name' => 'Ujjawal',
                'last_name' => 'Srivastava',
                'phone' => '+919999999947',
                'team_id' => '5',
                'salary' => 10000,
                'date_of_joining' => '2025-07-05',
            ],


        ];

        foreach ($users as $userData) {
            // Create the user
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'email_verified_at' => now(),
                'is_active' => 1,
            ]);

            // Create the corresponding employee record
            // Note: reporting_manager_id will be set by ReportingManagerSeeder
            Employee::create([
                'user_id' => $user->id,
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'phone' => $userData['phone'],
                'team_id' => $userData['team_id'],
                'salary' => $userData['salary'],
                'date_of_joining' => $userData['date_of_joining'],
            ]);
        }
    }
}
