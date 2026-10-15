export function getDocumentSlugFromUrl(url: string): string {
  const parts: string[] = url?.split?.("?")?.[0]?.split("/") ?? [];
  if (parts.length === 0) return "";
  return parts[parts.length - 1];
}
