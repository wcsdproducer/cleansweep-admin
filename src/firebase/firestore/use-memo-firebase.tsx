'use client';

import { useMemo } from 'react';

/**
 * A hook to memoize a Firebase reference or query.
 * It ensures that the reference or query object is stable across renders
 * unless its dependencies change, preventing unnecessary re-subscriptions
 * and potential infinite loops in hooks like useCollection and useDoc.
 */
export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
