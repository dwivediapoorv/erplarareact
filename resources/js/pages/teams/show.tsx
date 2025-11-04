import AppLayout from '@/layouts/app-layout';
import teams from '@/routes/teams';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Team {
    id: number;
    name: string;
}

interface Member {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
}

interface TeamShowProps {
    team: Team;
    members: Member[];
}

export default function TeamShow({ team, members }: TeamShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teams',
            href: teams.index().url,
        },
        {
            title: team.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${team.name} - Team Members`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={teams.index().url}>
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-semibold">{team.name}</h1>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-lg font-semibold mb-4">Team Members ({members.length})</h2>

                    {members.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                    {members.map((member) => (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-sidebar-accent/50"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {member.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {member.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Badge
                                                    variant={member.is_active ? 'default' : 'outline'}
                                                >
                                                    {member.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center py-8 text-sm text-muted-foreground">
                            No members in this team yet.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
