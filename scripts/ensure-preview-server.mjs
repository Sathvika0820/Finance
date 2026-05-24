import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const serverIndex = resolve("dist/server/index.js");
const previewServer = resolve("dist/server/server.js");

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

if ((await exists(serverIndex)) && !(await exists(previewServer))) {
  await mkdir(dirname(previewServer), { recursive: true });
  await copyFile(serverIndex, previewServer);
}
