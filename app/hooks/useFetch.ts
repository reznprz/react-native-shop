import { useState, useEffect } from "react";

interface UseFetchOptions {
  url: string;
  options?: RequestInit;
}

export default function useFetch<T>({ url, options }: UseFetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Network error: ${response.statusText}`);
        }
        const json = (await response.json()) as T;
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [url, options]);

  return { data, error, loading };
}
