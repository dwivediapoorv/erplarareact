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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, FileText, User, Plane, PlaneTakeoff } from 'lucide-react';
import AppLogo from './app-logo';

const selfServiceNavItems: NavItem[] = [
    {
        title: 'Back to Dashboard',
        href: dashboard(),
        icon: ArrowLeft,
    },
    {
        title: 'My Details',
        href: '/employee/my-details',
        icon: User,
    },
    {
        title: 'Apply for Leave',
        href: '/leave-requests/create',
        icon: PlaneTakeoff,
    },
    {
        title: 'Leave History',
        href: '/leave-requests',
        icon: Plane,
    },
    {
        title: 'Salary Slips',
        href: '/employee/salary-slips',
        icon: FileText,
    },
    {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
    },
];

export function SelfServiceSidebar() {
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
                <NavMain items={selfServiceNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
