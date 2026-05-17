// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
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
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  cloudflare: isVercel ? false : undefined,
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: isVercel ? [nitro()] : [],
  vite: {
    resolve: {
      alias: {
        // framer-motion's root package export points at a browser-only bundle
        // that breaks server rendering. Use the SSR-safe CJS entry instead.
        "framer-motion": isVercel
          ? path.resolve(__dirname, "src/framer-motion-shim.ts")
          : path.resolve(__dirname, "node_modules/framer-motion/dist/cjs/index.js"),
      },
    },
    ssr: {
      noExternal: ["framer-motion"],
    },
    plugins: [stripTanStackSourceMapComments()],
  },
});
