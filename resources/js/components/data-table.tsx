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
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
    pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No results found',
    pageName,
    savedPreferences,
    showSearch = true,
    pageSize = 25,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);

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

    // Reset to page 1 when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                        {pagedData.length > 0 ? (
                            pagedData.map((item, index) => (
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
            {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <span className="px-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
