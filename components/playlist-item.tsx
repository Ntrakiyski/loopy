// components/playlist-item.tsx

'use client';

import { useState } from 'react'; // We need useState for the error handling
import Image from 'next/image';
import { ImagePlaceholder } from './image-placeholder'; // Import our placeholder

// Define the type for a single playlist item based on Spotify's API response
export interface PlaylistItemType {
    id: string;
    name: string;
    images: { url: string }[]; // This can be an empty array
    tracks: { total: number };
}

interface PlaylistItemProps {
    playlist: PlaylistItemType;
    onClick: (playlistId: string) => void;
}

export const PlaylistItem = ({ playlist, onClick }: PlaylistItemProps) => {
    const [imageError, setImageError] = useState(false);
    // Safely get the image URL. It will be undefined if the images array is empty.
    const imageUrl = playlist.images?.[0]?.url;

    return (
        <button
            onClick={() => onClick(playlist.id)}
            className="w-full flex items-center gap-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
        >
            <div className="flex-shrink-0 w-12 h-12 relative">
                {/* 
                  THIS IS THE FIX:
                  - We check if imageUrl exists AND if there hasn't been an error.
                  - If so, we try to render the Next.js Image component.
                  - The `onError` prop will set our error state if the image fails to load.
                  - If imageUrl doesn't exist or an error has occurred, we show the placeholder.
                */}
                {imageUrl && !imageError ? (
                    <Image
                        src={imageUrl}
                        alt={playlist.name}
                        fill
                        sizes="48px"
                        className="object-cover rounded-md"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <ImagePlaceholder />
                )}
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate">{playlist.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{playlist.tracks.total} tracks</p>
            </div>
        </button>
    );
};