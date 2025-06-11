/// <reference types="vite/client" />
// this fixes the error of import meta env

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 