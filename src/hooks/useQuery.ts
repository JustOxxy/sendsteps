import { useState, useEffect } from 'react';

import { removeEmptyEntries } from '../utils/removeEmptyEntries';
import { API_URL } from '../constants/api';
import { cachedFetch } from '../utils/cachedFetch';

interface UseQueryReturnType<T> {
  data: T | null;
  isError: boolean;
  isLoading: boolean;
}

export const useQuery = <T extends object, K extends object = object>(
  url: string,
  params?: K,
  skip?: boolean,
): UseQueryReturnType<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (skip) return;

    setIsLoading(true);
    setIsError(false);

    const fetchData = () => {
      const apiUrl = new URL(`${API_URL}${url}`);
      if (params) {
        apiUrl.search = new URLSearchParams(removeEmptyEntries(params)).toString();
      }

      cachedFetch<T>(apiUrl)
        // should be properly validated (yup, zod, etc.)
        .then((response) => {
          setData(response);
        })
        .catch((error) => {
          console.error(error);
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchData();
  }, [url, skip, params]);

  useEffect(() => {
    if (skip) {
      setData(null);
    }
  }, [skip]);

  return { data, isLoading, isError };
};
