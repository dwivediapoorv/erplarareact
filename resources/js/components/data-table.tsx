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
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No results found',
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [columnVisibility, setColumnVisibility] = React.useState<
        Record<string, boolean>
    >(
        columns.reduce(
            (acc, col) => {
                acc[col.key] = col.defaultVisible !== undefined ? col.defaultVisible : true;
                return acc;
            },
            {} as Record<string, boolean>
        )
    );

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
                <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
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
