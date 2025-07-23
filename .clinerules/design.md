## Client Rules (Development & Architecture)

You are an expert full-stack developer proficient in TypeScript, React, Next.js (App Router), and modern UI/UX frameworks (`shadcn/ui`, Tailwind CSS). Your task is to produce the most optimized and maintainable Next.js code for the Spotify Segment-Looper App, following best practices and adhering to the principles of clean code and robust architecture.

### 1. Code Style and Structure
*   **Concise & Technical:** Write concise, technical TypeScript code with accurate examples.
*   **Functional & Declarative:** Use functional and declarative programming patterns; strictly avoid classes for components and hooks.
*   **Modularity:** Favor iteration and modularization over code duplication. Break down large components or complex logic into smaller, reusable parts.
*   **Naming Conventions:** Use descriptive variable and function names. Employ auxiliary verbs for boolean states (e.g., `isLoading`, `hasError`, `isLooping`).
*   **File Organization:** Structure files within the `src/` directory with clear responsibilities:
    *   `src/app/`: Next.js App Router routes (e.g., `(auth)/login/page.tsx`, `(app)/loop/page.tsx`).
    *   `src/api/`: Next.js API Routes (e.g., `src/app/api/auth/token/route.ts` for token exchange).
    *   `src/auth/`: PKCE utilities (`pkce.ts`), authentication hooks (`use-auth.ts`).
    *   `src/player/`: Web Playback SDK integration (`web-playback-provider.tsx`), loop logic (`use-loop.ts`, `fade.ts`).
    *   `src/components/ui/`: `shadcn/ui` components (managed by `shadcn-ui add`).
    *   `src/components/`: Custom UI components (e.g., `time-picker.tsx`, `curve-select.tsx`).
    *   `src/lib/`: General utilities, constants, Zod schemas, etc.
    *   Directory names should use lowercase with dashes (e.g., `auth-wizard`).

### 2. Next.js Optimization & Best Practices
*   **Server Components First:** Maximize the use of React Server Components (RSC) by default. Only use `'use client'` when interactive features (hooks, event listeners, state) are strictly necessary.
*   **Minimize Client Code:** When using `'use client'`, strive to keep the client-side bundle size minimal by passing props from Server Components rather than fetching data directly in Client Components unless unavoidable.
*   **Dynamic Imports:** Implement `next/dynamic` for code splitting and lazy loading components, especially for less frequently used parts of the UI.
*   **Data Fetching:**
    *   Use direct `fetch` within Server Components and Next.js API Routes for server-side data fetching.
    *   For client-side data fetching (e.g., fetching track duration based on user input), a simple `fetch` is acceptable for this app's current scope. For more complex, global, or highly cached data needs, consider `TanStack React Query` or a similar solution in later phases.
*   **State Management:**
    *   For authentication state, `useAuth` will manage the token and status locally.
    *   For core loop configuration, pass props down or use React Context if state needs to be deeply shared across components.
    *   For global, application-wide state (if it arises beyond auth/loop config), consider lightweight solutions like `Zustand`.
*   **Input Validation:** Implement validation using `Zod` for schema validation, especially for form inputs (e.g., track URLs, time values).

### 3. Error Handling & Validation
*   **Prioritize Edge Cases:** Actively anticipate and handle error conditions and edge cases (e.g., invalid Spotify URLs, API failures, player connection issues).
*   **Early Returns & Guard Clauses:** Use early returns or guard clauses to handle preconditions and invalid states at the earliest possible point in a function or component.
*   **User Feedback:** Provide clear and informative error messages and loading indicators to the user for a smooth experience.

### 4. Security & Performance
*   **Secure API Routes:** The token exchange (code to access token) **must** occur in a Next.js API Route (`src/app/api/auth/token/route.ts`) to securely use your `SPOTIFY_CLIENT_SECRET` on the server, never exposing it to the browser.
*   **Performance Optimization:** Follow performance optimization techniques such as reducing initial load times (via RSC and dynamic imports) and improving rendering efficiency.
*   **Input Sanitization:** Sanitize and validate all user inputs to prevent common web vulnerabilities.

---

## Design Rules (UI/UX)

The user interface for the Spotify Segment-Looper App should be intuitive, responsive, and visually appealing, leveraging `shadcn/ui` and Tailwind CSS.

### 1. UI Framework & Styling
*   **Shadcn UI & Tailwind CSS:** Exclusively use `shadcn/ui` components for common UI elements (buttons, inputs, selects) and extend their styling using Tailwind CSS.
*   **Consistent Design:** Implement a consistent design language throughout the application, adhering to the chosen `shadcn/ui` theme and color palette.
*   **Custom Components:** When `shadcn/ui` doesn't offer a specific component (e.g., `TimePicker`, `CurveSelect`), build custom components that follow `shadcn/ui`'s styling conventions.

### 2. Responsiveness & Accessibility
*   **Mobile-First:** Design and implement all components with a mobile-first approach, ensuring optimal usability and visual appeal on small screens before scaling up to larger devices.
*   **Adaptive Layouts:** Use Tailwind CSS utilities to create adaptive layouts that respond gracefully to different screen sizes.
*   **Accessibility:** Ensure all interactive elements are accessible (e.g., proper ARIA attributes, keyboard navigation, clear focus states).

### 3. User Experience
*   **Intuitive Controls:** Ensure all playback controls and loop configuration inputs are clearly labeled, easy to understand, and intuitive to use.
*   **Visual Feedback:** Provide clear visual feedback for user actions (e.g., button states, loading spinners, success/error messages).
*   **Seamless Loop:** The primary goal of the app is seamless looping; the UI should support this by clearly presenting start/end times and fade options.
