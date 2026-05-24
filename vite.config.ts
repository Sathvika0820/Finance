// @lovable.dev/vite-tanstack-config already includes the following - do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isVercel = process.env.VERCEL === "1";
const isNetlify = process.env.NETLIFY === "true" || process.env.NETLIFY === "1";
const usesNitroAdapter = isVercel || isNetlify;

function shouldIgnoreKnownDependencyWarning(warning: { code?: string; id?: string; message?: string }) {
  const warningText = `${warning.id || ""} ${warning.message || ""}`;

  if (
    warning.code === "MODULE_LEVEL_DIRECTIVE" &&
    /node_modules[\\/](@tanstack|sonner)/.test(warningText)
  ) {
    return true;
  }

  if (
    warning.code === "UNUSED_EXTERNAL_IMPORT" &&
    /node_modules[\\/]@tanstack/.test(warningText)
  ) {
    return true;
  }

  if (/Generated an empty chunk: "_libs\//.test(warningText)) {
    return true;
  }

  return false;
}

function stripTanStackSourceMapComments() {
  const sourceMapComment = /\/\/# sourceMappingURL=.*$/gm;

  return {
    name: "strip-tanstack-source-map-comments",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      if (/node_modules[\\/]@tanstack[\\/].*\.(js|mjs)$/.test(id)) {
        const cleaned = code.replace(sourceMapComment, "");
        if (cleaned !== code) {
          return { code: cleaned, map: null };
        }
      }
    },
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this - wrangler.jsonc main alone is insufficient.
export default defineConfig({
  cloudflare: usesNitroAdapter ? false : undefined,
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: usesNitroAdapter
    ? [
        nitro({
          rollupConfig: {
            onwarn(warning, defaultHandler) {
              if (shouldIgnoreKnownDependencyWarning(warning)) return;
              defaultHandler(warning);
            },
          },
        }),
      ]
    : [],
  vite: {
    resolve: {
      alias: {
        // framer-motion's package builds can break server rendering in this
        // TanStack Start setup, so use the local SSR-safe motion shim.
        "framer-motion": path.resolve(__dirname, "src/framer-motion-shim.ts"),
      },
    },
    ssr: {
      noExternal: ["framer-motion"],
    },
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (shouldIgnoreKnownDependencyWarning(warning)) return;
          defaultHandler(warning);
        },
      },
    },
    plugins: [stripTanStackSourceMapComments()],
  },
});
