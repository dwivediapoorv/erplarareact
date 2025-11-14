import SelfServiceLayout from '@/layouts/self-service-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle, Building, Calendar, CreditCard, DollarSign, FileText, Phone, User, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Self Service Portal',
        href: '/employee/my-details',
    },
    {
        title: 'My Details',
        href: '#',
    },
];

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    phone: string | null;
    ein: string | null;
    designation: string | null;
    gender: 'male' | 'female' | 'other' | null;
    date_of_joining: string | null;
    date_of_exit: string | null;
    salary: string | null;
    aadhar_number: string | null;
    pan_number: string | null;
    uan_number: string | null;
    account_holder_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    team: {
        id: number;
        name: string;
    } | null;
    reporting_manager: {
        id: number;
        name: string;
    } | null;
}

interface MyDetailsProps {
    employee: Employee;
}

export default function MyDetails({ employee }: MyDetailsProps) {
    const formatDate = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: string | null) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(parseFloat(amount));
    };

    const maskSensitiveData = (data: string | null, visibleChars: number = 4) => {
        if (!data) return 'N/A';
        const masked = '*'.repeat(Math.max(0, data.length - visibleChars)) + data.slice(-visibleChars);
        return masked;
    };

    return (
        <SelfServiceLayout breadcrumbs={breadcrumbs}>
            <Head title="My Employment Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">My Employment Details</h1>
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                        To update any information shown here, please connect with HR department.
                    </AlertDescription>
                </Alert>

                <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Personal Information</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    First Name
                                </label>
                                <p className="mt-1 text-sm font-medium">{employee.first_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    Last Name
                                </label>
                                <p className="mt-1 text-sm font-medium">{employee.last_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    Phone
                                </label>
                                <p className="mt-1 text-sm font-medium">{employee.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    Gender
                                </label>
                                <p className="mt-1 text-sm font-medium capitalize">{employee.gender || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Work Information */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <div className="flex items-center gap-2 mb-4">
                            <Building className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Work Information</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    Employee ID (EIN)
                                </label>
                                <p className="mt-1 text-sm font-medium font-mono">{employee.ein || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    Designation
                                </label>
                                <p className="mt-1 text-sm font-medium">{employee.designation || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    Team
                                </label>
                                <p className="mt-1 text-sm font-medium">{employee.team?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    Reporting Manager
                                </label>
                                <p className="mt-1 text-sm font-medium">{employee.reporting_manager?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Date of Joining
                                </label>
                                <p className="mt-1 text-sm font-medium">{formatDate(employee.date_of_joining)}</p>
                            </div>
                            {employee.date_of_exit && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Date of Exit
                                    </label>
                                    <p className="mt-1 text-sm font-medium">{formatDate(employee.date_of_exit)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Compensation */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Compensation</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    Monthly Salary
                                </label>
                                <p className="mt-1 text-sm font-medium">{formatCurrency(employee.salary)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Identity Documents */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Identity Documents</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    Aadhar Number
                                </label>
                                <p className="mt-1 text-sm font-medium font-mono">
                                    {maskSensitiveData(employee.aadhar_number)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    PAN Number
                                </label>
                                <p className="mt-1 text-sm font-medium font-mono">
                                    {maskSensitiveData(employee.pan_number)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    UAN Number
                                </label>
                                <p className="mt-1 text-sm font-medium font-mono">
                                    {employee.uan_number || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Account Details */}
                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Bank Account Details</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    Account Holder Name
                                </label>
                                <p className="mt-1 text-sm font-medium">
                                    {employee.account_holder_name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    Account Number
                                </label>
                                <p className="mt-1 text-sm font-medium font-mono">
                                    {maskSensitiveData(employee.account_number)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground uppercase">
                                    IFSC Code
                                </label>
                                <p className="mt-1 text-sm font-medium font-mono">
                                    {employee.ifsc_code || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SelfServiceLayout>
    );
}
