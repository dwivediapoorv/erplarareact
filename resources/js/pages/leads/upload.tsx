import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle2, Download, Upload, Users } from 'lucide-react';

export default function UploadLeads({ }: PageProps) {
    const { data, setData, post, processing, errors, progress } = useForm({
        file: null as File | null,
        auto_assign: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(leads.upload.store().url);
    };

    return (
        <AppLayout>
            <Head title="Upload Leads" />

            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href={leads.index()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Upload Leads</h1>
                        <p className="text-muted-foreground">
                            Import leads from an Excel file
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>File Requirements</CardTitle>
                                <CardDescription>
                                    Please ensure your Excel file meets the following requirements
                                </CardDescription>
                            </div>
                            <a href="/leads/sample-download" download>
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Sample
                                </Button>
                            </a>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">Excel Format</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                <li>File must be .xlsx, .xls, or .csv format</li>
                                <li>Maximum file size: 10MB</li>
                                <li>First row should contain column headers</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">Required Columns (in order)</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="rounded border p-2">
                                    <strong>Column 1:</strong> Website
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 2:</strong> Phone
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 3:</strong> Email
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 4:</strong> Timezone
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                <strong>Note:</strong> Lead date will be automatically added as today's date during upload.
                            </p>
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Duplicate Handling</AlertTitle>
                            <AlertDescription>
                                Leads with duplicate email or phone numbers will be automatically skipped
                                to prevent duplicates in the system.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload File</CardTitle>
                        <CardDescription>
                            Select an Excel file to upload leads
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file">Excel File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData('file', file);
                                        }
                                    }}
                                    disabled={processing}
                                />
                                {errors.file && (
                                    <p className="text-sm text-destructive">{errors.file}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 rounded-lg border p-4 bg-muted/50">
                                <Checkbox
                                    id="auto_assign"
                                    checked={data.auto_assign}
                                    onCheckedChange={(checked) => setData('auto_assign', checked as boolean)}
                                    disabled={processing}
                                />
                                <div className="flex-1">
                                    <Label
                                        htmlFor="auto_assign"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                                    >
                                        <Users className="h-4 w-4" />
                                        Automatically assign to calling team (Round-Robin)
                                    </Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Imported leads will be automatically distributed evenly among all active calling team members
                                    </p>
                                </div>
                            </div>

                            {progress && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Uploading...</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all"
                                            style={{ width: `${progress.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={!data.file || processing}
                                    className="flex-1"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {processing ? 'Uploading...' : 'Upload Leads'}
                                </Button>
                                <Link href={leads.index()}>
                                    <Button type="button" variant="outline" disabled={processing}>
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>After Upload</AlertTitle>
                    <AlertDescription>
                        Once the upload is complete, you'll see a summary of how many leads were
                        imported and how many were skipped. {data.auto_assign ? 'Leads will be automatically assigned to calling team members using round-robin distribution.' : 'All imported leads will have the status "New" and will be ready for manual assignment.'}
                    </AlertDescription>
                </Alert>
            </div>
        </AppLayout>
    );
}
