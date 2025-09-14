import { ref, set } from 'firebase/database';
import { useCallback } from 'react';
import useFirebaseApp from './useFirebaseApp';
import useQueryStatus, { type QueryStatus } from './useQueryStatus';

interface MutationStatus extends Omit<QueryStatus, 'isFetching'> {
  readonly isLoading: boolean;
}

/**
 * Custom React hook for performing mutations (set operations) on a Firebase Realtime Database path.
 *
 * @template T - The type of the value to be set at the specified database path.
 * @param {string} path - The Firebase Realtime Database path where the mutation will be performed.
 * @returns {[ (value: T) => Promise<void>, MutationStatus ]}
 *   A tuple containing:
 *   - A mutate function that sets the value at the specified path and returns a Promise.
 *   - A MutationStatus object representing the current mutation status (including loading and error states).
 *
 * @remarks
 * - The mutation function automatically handles loading and error states.
 * - If the mutation takes longer than 6 seconds, it will timeout and reject the promise.
 * - The hook relies on `useFirebaseClient` for the database instance and `useQueryStatus` for status management.
 */
const useRtDbMutation = <T>(path: string): [(value: T) => Promise<void>, MutationStatus] => {
  const { db } = useFirebaseApp();
  const { status, setError, setIsFetching: setIsLoading } = useQueryStatus();

  const mutate = useCallback(
    (value: T) =>
      new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(`Request to '${path}' timed out!`), 6000);

        setIsLoading(true);
        setError(null);

        set(ref(db, path), value)
          .then(resolve)
          .catch((error: Error) => {
            setError(error);
            reject(error);
          })
          .finally(() => {
            clearTimeout(timeout);
            setIsLoading(false);
          });
      }),
    [path],
  );

  return [mutate, { ...status, isLoading: status.isFetching }];
};

export default useRtDbMutation;
