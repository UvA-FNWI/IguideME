'use client';

import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function useWindowSize(): {
  width: number;
  height: number;
} {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useDebouncedCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 500);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return windowSize;
}
