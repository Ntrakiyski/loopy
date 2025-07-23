'use client'; // This layout still needs to be a client component to protect the route

import { useAuth, AuthStatus } from '@/auth/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If auth status is determined and user is not authenticated, redirect to login
        if (status === AuthStatus.Unauthenticated) {
            router.replace('/login');
        }
    }, [status, router]);

    // While loading auth status, show a loading screen
    if (status === AuthStatus.Loading || status === AuthStatus.Idle) {
        return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
    }

    // If authenticated, render the children (the LoopPage)
    // The WebPlaybackProvider will now be in the root layout
    if (status === AuthStatus.Authenticated) {
        return <>{children}</>;
    }

    // Fallback, should be covered by the useEffect redirect
    return null;
}