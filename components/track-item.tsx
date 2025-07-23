// components/track-item.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ImagePlaceholder } from './image-placeholder';
import { Play, Pause, Repeat } from 'lucide-react';
import { SpotifyTrack } from '@/lib/types';

interface TrackItemProps {
    track: SpotifyTrack;
    onPlay: (trackUri: string) => void;
    onLoop: (track: SpotifyTrack) => void;
    isPlaying: boolean;
    isCurrentTrack: boolean;
}

export const TrackItem = ({ track, onPlay, onLoop, isPlaying, isCurrentTrack }: TrackItemProps) => {
    const [imageError, setImageError] = useState(false);
    const imageUrl = track.album.images[0]?.url;

    return (
        <div className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <div className="flex-shrink-0 w-12 h-12 relative">
                {imageUrl && !imageError ? (
                    <Image
                        src={imageUrl}
                        alt={track.name}
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
                <p className="font-semibold truncate">{track.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {track.artists.map(a => a.name).join(', ')}
                </p>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* Loop Button */}
                <Button variant="ghost" size="icon" onClick={() => onLoop(track)}>
                    <Repeat className="w-5 h-5" />
                </Button>

                {/* Play/Pause Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => isCurrentTrack ? onPlay(track.uri) : onPlay(track.uri)}
                >
                    {isCurrentTrack && isPlaying ? (
                        <Pause className="w-5 h-5" />
                    ) : (
                        <Play className="w-5 h-5" />
                    )}
                </Button>
            </div>
        </div>
    );
};