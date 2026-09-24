import { Injectable, signal, computed } from "@angular/core";

import { LinkedCommand } from "../data/commands";
import { AppDocument } from "../data/model";

interface UndoRedoState {
  undo: LinkedCommand;
  redo: LinkedCommand;
}

@Injectable({
  providedIn: "root"
})
export class UndoService {
  state = signal<Record<string, UndoRedoState>>({});
}
