import { Component, signal, viewChild, afterRenderEffect, ElementRef, computed } from "@angular/core";

import { ThemeService } from "../../app/theme.service";
import { AnchorService } from "../../app/anchor.service";

@Component({
  selector: 'app-anchored-tool-tip',
  standalone: true,
  styleUrls: ['./anchored-tool-tip.component.css'],
  templateUrl: './anchored-tool-tip.component.html',
})
export class AnchoredToolTipComponent {
  anchoredToolTipDiv = viewChild<ElementRef>("anchoredToolTipDiv");

  dimensions = signal({ width: 0, height: 0 });

  isVisible = computed(() =>
    this.dimensions().width > 0 &&
    this.dimensions().height > 0 &&
    this._anchorService.tooltip()?.signalType === "show"
  );

  content = computed(() => this._anchorService.tooltip()?.payload?.content ?? "");

  left = computed(() => {
    const xPos = this._anchorService.tooltip()?.xPos ?? "left";
    switch (xPos) {
      case "left":
        return this._anchorService.tooltip()?.x ?? 0;
      case "center":
        return this._anchorService.tooltip()?.x ?? 0 - (this.dimensions().width / 2);
      case "right":
        return this._anchorService.tooltip()?.x ?? 0 - this.dimensions().width;
      default:
        return this._anchorService.tooltip()?.x ?? 0;
    }
  });

  top = computed(() => {
    const yPos = this._anchorService.tooltip()?.yPos ?? "top";
    switch (yPos) {
      case "top":
        return this._anchorService.tooltip()?.y ?? 0;
      case "center":
        return (this._anchorService.tooltip()?.y ?? 0) - (this.dimensions().height / 2);
      case "bottom":
        return (this._anchorService.tooltip()?.y ?? 0) - this.dimensions().height;
      default:
        return this._anchorService.tooltip()?.y ?? 0;
    }
  });

  constructor(private _themeService: ThemeService, private _anchorService: AnchorService) {
    afterRenderEffect(() => {
      const tooltip = this._anchorService.tooltip();
      if (tooltip?.signalType !== "show") {
        this.dimensions.set({ width: 0, height: 0 });
        return;
      }
      const rect = this.anchoredToolTipDiv()?.nativeElement?.getBoundingClientRect();

      console.log("rect", rect);
      const width = rect?.width;
      const height = rect?.height;
      if (width === undefined || height === undefined) {
        return;
      }
      this.dimensions.set({ width, height });
    });
  }
}
