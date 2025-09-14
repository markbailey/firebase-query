/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DOMAIN: string;
  readonly VITE_EMAIL_DOMAIN: string;

  // Firebase Web SDK
  readonly VITE_FIREBASE_DB_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_SITE_KEY: string;

  // Firebase Admin SDK
  readonly VITE_FIREBASE_CLIENT_EMAIL: string;
  readonly VITE_FIREBASE_PRIVATE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
