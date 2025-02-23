import React from 'react';
import SpinnerLoading from 'app/components/SpinnerLoading';

export function createLazyScreen(importFn: () => Promise<{ default: React.ComponentType<any> }>) {
  // Lazy-load the target screen
  const LazyScreen = React.lazy(importFn);

  // Return a small wrapper that shows SpinnerLoading while chunk is fetched
  return function LazyScreenWrapper(props: any) {
    return (
      <React.Suspense fallback={<SpinnerLoading />}>
        <LazyScreen {...props} />
      </React.Suspense>
    );
  };
}
