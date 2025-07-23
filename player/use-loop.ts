// player/use-loop.ts

import { useEffect, useRef } from 'react';

export interface LoopConfig {
  startMs: number;
  endMs: number;
  fadeMs: number;
}

export function useLoop(
  player: Spotify.Player | null,
  playbackState: Spotify.PlaybackState | null,
  isActive: boolean,
  config?: Omit<LoopConfig, 'fadeInCurve' | 'fadeOutCurve'>,
) {
  const animationFrameId = useRef<number | null>(null);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const cleanup = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isTransitioning.current = false;
    };

    if (!player || !isActive || !config || !playbackState) {
      cleanup();
      return;
    }

    const { startMs, endMs, fadeMs } = config;

    const seamlessTransition = () => {
      const startTime = performance.now();

      const frame = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / fadeMs, 1);

        // THIS IS THE FIX:
        // The previous math was `1 - Math.abs(...)`, creating a 0->1->0 curve.
        // The correct math for a 1->0->1 dip is just `Math.abs(...)`.
        const volume = Math.abs(1 - (2 * progress));
        
        player.setVolume(Math.max(0, Math.min(1, volume)));

        if (progress < 1) {
          animationFrameId.current = requestAnimationFrame(frame);
        } else {
          player.setVolume(1);
          isTransitioning.current = false;
        }
      };
      animationFrameId.current = requestAnimationFrame(frame);
    };

    const loopCheck = () => {
      if (
        !isTransitioning.current &&
        playbackState &&
        !playbackState.paused &&
        playbackState.position >= endMs
      ) {
        isTransitioning.current = true;

        player.seek(startMs).then(() => {
          seamlessTransition();
        });
      }

      if (!isTransitioning.current) {
        animationFrameId.current = requestAnimationFrame(loopCheck);
      }
    };

    animationFrameId.current = requestAnimationFrame(loopCheck);

    return cleanup;
  }, [player, playbackState, isActive, config]);
}