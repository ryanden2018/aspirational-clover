import { documentUrlPrefix } from "../constants";

export function getDocumentUrlFromSlug(slug: string) {
  return `${ documentUrlPrefix }/${ slug }`;
}
