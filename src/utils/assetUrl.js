export function assetUrl(relativePath) {
  const base = import.meta.env.BASE_URL || '/';
  const p = relativePath.replace(/^\//, '');
  return `${base}${p}`;
}
