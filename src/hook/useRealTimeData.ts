import { useState, useEffect, useCallback } from "react";

interface UseRealTimeDataOptions {
  pollInterval?: number; // in milliseconds (default: 30000ms = 30 seconds)
  onError?: (error: Error) => void;
}

/**
 * Custom hook for real-time data fetching with polling
 * @param fetchFn - Async function that fetches the data
 * @param options - Configuration options
 * @returns Object with data, loading state, error, and control functions
 */
export const useRealTimeData = <T,>(
  fetchFn: () => Promise<T>,
  options: UseRealTimeDataOptions = {}
) => {
  const { pollInterval = 30000, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onError]);

  // Set up auto-refresh polling
  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval if auto-refresh is enabled
    let interval: NodeJS.Timeout | null = null;
    if (isAutoRefreshEnabled) {
      interval = setInterval(fetchData, pollInterval);
    }

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchData, isAutoRefreshEnabled, pollInterval]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Toggle auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled((prev) => !prev);
  }, []);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    isAutoRefreshEnabled,
    toggleAutoRefresh,
  };
};

export default useRealTimeData;
