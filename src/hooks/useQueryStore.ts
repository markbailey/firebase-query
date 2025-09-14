import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { useIndexedDB } from './useIndexedDB';

/**
 * Custom React hook for interacting with a query store in IndexedDB.
 *
 * Provides live querying, setting, and removing of data associated with a specific path.
 *
 * @template T The type of the data to be stored and retrieved.
 * @param path The unique path key used to identify the query in the store.
 * @returns An object containing:
 * - `data`: The current value stored at the given path, or `undefined` if not found.
 * - `set`: A function to store data at the given path, with optional expiry in seconds.
 *
 * @example
 * ```tsx
 * const { data, set } = useQueryStore<MyType>('some/path');
 * ```
 */
export const useQueryStore = <T>(path: string): [T | undefined, (data: T, keepDataFor?: number) => Promise<void>] => {
  const idb = useIndexedDB();
  const data = useLiveQuery(async () => {
    if (/(undefined)/g.test(path)) return;
    console.log(`useQueryStore: Fetching data for path: ${path}`);
    const query = await idb.queries.where('path').equals(path).first();

    if (query?.expiresAt && new Date(query.expiresAt) < new Date())
      idb.queries
        .where('path')
        .equals(path)
        .delete()
        .then(() => console.log(`useQueryStore: deleted data for path: ${path}`)); // Remove expired data

    return query?.data as T | undefined;
  }, [path]);

  const set = useCallback(
    async (data: T, keepDataFor: number = 60) => {
      if (/(undefined)/g.test(path)) return;
      const expiryAt = new Date(Date.now() + keepDataFor * 1000).toISOString();
      console.log(`useQueryStore: Setting data for path: ${path}`, data, expiryAt);
      await idb.queries.put({
        path: path,
        data: data,
        createdAt: new Date().toISOString(),
        expiresAt: expiryAt,
      });
    },
    [path],
  );

  return [data, set];
};
