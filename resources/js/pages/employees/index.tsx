import AppLayout from '@/layouts/app-layout';
import employees from '@/routes/employees';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { DataTable, type Column } from '@/components/data-table';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: employees.index().url,
    },
];

interface Employee {
    id: number;
    user_id: number;
    name: string;
    email: string;
    is_active: boolean;
    first_name: string;
    last_name: string;
    phone: string;
    ein: string | null;
    designation: string | null;
    gender: string | null;
    team_label: string;
    date_of_joining: string | null;
    date_of_exit: string | null;
    salary: string | null;
    reporting_manager: string | null;
    aadhar_number: string | null;
    pan_number: string | null;
    uan_number: string | null;
    account_holder_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
}

interface EmployeesIndexProps {
    employees: Employee[];
    columnPreferences?: Record<string, boolean> | null;
}

export default function EmployeesIndex({ employees: employeesList, columnPreferences }: EmployeesIndexProps) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const columns: Column<Employee>[] = [
        {
            key: 'first_name',
            label: 'First Name',
        },
        {
            key: 'last_name',
            label: 'Last Name',
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'phone',
            label: 'Phone',
            defaultVisible: true,
            render: (employee) => employee.phone || 'N/A',
        },
        {
            key: 'ein',
            label: 'EIN',
            defaultVisible: false,
            render: (employee) => employee.ein || 'N/A',
        },
        {
            key: 'designation',
            label: 'Designation',
            defaultVisible: false,
            render: (employee) => employee.designation || 'N/A',
        },
        {
            key: 'gender',
            label: 'Gender',
            defaultVisible: false,
            render: (employee) => employee.gender ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1) : 'N/A',
        },
        {
            key: 'team_label',
            label: 'Team',
            defaultVisible: true,
        },
        {
            key: 'date_of_joining',
            label: 'Date of Joining',
            defaultVisible: false,
            render: (employee) => employee.date_of_joining || 'N/A',
        },
        {
            key: 'date_of_exit',
            label: 'Date of Exit',
            defaultVisible: false,
            render: (employee) => employee.date_of_exit || 'N/A',
        },
        {
            key: 'salary',
            label: 'Salary',
            defaultVisible: false,
            render: (employee) => employee.salary ? `¹${employee.salary}` : 'N/A',
        },
        {
            key: 'reporting_manager',
            label: 'Reporting Manager',
            defaultVisible: false,
            render: (employee) => employee.reporting_manager || 'N/A',
        },
        {
            key: 'aadhar_number',
            label: 'Aadhar Number',
            defaultVisible: false,
            render: (employee) => employee.aadhar_number || 'N/A',
        },
        {
            key: 'pan_number',
            label: 'PAN Number',
            defaultVisible: false,
            render: (employee) => employee.pan_number || 'N/A',
        },
        {
            key: 'uan_number',
            label: 'UAN Number',
            defaultVisible: false,
            render: (employee) => employee.uan_number || 'N/A',
        },
        {
            key: 'account_holder_name',
            label: 'Account Holder Name',
            defaultVisible: false,
            render: (employee) => employee.account_holder_name || 'N/A',
        },
        {
            key: 'account_number',
            label: 'Account Number',
            defaultVisible: false,
            render: (employee) => employee.account_number || 'N/A',
        },
        {
            key: 'ifsc_code',
            label: 'IFSC Code',
            defaultVisible: false,
            render: (employee) => employee.ifsc_code || 'N/A',
        },
        {
            key: 'is_active',
            label: 'Status',
            filterable: false,
            render: (employee) => (
                employee.is_active ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Inactive
                    </span>
                )
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showSuccess && flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Employees</h1>
                </div>
                <DataTable
                    columns={columns}
                    data={employeesList}
                    searchPlaceholder="Search employees by name, email, or team..."
                    emptyMessage="No employees found"
                    pageName="employees.index"
                    savedPreferences={columnPreferences}
                />
            </div>
        </AppLayout>
    );
}
