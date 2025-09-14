import { useMemo, useState } from 'react';

export interface QueryStatus {
  readonly error: Error | null;
  readonly isFetching: boolean;
  readonly hasError: boolean;
  readonly isSuccessful: boolean;
}

/**
 * Custom React hook to manage and expose the status of a query operation.
 *
 * @returns An object containing:
 * - `status`: An object with the current query status, including error, fetching state, and derived flags.
 * - `setError`: Setter function to update the error state.
 * - `setIsFetching`: Setter function to update the fetching state.
 *
 * The `status` object includes:
 * - `error`: The current error, or `null` if no error.
 * - `isFetching`: Boolean indicating if the query is in progress.
 * - `hasError`: Boolean indicating if there is an error.
 * - `isSuccessful`: Boolean indicating if the query is successful (no error and fetching).
 */
const useQueryStatus = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  return useMemo(() => {
    const hasError = !!error;
    const isSuccessful = !error && !!isFetching;
    const status: QueryStatus = {
      error,
      isFetching,
      hasError,
      isSuccessful,
    };
    return { status, setError, setIsFetching };
  }, [error, isFetching]);
};

export default useQueryStatus;
