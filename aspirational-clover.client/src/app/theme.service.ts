import { Injectable, signal, computed } from "@angular/core";

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

  classNames = computed(() => ({
    "button": `styled-button ${this._mode() === "light" ? "styled-button-light" : "styled-button-dark"}`,
  }));
}
