// app/(auth)/login/page.tsx

'use client'; // This must be a client component

import { useEffect } from 'react';
import { useAuth, AuthStatus } from '@/auth/use-auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { redirectToSpotify, status, accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to the main app page
    if (status === AuthStatus.Authenticated && accessToken) {
      router.replace('/loop');
    }
  }, [status, accessToken, router]);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Spotify Segment Looper</h1>
      {status === AuthStatus.Authenticated && accessToken ? (
        <>
          <p className="mb-4 text-gray-700 dark:text-gray-300">You are authenticated!</p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Redirecting...</p>
        </>
      ) : (
        <>
          <p className="mb-6 text-gray-700 dark:text-gray-300">Please log in to your Spotify Premium account to use the app.</p>
          <Button
            onClick={redirectToSpotify}
            disabled={status === AuthStatus.Loading}
            className="w-full"
          >
            {status === AuthStatus.Loading ? 'Redirecting...' : 'Log in with Spotify'}
          </Button>
          {status === AuthStatus.Error && (
            <p className="mt-4 text-red-500 text-sm">Authentication failed. Please try again.</p>
          )}
        </>
      )}
    </div>
  );
}
