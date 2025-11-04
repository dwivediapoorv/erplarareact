import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { router } from '@inertiajs/react';

export interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    filterable?: boolean;
    defaultVisible?: boolean;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchPlaceholder?: string;
    emptyMessage?: string;
    pageName?: string; // e.g., 'projects.index'
    savedPreferences?: Record<string, boolean> | null;
    showSearch?: boolean;
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No results found',
    pageName,
    savedPreferences,
    showSearch = true,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = React.useState('');

    // Initialize column visibility from saved preferences or defaults
    const [columnVisibility, setColumnVisibility] = React.useState<
        Record<string, boolean>
    >(() => {
        if (savedPreferences) {
            return savedPreferences;
        }
        return columns.reduce(
            (acc, col) => {
                acc[col.key] = col.defaultVisible !== undefined ? col.defaultVisible : true;
                return acc;
            },
            {} as Record<string, boolean>
        );
    });

    // Save preferences to backend when column visibility changes
    React.useEffect(() => {
        if (!pageName) return;

        const timeoutId = setTimeout(() => {
            router.post(
                '/user-preferences',
                {
                    page: pageName,
                    preference_key: 'column_visibility',
                    preference_value: columnVisibility,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: [], // Don't reload any props
                }
            );
        }, 500); // Debounce for 500ms

        return () => clearTimeout(timeoutId);
    }, [columnVisibility, pageName]);

    const visibleColumns = columns.filter((col) => columnVisibility[col.key]);

    const filteredData = React.useMemo(() => {
        if (!searchQuery) return data;

        return data.filter((item) => {
            return columns.some((column) => {
                if (column.filterable === false) return false;
                const value = item[column.key];
                if (value === null || value === undefined) return false;
                return String(value)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
        });
    }, [data, searchQuery, columns]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                {showSearch && (
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={showSearch ? "ml-auto" : ""}>
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {columns.map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.key}
                                    className="capitalize"
                                    checked={columnVisibility[column.key]}
                                    onCheckedChange={(value) =>
                                        setColumnVisibility((prev) => ({
                                            ...prev,
                                            [column.key]: value,
                                        }))
                                    }
                                >
                                    {column.label}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumns.map((column) => (
                                <TableHead key={column.key}>
                                    {column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={item.id || index}>
                                    {visibleColumns.map((column) => (
                                        <TableCell key={column.key}>
                                            {column.render
                                                ? column.render(item)
                                                : item[column.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={visibleColumns.length}
                                    className="h-24 text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
