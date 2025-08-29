import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  /**
   * Root margin for the intersection observer (default: "100px")
   * This triggers loading before the element is fully visible
   */
  rootMargin?: string;
  /**
   * Threshold for the intersection observer (default: 0.1)
   */
  threshold?: number;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "100px",
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // Only trigger loading if:
      // 1. The sentinel is intersecting (visible)
      // 2. There's more data to load
      // 3. We're not already loading
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore],
  );

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null, // Use viewport as root
      rootMargin,
      threshold,
    });

    // Start observing the sentinel element
    const currentSentinel = sentinelRef.current;
    if (currentSentinel && observerRef.current) {
      observerRef.current.observe(currentSentinel);
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, rootMargin, threshold]);

  return sentinelRef;
}
