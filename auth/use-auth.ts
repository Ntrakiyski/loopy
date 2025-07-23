// auth/use-auth.ts

'use client'; // This directive must be at the very top

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- PKCE HELPER FUNCTIONS (FROM SPOTIFY'S DOCUMENTATION) ---

// 1. Generate a random string for the code verifier
const generateCodeVerifier = (length: number) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// 2. Hash the code verifier using SHA-256
const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

// 3. Base64-urlencode the hash to get the code challenge
const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

// --- END PKCE HELPER FUNCTIONS ---


const LOCALSTORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    expiresAt: 'spotify_expires_at',
    codeVerifier: 'spotify_code_verifier',
};

export enum AuthStatus {
    Idle,
    Loading,
    Authenticated,
    Unauthenticated,
    Error,
}

interface AuthContextType {
    accessToken: string | null;
    status: AuthStatus;
    redirectToSpotify: () => void;
    exchangeCodeForToken: (code: string) => Promise<void>;
    logout: () => void;
}

export const useAuth = (): AuthContextType => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const [status, setStatus] = useState<AuthStatus>(AuthStatus.Idle);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem(LOCALSTORAGE_KEYS.accessToken);
        const storedExpiresAt = localStorage.getItem(LOCALSTORAGE_KEYS.expiresAt);

        if (storedToken && storedExpiresAt && Date.now() < parseInt(storedExpiresAt)) {
            setAccessToken(storedToken);
            setExpiresAt(parseInt(storedExpiresAt));
            setStatus(AuthStatus.Authenticated);
        } else {
            setAccessToken(null);
            setExpiresAt(null);
            localStorage.removeItem(LOCALSTORAGE_KEYS.accessToken);
            localStorage.removeItem(LOCALSTORAGE_KEYS.expiresAt);
            setStatus(AuthStatus.Unauthenticated);
        }
    }, []);

    const redirectToSpotify = useCallback(async () => {
        setStatus(AuthStatus.Loading);

        const verifier = generateCodeVerifier(128);
        const hashed = await sha256(verifier);
        const challenge = base64encode(hashed);

        localStorage.setItem(LOCALSTORAGE_KEYS.codeVerifier, verifier);

        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            console.error("Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID or NEXT_PUBLIC_REDIRECT_URI");
            setStatus(AuthStatus.Error);
            return;
        }

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            // UPDATED SCOPE: Added 'playlist-read-private'
            scope: 'streaming user-read-playback-state user-modify-playback-state user-read-private user-read-email playlist-read-private',
            code_challenge_method: 'S256',
            code_challenge: challenge,
            redirect_uri: redirectUri,
        });

        window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }, []);

    const exchangeCodeForToken = useCallback(async (code: string) => {
        setStatus(AuthStatus.Loading);

        const verifier = localStorage.getItem(LOCALSTORAGE_KEYS.codeVerifier);
        if (!verifier) {
            console.error("Code verifier not found in localStorage");
            setStatus(AuthStatus.Error);
            router.push('/');
            return;
        }

        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            console.error("Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID or NEXT_PUBLIC_REDIRECT_URI");
            setStatus(AuthStatus.Error);
            return;
        }

        try {
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: clientId,
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                    code_verifier: verifier,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Token exchange failed: ${errorData.error_description || response.statusText}`);
            }

            const data = await response.json();
            const newExpiresAt = Date.now() + data.expires_in * 1000;

            localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
            localStorage.setItem(LOCALSTORAGE_KEYS.expiresAt, newExpiresAt.toString());
            localStorage.removeItem(LOCALSTORAGE_KEYS.codeVerifier);

            setAccessToken(data.access_token);
            setExpiresAt(newExpiresAt);
            setStatus(AuthStatus.Authenticated);
            router.push('/loop');

        } catch (error) {
            console.error("Error exchanging code:", error);
            setStatus(AuthStatus.Error);
            router.push('/');
        }
    }, [router]);

    const logout = useCallback(() => {
        setAccessToken(null);
        setExpiresAt(null);
        localStorage.clear();
        setStatus(AuthStatus.Unauthenticated);
        router.push('/');
    }, [router]);

    return { accessToken, status, redirectToSpotify, exchangeCodeForToken, logout };
};