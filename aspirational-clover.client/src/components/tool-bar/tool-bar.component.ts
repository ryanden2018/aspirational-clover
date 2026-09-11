import { Component, computed } from '@angular/core';
import { ThemeService } from "../../app/theme.service";

@Component({
  selector: 'app-tool-bar',
  standalone: true,
  styleUrls: ['./tool-bar.component.css'],
  templateUrl: './tool-bar.component.html',
})
export class ToolBarComponent {
  buttonClassName = computed(() => this._themeService.classNames().button);

  constructor(private _themeService: ThemeService) { }
}
