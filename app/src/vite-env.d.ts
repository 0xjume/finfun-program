/// <reference types="vite/client" />

// Properly typed Vite env variables
interface ImportMetaEnv {
  readonly VITE_SOLANA_RPC_URL: string;
  readonly VITE_PROGRAM_ID: string;
  readonly VITE_AVE_API_KEY: string;
  readonly REACT_APP_SOLANA_RPC_URL: string;
  readonly REACT_APP_PROGRAM_ID: string;
  readonly [key: string]: string | undefined;
}

// Make sure Vite picks up the env type
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
