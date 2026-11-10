import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const version = process.argv[2] ?? JSON.parse(readFileSync("./jsr.json", "utf-8")).version;

console.log("removing previous files..");
rmSync("./npm", { recursive: true, force: true });
mkdirSync("./npm", { recursive: true });

console.log("compiling stuff..");

const proc = Bun.spawnSync(
  [
    "bunx",
    "tsc",
    "index.ts",
    "--ignoreConfig",
    "--outDir",
    "./npm",
    "--declaration",
    "--target",
    "ESNext",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--lib",
    "ESNext,DOM,DOM.Iterable,DOM.AsyncIterable",
    "--types",
    "bun",
    "--allowImportingTsExtensions",
    "--rewriteRelativeImportExtensions",
    "--strict",
    "--skipLibCheck",
  ],
  { stdout: "inherit", stderr: "inherit" },
);

if (!proc.success) {
  throw new Error("tsc failed");
}

console.log("fixing declarations..");
Bun.spawnSync(["bun", "run", "./scripts/fix-dts.ts"], { stdout: "inherit", stderr: "inherit" });

console.log("writing package.json, version " + version + "...");

const pakcage = {
  name: "@shevernitskiy/evotor",
  description: "Evotor API client",
  version: version,
  author: "shevernitskiy",
  license: "MIT",
  type: "module",
  engines: {
    node: ">= 18",
  },
  repository: {
    type: "git",
    url: "https://github.com/shevernitskiy/evotor",
  },
  files: ["./src", "./index.js", "./index.d.ts"],
  main: "./index.js",
  module: "./index.js",
  types: "./index.d.ts",
  exports: {
    ".": {
      types: "./index.d.ts",
      import: "./index.js",
      default: "./index.js",
    },
  },
  keywords: ["evotor", "api", "client", "library", "wrapper"],
};
writeFileSync("./npm/package.json", JSON.stringify(pakcage, null, 2) + "\n");

console.log("copy some stuff...");

copyFileSync("./README.md", "./npm/README.md");
copyFileSync("./LICENSE", "./npm/LICENSE");

console.log("all done!");
