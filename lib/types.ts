// lib/types.ts

// A simplified version of the full track object, containing what we need.
export interface SpotifyTrack {
    id: string;
    name: string;
    uri: string;
    album: {
        images: { url: string }[];
    };
    artists: { name: string }[];
}

// The object structure for an item in a playlist's `items` array
export interface PlaylistTrack {
    added_at: string;
    track: SpotifyTrack;
}