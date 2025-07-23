# Spotify Segment Looper

A web application that allows users to select any Spotify track, define a precise start and end time (down to the millisecond), and listen to that segment loop seamlessly and indefinitely. Built with Next.js, the Spotify Web Playback SDK, and a modern UI powered by Shadcn UI.

This project uses the secure **Authorization Code with PKCE Flow**, ensuring no client secrets are ever exposed to the browser.

## Key Features

*   **Seamless Audio Looping:** Utilizes a high-precision, "mid-fade seek" technique to create nearly imperceptible loops.
*   **Millisecond Precision:** Set start and end times in `MM:SS.ms` format for fine-grained control.
*   **Playlist Integration:** Browse and select tracks directly from your personal Spotify playlists.
*   **Secure Authentication:** Implements Spotify's recommended OAuth 2.0 flow for third-party applications.
*   **Responsive Design:** A clean, modern, and responsive UI built with Tailwind CSS and Shadcn UI.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Component Library:** [Shadcn UI](https://ui.shadcn.com/)
*   **Spotify Integration:** [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/)
*   **Package Manager:** [pnpm](https://pnpm.io/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [pnpm](https://pnpm.io/installation) installed globally (`npm install -g pnpm`)
*   A **Spotify Premium** account.
*   A Spotify Developer account and a registered application.

### Installation & Setup

1.  **Create a Spotify Application:**
    *   Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
    *   Click "Create App". Give it a name and description.
    *   Once created, go to the app's "Settings" and find your **Client ID** and **Client Secret**.
    *   In the settings, add your development Redirect URI. For this project, it must be: `http://127.0.0.1:3000/callback`

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your_username/spotify-segment-looper.git
    cd spotify-segment-looper
    ```

3.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

4.  **Configure Environment Variables:**
    *   Create a new file named `.env.local` in the root of the project.
    *   Copy the contents of `.env.example` (or the template below) into it.

    **File: `.env.local`**
    ```env
    # Variable used by both client and server
    NEXT_PUBLIC_SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID_HERE

    # Secret used ONLY by the server-side token exchange (if applicable)
    # NOTE: Our current client-side flow does not use this, but it's good practice to have it.
    SPOTIFY_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

    # The exact Redirect URI you added in the Spotify Dashboard
    NEXT_PUBLIC_REDIRECT_URI=http://127.0.0.1:3000/callback
    ```
    *   Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` with the credentials from your Spotify Developer App.

### Running the Application

1.  **Start the Development Server:**
    ```bash
    pnpm dev
    ```

2.  **Open the App:**
    *   Navigate to `http://127.0.0.1:3000` in your browser.
    *   **Important:** You must use `127.0.0.1` (not `localhost`) for the Web Crypto API to function correctly in a secure context.

## Deployment

This application is ready for deployment on any platform that supports Next.js, such as Vercel, Netlify, or a VPS with Coolify.

### Deploying with Coolify

1.  Push your repository to GitHub.
2.  In Coolify, create a new resource from your Git repository.
3.  Coolify will automatically detect the Next.js build pack.
4.  **Crucially, you must configure the environment variables** in the Coolify project settings, just as you did for `.env.local`.
5.  You must also **add your production URL** (e.g., `https://your-looper-app.coolify-domain.com/callback`) to the Redirect URIs in your Spotify Developer Dashboard settings.

## Future Enhancements

*   **Waveform Visualization:** Integrate a library like `wavesurfer.js` to provide a visual representation of the audio for easier loop selection.
*   **Multiple Loop Segments:** Allow users to define and save multiple loops for a single track and play them in sequence.
*   **PWA Support:** Add a service worker and manifest to make the application installable on mobile devices for a native-like experience.

## License

Distributed under the MIT License. See `LICENSE` for more information.
