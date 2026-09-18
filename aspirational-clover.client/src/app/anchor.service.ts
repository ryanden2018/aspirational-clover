import { Injectable, signal } from "@angular/core";
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter } from "rxjs";

import { AnchorSignal, ToolTipSignal } from "../types";

@Injectable({
  providedIn: "root"
})
export class AnchorService {
  private _anchor = signal<AnchorSignal | undefined>(undefined);

  pushAnchor(signal: AnchorSignal) {
    this._anchor.set(signal);
  }

  tooltip = toSignal(toObservable(this._anchor.asReadonly())
    .pipe(
      filter((signal): signal is ToolTipSignal =>
        signal !== undefined &&
        signal.anchorType === "tooltip" &&
        !!signal?.payload &&
        typeof signal?.payload === "object" &&
        "content" in signal.payload &&
        typeof signal?.payload?.content === "string")
  ));

  popover = toSignal(toObservable(this._anchor.asReadonly())
    .pipe(
      filter((signal): signal is AnchorSignal => signal !== undefined && signal.anchorType === "popover")
  ));
}
