import { Injectable, signal, computed } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  private _mode = signal<"light" | "dark">("light");

  mode = this._mode.asReadonly();
  toggleMode() {
    this._mode.set(this._mode() === "light" ? "dark" : "light");
  }
  setMode(mode: "light" | "dark") {
    this._mode.set(mode);
  }

  modeAsObservable = toObservable(this.mode);

  classNames = computed(() => ({
    "appBody": `app-body ${this._mode() === "light" ? "app-body-light" : "app-body-dark"}`,
    "button": `styled-button ${this._mode() === "light" ? "styled-button-light" : "styled-button-dark"}`,
    "toolBar": `app-tool-bar ${this._mode() === "light" ? "app-tool-bar-light" : "app-tool-bar-dark"}`,
    "propertyViewer": `app-property-viewer ${this._mode() === "light" ? "app-property-viewer-light" : "app-property-viewer-dark"}`,
    "tabBar": `app-tab-bar ${this._mode() === "light" ? "app-tab-bar-light" : "app-tab-bar-dark"}`,
    "tabBarTabActive": `app-tab-bar-tab ${this._mode() === "light" ? "app-tab-bar-tab-active-light" : "app-tab-bar-tab-active-dark"}`,
    "tabBarTabInactive": `app-tab-bar-tab ${this._mode() === "light" ? "app-tab-bar-tab-inactive-light" : "app-tab-bar-tab-inactive-dark"}`,
    "toolTip": `tool-tip ${this._mode() === "light" ? "tool-tip-light" : "tool-tip-dark"}`,
    "graphicsPanelSvg": `graphics-panel-svg ${this._mode() === "light" ? "graphics-panel-svg-light" : "graphics-panel-svg-dark"}`,
  }));
}
