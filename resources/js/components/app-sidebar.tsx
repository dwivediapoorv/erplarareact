import { NavFooter } from '@/components/nav-footer';
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
import minutesOfMeetings from '@/routes/minutes-of-meetings';
import payments from '@/routes/payments';
import payroll from '@/routes/payroll';
import projects from '@/routes/projects';
import services from '@/routes/services';
import tasks from '@/routes/tasks';
import teams from '@/routes/teams';
import users from '@/routes/users';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Briefcase, CheckSquare, ClipboardList, CreditCard, DollarSign, Folder, LayoutGrid, MessageSquare, Settings, Users, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: users.index(),
        icon: Users,
    },
    {
        title: 'Teams',
        href: teams.index(),
        icon: UsersRound,
    },
    {
        title: 'Projects',
        href: projects.index(),
        icon: Briefcase,
    },
    {
        title: 'Tasks',
        href: tasks.index(),
        icon: CheckSquare,
    },
    {
        title: 'Minutes of Meetings',
        href: minutesOfMeetings.index(),
        icon: ClipboardList,
    },
    {
        title: 'Payroll',
        href: payroll.index(),
        icon: DollarSign,
    },
    {
        title: 'Payments',
        href: payments.index(),
        icon: CreditCard,
    },
    {
        title: 'Client Interactions',
        href: clientInteractions.index(),
        icon: MessageSquare,
    },
    {
        title: 'Services',
        href: services.index(),
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
