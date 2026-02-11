import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import clientInteractions from '@/routes/client-interactions';
import employees from '@/routes/employees';
import minutesOfMeetings from '@/routes/minutes-of-meetings';
import payments from '@/routes/payments';
import permissions from '@/routes/permissions';
import projects from '@/routes/projects';
import services from '@/routes/services';
import tasks from '@/routes/tasks';
import teams from '@/routes/teams';
import users from '@/routes/users';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Briefcase, CheckSquare, ClipboardList, CreditCard, LayoutGrid, MessageSquare, Settings, Shield, Users, UsersRound, FileText } from 'lucide-react';
import AppLogo from './app-logo';

const allNavItems: (NavItem & { permission?: string })[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: users.index(),
        icon: Users,
        permission: 'view users',
    },
    {
        title: 'Employees',
        href: employees.index(),
        icon: UsersRound,
        permission: 'view employees',
    },
    {
        title: 'Teams',
        href: teams.index(),
        icon: UsersRound,
        permission: 'view teams',
    },
    {
        title: 'Projects',
        href: projects.index(),
        icon: Briefcase,
        permission: 'view projects',
    },
    {
        title: 'Projects Assigned',
        href: '/projects/assigned',
        icon: Briefcase,
        permission: 'view projects',
    },
    {
        title: 'Tasks',
        href: tasks.index(),
        icon: CheckSquare,
        permission: 'view tasks',
    },
    {
        title: 'Content Flows',
        href: '/content-flows',
        icon: FileText,
    },
    {
        title: 'Minutes of Meetings',
        href: minutesOfMeetings.index(),
        icon: ClipboardList,
        permission: 'view minutes-of-meetings',
    },
    {
        title: 'Payments',
        href: payments.index(),
        icon: CreditCard,
        permission: 'view payments',
    },
    {
        title: 'Client Interactions',
        href: clientInteractions.index(),
        icon: MessageSquare,
        permission: 'view client-interactions',
    },
    {
        title: 'Services',
        href: services.index(),
        icon: Settings,
        permission: 'view services',
    },
    {
        title: 'Permissions',
        href: permissions.index(),
        icon: Shield,
        permission: 'manage permissions',
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userPermissions = auth.permissions || [];

    // Filter nav items based on user permissions
    const mainNavItems = allNavItems.filter((item) => {
        // If no permission required, show the item (like Dashboard)
        if (!item.permission) {
            return true;
        }
        // Check if user has the required permission
        return userPermissions.includes(item.permission);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
