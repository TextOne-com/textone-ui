import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

/**
 * The tokens read from @textone-com/tokens itself at build time, so this page can never show a
 * value the package does not have.
 */
const require = createRequire(import.meta.url);
const css = readFileSync(require.resolve("@textone-com/tokens/tokens.css"), "utf8");

export type Token = { name: string; value: string; note?: string };

export const tokens: Token[] = [...css.matchAll(/--([a-z0-9-]+):\s*([^;]+);(?:[ \t]*\/\*[ \t]*(.*?)[ \t]*\*\/)?/g)].map(
  ([, name = "", value = "", note]) => ({ name, value: value.trim(), note }),
);

export const group = (prefix: string) => tokens.filter((t) => t.name.startsWith(prefix));
