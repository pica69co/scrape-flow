// waitFor function to wait for a promise resolved en ms
export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
