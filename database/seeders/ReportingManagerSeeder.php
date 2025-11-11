<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReportingManagerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeder updates the reporting_manager_id for employees.
     * Run this AFTER UserSeeder has created all users and employees.
     *
     * Usage: php artisan db:seed --class=ReportingManagerSeeder
     */
    public function run(): void
    {
        // Define reporting relationships using employee IDs
        // Format: employee_id => reporting_manager_id
        $reportingRelationships = [
            1 => 30,   // Aarti Rathi reports to employee ID 30
            2 => 17,   // Aishwarya reports to employee ID 17
            3 => 17,   // Aman Gupta reports to employee ID 17
            4 => 5, // Anurag Sharma - no manager
            5 => 30,   // Apoorv Dwivedi reports to employee ID 36
            6 => 5, // Bhumika Singh - no manager
            7 => 4, // Garvit Sharma - no manager
            8 => 17,   // Gracie Lamnunnem Chongloi reports to employee ID 17
            9 => 17,   // Harsh Bhargav reports to employee ID 17
            10 => 17,  // Harsh Raj reports to employee ID 17
            11 => 22, // Harshdeep Singh - no manager
            12 => 4, // Harshit Singla - no manager
            13 => 27,  // Kajal Singh reports to employee ID 32
            14 => 22, // Kanika Jain - no manager
            15 => 17,  // Keshav Pundir reports to employee ID 17
            16 => 17,  // Ketou Nakhro reports to employee ID 17
            17 => 30, // Lalit Nailwal - no manager
            18 => 5, // Mahfooz Alam - no manager
            19 => 7, // Navneet Raj - no manager
            20 => 32, // Nikhar Makkar - no manager
            21 => 27,  // Nitesh Srivastava reports to employee ID 32
            22 => 5, // Pratyaksh Srivastava - no manager
            23 => 32, // Radhika Sharma - no manager
            24 => 17,  // Ritesh Saxena reports to employee ID 17
            25 => 5, // Ritika Singh - no manager
            26 => 22, // Sakshi Kushwaha - no manager
            27 => 4, // Sanjeev Kumar - no manager
            28 => 4, // Shashwat Srivastava - no manager
            29 => 17,  // Shreya Karkera reports to employee ID 17
            30 => null, // Shubhranshu Srivastava - no manager
            31 => 32, // Shweta Singh - no manager
            32 => 30,  // Sidharth Anant reports to employee ID 36
            33 => 27,  // Sohan Kumar reports to employee ID 32
            34 => 7,   // Sumit Sisodiya reports to employee ID 7
            35 => null, // Sunny Kumar - no manager
            36 => 17,  // Suraj Kumar reports to employee ID 17
            37 => 17,  // Suresh Vishnoi reports to employee ID 17
            38 => 7, // Swadha Mishra - no manager
            39 => 7,   // Ujjawal Srivastava reports to employee ID 7
            40 => 5,   // Upasana Rathore reports to employee ID 5
        ];

        foreach ($reportingRelationships as $employeeId => $managerId) {
            $employee = Employee::find($employeeId);

            if ($employee) {
                // Verify that the manager exists if manager ID is provided
                if ($managerId !== null) {
                    $manager = Employee::find($managerId);
                    if (!$manager) {
                        $this->command->warn("Warning: Manager ID {$managerId} not found for employee ID {$employeeId}. Skipping.");
                        continue;
                    }
                }

                $employee->reporting_manager_id = $managerId;
                $employee->save();

                if ($managerId) {
                    $this->command->info("Updated: Employee ID {$employeeId} now reports to Employee ID {$managerId}");
                } else {
                    $this->command->info("Updated: Employee ID {$employeeId} has no reporting manager");
                }
            } else {
                $this->command->error("Error: Employee ID {$employeeId} not found");
            }
        }

        $this->command->info('Reporting manager relationships updated successfully!');
    }
}
