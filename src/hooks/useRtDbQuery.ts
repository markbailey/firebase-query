import { DataSnapshot, onValue, ref, type ListenOptions, type Unsubscribe } from 'firebase/database';
import { useCallback, useEffect, useRef } from 'react';
import useFirebaseApp from './useFirebaseApp';
import useQueryStatus from './useQueryStatus';
import { useQueryStore } from './useQueryStore';

export interface QueryOptions extends ListenOptions {
  skip?: boolean;
  readonly timeout?: number;
  keepUnusedDataFor?: number; // Optional duration to keep stale data before refetching. Set to 0 to disable.
}

export interface QueryStatus {
  readonly error: Error | null;
  readonly isFetching: boolean;
  readonly hasError: boolean;
  readonly isSuccessful: boolean;
}

export interface QueryResponse<T> extends QueryStatus {
  readonly data?: T;
}

/**
 * Custom React hook for querying data from Firebase Realtime Database.
 *
 * @template T - The type of data expected from the query.
 * @param {string} path - The database path to query.
 * @param {QueryOptions} [options={}] - Optional query configuration.
 * @returns {[QueryResponse<T>, Unsubscribe]} - Returns a tuple containing the query response and an unsubscribe function.
 *
 * @remarks
 * - Automatically manages subscription and cleanup for the specified path.
 * - Handles query status, error, and loading state.
 * - Supports timeout and one-time query options.
 * - If `options.skip` is true, the query is not executed.
 *
 * @example
 * ```tsx
 * const [{ data, isFetching, error }, unsubscribe] = useRtDbQuery<User>('/users/123');
 * ```
 */
const useRtDbQuery = <T>(path: string, options: QueryOptions = {}): [QueryResponse<T>, Unsubscribe] => {
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const { rtdb } = useFirebaseApp();
  const { status, setError, setIsFetching } = useQueryStatus();
  const [data, setData] = useQueryStore<T>(path);

  const query = useCallback(
    <T>(
      path: string,
      onSuccess: (data: T) => void,
      onError?: (error: Error) => void,
      options: QueryOptions = {},
    ): Unsubscribe => {
      const timeout = setTimeout(() => {
        const error = new Error(`Request to '${path}' timed out!`);

        console.error(error);
        onError?.(error);
      }, options.timeout ?? 6000);

      const unsubscribe = onValue(
        ref(rtdb, path),
        (snapshot: DataSnapshot) => {
          clearTimeout(timeout);
          onSuccess(snapshot.val());
        },
        (error) => {
          console.error('Error fetching data:', error);
          clearTimeout(timeout);
          onError?.(error);
        },
        options,
      );

      return () => {
        console.log('FirebaseQuery::Unsubscribing from query at path:', path);
        clearTimeout(timeout);
        unsubscribe();
      };
    },
    [],
  );

  const unsubscribe = useCallback<Unsubscribe>(() => unsubscribeRef.current?.(), []);

  useEffect(() => {
    if (options.skip) return;
    setIsFetching(true);
    setError(null);

    const unsubscribe = query<T>(
      path,
      (data) => {
        if (data) setData(data);
        console.debug(`FirebaseQuery::Query successful for path: ${path}`, data);
        setIsFetching(false);
      },
      (error) => {
        setError(error);
        setIsFetching(false);
      },
      { onlyOnce: options.onlyOnce },
    );

    if (options.onlyOnce) return;
    unsubscribeRef.current = unsubscribe;
    return unsubscribe;
  }, [path, options.skip, options.onlyOnce, setIsFetching, setError, setData]);

  return [{ ...status, data }, unsubscribe];
};

export default useRtDbQuery;
