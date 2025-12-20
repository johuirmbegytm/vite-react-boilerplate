
// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_AUTH_TOKEN: string;
  // Додай інші змінні, якщо будуть
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}