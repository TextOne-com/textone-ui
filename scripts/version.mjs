// Sets one version on every published package, so tokens and components always ship together.
//   corepack pnpm release:version 0.2.0
import { readFileSync, writeFileSync } from "node:fs";

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version ?? "")) {
  console.error("usage: pnpm release:version <x.y.z>");
  process.exit(1);
}
for (const path of ["packages/tokens/package.json", "packages/vue/package.json"]) {
  const pkg = JSON.parse(readFileSync(path, "utf8"));
  pkg.version = version;
  writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`${pkg.name}@${version}`);
}
console.log(`\nNext: commit, then  git tag v${version} && git push --follow-tags`);
