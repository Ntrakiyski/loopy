// app/(auth)/callback/page.tsx

'use client'; // This must be a client component

import { useEffect, Suspense } from 'react';
import { useAuth } from '@/auth/use-auth';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const { exchangeCodeForToken } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      // We no longer pass the verifier here, as the hook gets it from localStorage
      exchangeCodeForToken(code);
    } else {
      console.error("Missing code in callback.");
      // The hook will handle redirecting to home on error
    }
  }, [exchangeCodeForToken, searchParams]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Processing Spotify Login...</h1>
      <p className="text-gray-700 dark:text-gray-300">Please wait while we set up your session.</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Loading...</h1>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
