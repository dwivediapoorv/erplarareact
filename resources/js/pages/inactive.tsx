import { Head, Link } from '@inertiajs/react';
import { Building2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InactiveUser() {
    return (
        <>
            <Head title="Account Inactive" />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-muted p-6">
                            <Building2 className="h-16 w-16 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Thank You
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            for being part of DigiRocket Technologies
                        </p>
                    </div>

                    <div className="rounded-lg border bg-card p-6 text-center">
                        <p className="text-muted-foreground">
                            Your account is currently inactive. Please connect
                            with HR in case of any queries.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <Button variant="outline" asChild>
                            <a
                                href="mailto:hrconnect@digirockett.com"
                                className="inline-flex items-center gap-2"
                            >
                                <Mail className="h-4 w-4" />
                                Contact HR
                            </a>
                        </Button>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Sign Out
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
