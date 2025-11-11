import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { store } from '@/routes/login';
import { type SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [showPassword, setShowPassword] = useState(false);

    // If user is already authenticated, redirect to dashboard
    if (auth.user) {
        window.location.href = dashboard().url;
        return null;
    }

    return (
        <>
            <Head title="Welcome - Login" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
                <div className="w-full max-w-md">
                    {/* Logo/Brand Section */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            DigiRocket ERP
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to access your account
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                            placeholder="your.email@example.com"
                                            className="w-full"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                className="w-full pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                        />
                                        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                                            Remember me
                                        </Label>
                                    </div>

                                    {/* Login Button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        {processing ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} DigiRocket. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
}
