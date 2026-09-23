import { documentUrlPrefix } from "../constants";

export function getDocumentSlugFromUrl(url: string): string {
  return url?.split?.(`${ documentUrlPrefix }/`)?.[1] ?? "";
}
