import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { SelfServiceSidebar } from '@/components/self-service-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface SelfServiceLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function SelfServiceLayout({
    children,
    breadcrumbs = [],
}: SelfServiceLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <SelfServiceSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
