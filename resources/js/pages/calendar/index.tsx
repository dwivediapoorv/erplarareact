import SelfServiceLayout from '@/layouts/self-service-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Self Service Portal',
        href: '/employee/my-details',
    },
    {
        title: 'Calendar',
        href: '#',
    },
];

interface Holiday {
    id: number;
    name: string;
    date: string;
    type: 'national' | 'company' | 'optional';
    description: string | null;
    is_recurring: boolean;
}

interface LeaveRequest {
    id: number;
    start_date: string;
    end_date: string;
    leave_type: string;
    status: 'pending' | 'approved';
    total_days: number;
}

interface CalendarIndexProps {
    holidays: Holiday[];
    leaveRequests: LeaveRequest[];
    currentYear: number;
    currentMonth: number;
}

export default function CalendarIndex({ holidays, leaveRequests, currentYear, currentMonth }: CalendarIndexProps) {
    const { auth } = usePage().props as any;
    const canCreateHolidays = auth.permissions?.includes('create holidays');
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Helper functions
    const isSecondOrFourthSaturday = (date: Date): boolean => {
        if (date.getDay() !== 6) return false;
        const day = date.getDate();
        const weekOfMonth = Math.ceil(day / 7);
        return weekOfMonth === 2 || weekOfMonth === 4;
    };

    const isSunday = (date: Date): boolean => date.getDay() === 0;

    const getHolidaysForDate = (date: Date): Holiday[] => {
        // Format date as YYYY-MM-DD without timezone conversion
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        return holidays.filter(h => h.date === dateString);
    };

    const getLeaveRequestsForDate = (date: Date): LeaveRequest[] => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        return leaveRequests.filter(leave => {
            return dateString >= leave.start_date && dateString <= leave.end_date;
        });
    };

    // Calendar data
    const calendarData = useMemo(() => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayHolidays = getHolidaysForDate(date);
            const dayLeaves = getLeaveRequestsForDate(date);
            const isSat2nd4th = isSecondOrFourthSaturday(date);
            const isSun = isSunday(date);

            days.push({
                date: day,
                dateObj: date,
                holidays: dayHolidays,
                leaves: dayLeaves,
                isSecondOrFourthSaturday: isSat2nd4th,
                isSunday: isSun,
                isNonWorking: isSat2nd4th || isSun || dayHolidays.length > 0,
            });
        }

        return days;
    }, [year, month, holidays, leaveRequests]);

    const handlePrevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    const handleToday = () => {
        const today = new Date();
        setYear(today.getFullYear());
        setMonth(today.getMonth() + 1);
    };

    const getHolidayBadgeColor = (type: string) => {
        switch (type) {
            case 'national':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'company':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'optional':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    // Upcoming holidays list
    const upcomingHolidays = holidays
        .filter(h => new Date(h.date) >= new Date())
        .slice(0, 5);

    return (
        <SelfServiceLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <CalendarIcon className="h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Calendar</h1>
                    </div>
                    {canCreateHolidays && (
                        <Button asChild>
                            <Link href="/calendar/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Holiday
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Calendar - Main Section */}
                    <div className="lg:col-span-9">
                        <div className="rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                                <Button variant="outline" size="sm" onClick={handleToday}>
                                    Today
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <h2 className="text-lg font-semibold min-w-[200px] text-center">
                                        {monthNames[month - 1]} {year}
                                    </h2>
                                    <Button variant="outline" size="sm" onClick={handleNextMonth}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="p-4">
                                {/* Day Headers */}
                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7 gap-2">
                                    {calendarData.map((day, index) => {
                                        if (!day) {
                                            return <div key={`empty-${index}`} className="aspect-square" />;
                                        }

                                        const isToday =
                                            day.dateObj.getDate() === new Date().getDate() &&
                                            day.dateObj.getMonth() === new Date().getMonth() &&
                                            day.dateObj.getFullYear() === new Date().getFullYear();

                                        return (
                                            <div
                                                key={day.date}
                                                className={`
                                                    relative aspect-square border rounded-lg p-2 transition-colors
                                                    ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-sidebar-border/50'}
                                                    ${day.isNonWorking ? 'bg-red-50 dark:bg-red-950/30' : 'bg-background'}
                                                    ${day.holidays.length > 0 ? 'border-red-300 dark:border-red-700' : ''}
                                                `}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <div className={`text-sm font-semibold ${day.isNonWorking ? 'text-red-600 dark:text-red-400' : ''}`}>
                                                        {day.date}
                                                    </div>
                                                    <div className="flex-1 mt-1 overflow-y-auto space-y-1">
                                                        {/* Holidays */}
                                                        {day.holidays.length > 0 && (
                                                            <div className="space-y-1">
                                                                {day.holidays.map((holiday) => (
                                                                    <div key={holiday.id} className="text-xs font-medium text-red-600 dark:text-red-400 line-clamp-2">
                                                                        {holiday.name}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Leave Requests */}
                                                        {day.leaves && day.leaves.length > 0 && (
                                                            <div className="space-y-1">
                                                                {day.leaves.map((leave) => (
                                                                    <div
                                                                        key={leave.id}
                                                                        className={`text-xs px-1 py-0.5 rounded ${
                                                                            leave.status === 'approved'
                                                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                        }`}
                                                                    >
                                                                        {leave.status === 'approved' ? 'On Leave' : 'Pending'}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Weekend labels (only if no holidays or leaves) */}
                                                        {day.holidays.length === 0 && (!day.leaves || day.leaves.length === 0) && (
                                                            <>
                                                                {day.isSunday && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Sunday
                                                                    </div>
                                                                )}
                                                                {day.isSecondOrFourthSaturday && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        2nd/4th Sat
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Legend and Upcoming Holidays */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Legend */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                            <h3 className="text-base font-semibold mb-3">Legend</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-700"></div>
                                    <span>Holiday / Non-working day</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-blue-50 dark:bg-blue-950 border border-blue-500"></div>
                                    <span>Today</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700"></div>
                                    <span>Approved Leave</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700"></div>
                                    <span>Pending Leave</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-sidebar-border/50">
                                <h4 className="text-sm font-semibold mb-2">Holiday Types</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded ${getHolidayBadgeColor('national')}`}>
                                            National
                                        </span>
                                        <span className="text-muted-foreground">Public holidays</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded ${getHolidayBadgeColor('company')}`}>
                                            Company
                                        </span>
                                        <span className="text-muted-foreground">Company holidays</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded ${getHolidayBadgeColor('optional')}`}>
                                            Optional
                                        </span>
                                        <span className="text-muted-foreground">Optional holidays</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Holidays */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                            <h3 className="text-base font-semibold mb-3">Upcoming Holidays</h3>
                            {upcomingHolidays.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingHolidays.map((holiday) => (
                                        <div key={holiday.id} className="border-b border-sidebar-border/50 last:border-0 pb-3 last:pb-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{holiday.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                        {new Date(holiday.date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-xs ${getHolidayBadgeColor(holiday.type)}`}>
                                                    {holiday.type}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No upcoming holidays</p>
                            )}
                        </div>

                        {/* Working Days Info */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
                            <h3 className="text-base font-semibold mb-3">Working Days Policy</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• All Sundays are holidays</li>
                                <li>• 2nd & 4th Saturdays are holidays</li>
                                <li>• Other Saturdays are working days</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </SelfServiceLayout>
    );
}
