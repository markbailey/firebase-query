import { useContext } from 'react';
import Context from '../context/Context';

/**
 * Custom React hook to access the Firebase context.
 *
 * @returns The current Firebase context value.
 * @throws If used outside of a `FirebaseAppProvider`, throws an error.
 *
 * @example
 * const firebase = useFirebaseApp();
 */
export const useFirebaseApp = () => {
  const context = useContext(Context);

  if (!context) throw new Error('useFirebaseApp must be used within a FirebaseAppProvider');
  return context;
};

export default useFirebaseApp;
