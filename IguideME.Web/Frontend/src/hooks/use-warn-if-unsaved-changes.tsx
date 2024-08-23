// The useWarnIfUnsavedChanges custom hook is created by AB Etemadi (https://github.com/ab-etemadi).
// The original source code can be found at https://github.com/vercel/next.js/discussions/50700#discussioncomment-10134248.
// It was accessed on 2024-08-07.

/* eslint-disable -- The custom hook is not created by me. */

import { useEffect } from 'react';
import { type NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

export const useWarnIfUnsavedChanges = (unsaved: boolean) => {
  const router = useRouter();

  const handleAnchorClick = (e: MouseEvent) => {
    if (e.button !== 0) return; // only handle left-clicks
    const targetUrl = (e.currentTarget as HTMLAnchorElement).href;
    const currentUrl = window.location.href;
    if (targetUrl !== currentUrl && window.onbeforeunload) {
      // @ts-expect-error
      const res = window.onbeforeunload();
      if (!res) e.preventDefault();
    }
  };

  const addAnchorListeners = () => {
    const anchorElements = document.querySelectorAll('a[href]');
    anchorElements.forEach((anchor) => {
      // @ts-expect-error
      anchor.addEventListener('click', handleAnchorClick);
    });
  };

  useEffect(() => {
    const mutationObserver = new MutationObserver(addAnchorListeners);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    addAnchorListeners();

    return () => {
      mutationObserver.disconnect();
      const anchorElements = document.querySelectorAll('a[href]');
      anchorElements.forEach((anchor) => {
        // @ts-expect-error
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // required for Chrome
    };

    const handlePopState = (e: PopStateEvent) => {
      if (unsaved) {
        const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmLeave) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    if (unsaved) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      window.addEventListener('popstate', handlePopState);
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      window.removeEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [unsaved]);

  useEffect(() => {
    const originalPush = router.push;

    router.push = (url: string, options?: NavigateOptions) => {
      if (unsaved) {
        const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (confirmLeave) originalPush(url, options);
      } else {
        originalPush(url, options);
      }
    };

    return () => {
      router.push = originalPush;
    };
  }, [router, unsaved]);
};
