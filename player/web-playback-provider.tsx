// player/web-playback-provider.tsx

'use client';

import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import { useAuth } from '@/auth/use-auth';

export const WebPlaybackProvider = ({ children }: { children: React.ReactNode }) => {
    const { accessToken } = useAuth();

    if (!accessToken) {
        return <>{children}</>;
    }

    return (
        <WebPlaybackSDK
            initialDeviceName="Spotify Segment Looper" // CORRECTED: As per the README
            getOAuthToken={callback => callback(accessToken)}
            initialVolume={0.5} // CORRECTED: As per your feedback and the README
            connectOnInitialized={true}
        >
            {children}
        </WebPlaybackSDK>
    );
};