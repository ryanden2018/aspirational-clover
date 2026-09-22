import { Component, input } from '@angular/core';

import { AppDocument } from "../../data/model";

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  styleUrls: ['./tab-bar.component.css'],
  templateUrl: './tab-bar.component.html',
})
export class TabBarComponent {
  documents = input<AppDocument[]>([]);

}
