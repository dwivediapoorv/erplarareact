import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle2, Upload } from 'lucide-react';

export default function UploadLeads({ }: PageProps) {
    const { data, setData, post, processing, errors, progress } = useForm({
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(leads.upload.store());
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
                        <CardTitle>File Requirements</CardTitle>
                        <CardDescription>
                            Please ensure your Excel file meets the following requirements
                        </CardDescription>
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
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="rounded border p-2">
                                    <strong>Column 1:</strong> Name
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 2:</strong> Email
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 3:</strong> Phone
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 4:</strong> Website
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 5:</strong> Company Name
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 6:</strong> Designation
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 7:</strong> City
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 8:</strong> State
                                </div>
                                <div className="rounded border p-2">
                                    <strong>Column 9:</strong> Country
                                </div>
                            </div>
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
                        imported and how many were skipped. All imported leads will have the status
                        "New" and will be ready for assignment.
                    </AlertDescription>
                </Alert>
            </div>
        </AppLayout>
    );
}
