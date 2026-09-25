import { AppDocument } from "../data/model";
import { UpdateDocumentCommand } from "../data/commands";

export function applyUpdateDocument(document: AppDocument, update: UpdateDocumentCommand, direction: "forward" | "reverse"): AppDocument {
  if (!document || !update || !direction) return document;
  if (document.clientUuid !== update.documentClientUuid) return document;

  const patch = update.payload?.[direction];

  if (!patch) return document;

  return { ...document, ...patch };
}

export function createUpdateDocumentCommand(initial: AppDocument, target: AppDocument): UpdateDocumentCommand {
  return {
    type: "updateDocument",
    documentClientUuid: initial.clientUuid,
    payload: {
      forward: { name: target.name },
      reverse: { name: initial.name },
    }
  }
}
