import Dexie, { type EntityTable } from 'dexie';
import { useMemo } from 'react';
import useFirebaseApp from './useFirebaseApp';

export interface Query<T = unknown> {
  path: string;
  data: T; // Adjust the type according to your needs
  createdAt: string; // ISO date string
  expiresAt: string | null; // Optional ISO date string for expiration
}

export interface IDB extends Dexie {
  queries: EntityTable<Query>; // Define the structure of your queries table
}

/**
 * Custom React hook that initializes and returns an IndexedDB instance using Dexie,
 * scoped to the current Firebase app name. The database contains a single table `queries`
 * with fields: `path`, `data`, `createdAt`, and `expiresAt`.
 *
 * @returns {IDB} An instance of the IndexedDB database configured for the current Firebase app.
 *
 * @remarks
 * - The database schema is defined with a single table named `queries`.
 * - The hook memoizes the database instance based on the Firebase app name.
 * - Requires `useFirebaseClient` to provide the Firebase app context.
 */
export const useIndexedDB = () => {
  const { appName } = useFirebaseApp();

  return useMemo(() => {
    const idb = new Dexie(appName) as IDB;
    // Define the schema for the queries table
    const queries = 'path, data, createdAt, expiresAt';

    idb.version(1).stores({ queries });
    return idb;
  }, [appName]);
};
