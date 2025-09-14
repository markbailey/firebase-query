import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import React, { useMemo, type FC, type PropsWithChildren } from 'react';
import { ContextProvider } from './Context';

type ProviderProps = Required<PropsWithChildren<{ options: FirebaseOptions; appName: string }>>;

/**
 * Provides Firebase services (App, Realtime Database, Firestore) to its children via React context.
 *
 * @param options - The Firebase configuration options used to initialize the app.
 * @param appName - The name of the Firebase app instance.
 * @param props - Additional props passed to the context provider.
 *
 * @remarks
 * This provider memoizes the Firebase client instance to avoid unnecessary re-initialization.
 * It supplies the initialized Firebase app, database, and Firestore instances to the context.
 */
const FirebaseAppProvider: FC<ProviderProps> = ({ options, appName, ...props }) => {
  const client = useMemo(() => {
    // Initialize Firebase app, database, and auth here using options
    const app = initializeApp(options, appName);
    const db = getDatabase(app);
    const firestore = getFirestore(app);

    return { appName, db, firestore };
  }, [options, appName]);

  return <ContextProvider value={client} {...props} />;
};

export default FirebaseAppProvider;
