// Extends the global CloudflareEnv interface declared by
// @opennextjs/cloudflare so getCloudflareContext().env stays typed.
// Add new wrangler.toml bindings here.
declare global {
  interface CloudflareEnv {
    VIEWS: KVNamespace;
  }
}

export {};
