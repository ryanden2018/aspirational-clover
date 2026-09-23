import { AppDocument } from "../data/model";
import { documentUrlPrefix } from "../constants";

export function getDocumentUrl(document: AppDocument) {
  return `${ documentUrlPrefix }/${ document.documentSlug }`;
}
