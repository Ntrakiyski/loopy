// app/(app)/loop/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSpotifyPlayer, usePlaybackState, usePlayerDevice } from 'react-spotify-web-playback-sdk';
import { useAuth } from '@/auth/use-auth';
import { PlaylistItem, PlaylistItemType } from '@/components/playlist-item';
import { TrackItem } from '@/components/track-item';
import { PlaylistTrack, SpotifyTrack } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { TimePicker } from '@/components/time-picker';
import { useLoop, LoopConfig } from '@/player/use-loop';
import { ImagePlaceholder } from '@/components/image-placeholder';

export default function LoopPage() {
    const player = useSpotifyPlayer();
    const device = usePlayerDevice();
    const playbackState = usePlaybackState(true);
    const { logout, accessToken } = useAuth();

    const [playlists, setPlaylists] = useState<PlaylistItemType[]>([]);
    const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<PlaylistTrack[]>([]);
    const [isLoadingTracks, setIsLoadingTracks] = useState(false);

    const [loopingTrack, setLoopingTrack] = useState<SpotifyTrack | null>(null);
    const [loopConfig, setLoopConfig] = useState<Omit<LoopConfig, 'fadeInCurve' | 'fadeOutCurve'>>({
        startMs: 0,
        endMs: 15000,
        fadeMs: 50,
    });
    const [isLoopActive, setIsLoopActive] = useState(false);

    const is_playing = playbackState ? !playbackState.paused : false;
    const current_track = playbackState?.track_window.current_track;
    const nowPlayingImageUrl = current_track?.album?.images?.[0]?.url;

    // CORRECTED: Pass the playbackState into the useLoop hook
    useLoop(player, playbackState, isLoopActive, loopConfig as LoopConfig);

    useEffect(() => {
        if (!accessToken) return;
        setIsLoadingPlaylists(true);
        fetch('https://api.spotify.com/v1/me/playlists?limit=50', { headers: { Authorization: `Bearer ${accessToken}` } })
            .then(res => res.json()).then(data => setPlaylists(data.items))
            .catch(console.error).finally(() => setIsLoadingPlaylists(false));
    }, [accessToken]);

    const handlePlaylistClick = async (playlistId: string) => {
        if (!accessToken) return;
        setIsLoadingTracks(true);
        setSelectedPlaylistTracks([]);
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { headers: { Authorization: `Bearer ${accessToken}` } });
            const data = await response.json();
            setSelectedPlaylistTracks(data.items.filter((item: PlaylistTrack) => item.track));
        } catch (error) { console.error('Failed to fetch tracks:', error); }
        finally { setIsLoadingTracks(false); }
    };

    const handlePlayTrack = (trackUri: string) => {
        if (!device?.device_id || !accessToken) return;
        if (isLoopActive) setIsLoopActive(false);

        if (current_track?.uri === trackUri) {
            player?.togglePlay();
            return;
        }
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`, {
            method: 'PUT', body: JSON.stringify({ uris: [trackUri] }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        });
    };

    const openLoopDialog = (track: SpotifyTrack) => {
        setLoopingTrack(track);
    };

    const handleStartLoop = () => {
        if (!loopingTrack || !device?.device_id || !accessToken) return;
        const playBody = { uris: [loopingTrack.uri], position_ms: loopConfig.startMs };
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`, {
            method: 'PUT', body: JSON.stringify(playBody),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        }).then(() => {
            setTimeout(() => setIsLoopActive(true), 100);
        });
    };

    const handleStopLoop = () => {
        setIsLoopActive(false);
        player?.pause();
    };
    
    const closeDialog = () => {
        if (isLoopActive) handleStopLoop();
        setLoopingTrack(null);
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
                    <h1 className="text-xl font-bold">Spotify Looper</h1>
                    <Button onClick={logout} variant="destructive">Logout</Button>
                </header>
                <div className="flex">
                    <aside className="w-64 h-[calc(100vh-64px)] overflow-y-auto p-4 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <h2 className="text-lg font-semibold mb-4">My Playlists</h2>
                        {isLoadingPlaylists ? <p>Loading...</p> : <div>{playlists.map(p => <PlaylistItem key={p.id} playlist={p} onClick={handlePlaylistClick} />)}</div>}
                    </aside>
                    <main className="flex-grow p-8 overflow-y-auto h-[calc(100vh-64px)]">
                        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Playback Status</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 flex-shrink-0">
                                    {nowPlayingImageUrl ? (
                                        <Image
                                            src={nowPlayingImageUrl}
                                            alt={current_track?.name || 'Album cover'}
                                            width={64}
                                            height={64}
                                            className="w-full h-full rounded-md object-cover"
                                        />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p>Device Status: {device?.status === 'ready' ? <span className="text-green-500 font-bold">Ready</span> : <span className="text-red-500 font-bold">Not Ready</span>}</p>
                                    {current_track ? (
                                        <p className="truncate">Now Playing: {current_track.name}</p>
                                    ) : (
                                        <p>Nothing is playing.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4">Tracks</h2>
                            {isLoadingTracks ? <p>Loading...</p> : selectedPlaylistTracks.length > 0 ? (
                                <div className="space-y-2">{selectedPlaylistTracks.map(({ track }) => (
                                    <TrackItem key={track.id} track={track} onPlay={handlePlayTrack} onLoop={openLoopDialog} isPlaying={is_playing} isCurrentTrack={current_track?.id === track.id} />
                                ))}</div>
                            ) : <p className="text-gray-500">Select a playlist.</p>}
                        </section>
                    </main>
                </div>
            </div>

            <Dialog open={!!loopingTrack} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Loop: {loopingTrack?.name}</DialogTitle>
                        <DialogDescription>
                            Set start/end times. For a seamless loop, use a short fade duration (20-100ms).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <TimePicker label="Start Time" valueMs={loopConfig.startMs} onChange={val => setLoopConfig(p => ({ ...p, startMs: val }))} />
                        <TimePicker label="End Time" valueMs={loopConfig.endMs} onChange={val => setLoopConfig(p => ({ ...p, endMs: val }))} />
                        <div className="grid gap-2">
                            <Label>Fade Duration (ms)</Label>
                            <Input type="number" value={loopConfig.fadeMs} onChange={e => setLoopConfig(p => ({ ...p, fadeMs: Number(e.target.value) }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={closeDialog}>Cancel</Button>
                        {isLoopActive ? (
                            <Button variant="destructive" onClick={handleStopLoop}>Stop Loop</Button>
                        ) : (
                            <Button onClick={handleStartLoop}>Start Loop</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
