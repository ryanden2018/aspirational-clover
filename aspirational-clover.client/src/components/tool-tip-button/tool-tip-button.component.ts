import { Component, Input, input, computed, viewChild, ElementRef } from "@angular/core";

import { ThemeService } from "../../app/theme.service";
import { AnchorService } from "../../app/anchor.service";
import { ToolTipSignal } from "../../types";

@Component({
  selector: 'app-tool-tip-button',
  standalone: true,
  templateUrl: './tool-tip-button.component.html',
})
export class ToolTipButtonComponent {
  id = input<string>('');
  toolTipContent = input<string>('');
  click = input<(() => void) | void>(() => {});
  positioning = input<'bottom-left' | 'right-center'>('bottom-left');
  timeout = input<number>(0);
  disabled = input<boolean>(false);

  @Input('aria-label') ariaLabel?: string;
  @Input('aria-pressed') ariaPressed?: string | boolean;
  @Input('aria-haspopup') ariaHaspopup?: string | boolean;

  buttonClassName = computed(() => this._themeService.classNames().button);

  button = viewChild<ElementRef<HTMLButtonElement>>('targetButton');

  constructor(private _themeService: ThemeService, private _anchorService: AnchorService) { }

  private getBaseAnchor(): ToolTipSignal {
    return {
      signalType: "show",
      anchorType: "tooltip",
      xPos: 'left',
      yPos: this.positioning() === 'bottom-left' ? 'top' : 'center',
      id: this.id(),
      x: 0,
      y: 0,
      payload: {
        content: this.toolTipContent(),
      }
    };
  }

  getX(rect: DOMRect): number {
    switch (this.positioning()) {
      case 'bottom-left':
        return rect.left;
      case 'right-center':
        return rect.right + 10;
      default:
        return rect.right;
    }
  }

  getY(rect: DOMRect): number {
    switch (this.positioning()) {
      case 'bottom-left':
        return rect.bottom + 10;

      case 'right-center':
        return rect.top + rect.height / 2;

      default:
        return rect.top + rect.height / 2;
    }
  }

  onMouseEnter() {
    try {
      const baseAnchor = this.getBaseAnchor();
      const rect = this.button()?.nativeElement?.getBoundingClientRect?.();
      if (!rect) throw new Error("Button element not found for tooltip positioning.");
      const x = this.getX(rect);
      const y = this.getY(rect);

      this._anchorService.pushAnchor({
        ...baseAnchor,
        x,
        y,
      });

      const maybeTimeout = this.timeout();
      if (typeof maybeTimeout === "number" && maybeTimeout > 0) {
        setTimeout(() => {
          this._anchorService.pushAnchor({ ...baseAnchor, signalType: "hide" });
        }, maybeTimeout);
      }
    } catch (e) {
      console.log("Error occurred while pushing anchor:", e);
    }
  }

  onMouseLeave() {
    const baseAnchor = this.getBaseAnchor();
    this._anchorService.pushAnchor({ ...baseAnchor, signalType: "hide" });
  }
}
