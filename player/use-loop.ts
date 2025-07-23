import { useEffect, useRef, useState } from 'react';

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
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const isTransitioning = useRef(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const cleanup = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (intervalId.current) {
        clearInterval(intervalId.current);
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
    };

    const startLoopChecker = () => {
      if (isTabVisible) {
        // Use requestAnimationFrame when tab is visible
        const check = () => {
          loopCheck();
          if (!isTransitioning.current) {
            animationFrameId.current = requestAnimationFrame(check);
          }
        };
        animationFrameId.current = requestAnimationFrame(check);
      } else {
        // Use setInterval when tab is hidden
        intervalId.current = setInterval(loopCheck, 100);
      }
    };

    startLoopChecker();

    return cleanup;
  }, [player, playbackState, isActive, config]);
}
