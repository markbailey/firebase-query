import { type Database } from 'firebase/database';
import { Firestore } from 'firebase/firestore';
import { createContext } from 'react';

export interface FirebaseApp {
  appName: string;
  rtdb: Database;
  firestore: Firestore;
}

const Context = createContext<FirebaseApp | null>(null);
export const ContextProvider = Context.Provider;

export default Context;
