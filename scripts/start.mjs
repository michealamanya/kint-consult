import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const standalone = resolve(root, ".next/standalone");
const server = resolve(standalone, "server.js");
if (!existsSync(server)) {
  console.error("Run npm run build before starting the production server.");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length) {
  if (
    args.length !== 2 ||
    !["--port", "-p"].includes(args[0]) ||
    !/^\d+$/.test(args[1]) ||
    Number(args[1]) < 1 ||
    Number(args[1]) > 65535
  ) {
    console.error("Usage: npm start -- --port 3000");
    process.exit(1);
  }
  process.env.PORT = args[1];
}
process.env.HOSTNAME ||= "127.0.0.1";
cpSync(resolve(root, "public"), resolve(standalone, "public"), {
  recursive: true,
});
cpSync(resolve(root, ".next/static"), resolve(standalone, ".next/static"), {
  recursive: true,
});
await import(pathToFileURL(server).href);
