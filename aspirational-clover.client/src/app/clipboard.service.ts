import { Injectable, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root"
})
export class ClipboardService {
  private _content = signal<string | null>(null);

  // This service SIMULATES a true copy-paste clipboard. Obviously we could interface
  // this service trivially with the computer's actual clipboard (or localStorage) but
  // we do a pure in-memory solution (hence there is no copy across adjacent browser tabs)
  // to avoid persisting any data to the client computer.

  content = this._content.asReadonly();

  contentAsObservable = toObservable(this.content);

  copy(data: string | null) {
    this._content.set(data);
  }
}
