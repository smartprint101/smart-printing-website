/** Static hosts may serve index.html directly; resolve it to the canonical route. */
export function normalizePath(path: string): string {
  const withoutIndex = path.replace(/\/index\.html$/, "/");
  return `${withoutIndex.replace(/\/+$/, "")}/`;
}
