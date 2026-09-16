import { Injectable, signal, computed, Signal } from "@angular/core";
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription } from "rxjs";

import { ResourcesComponent } from "../components/resources/resources.component";


@Injectable({
  providedIn: "root"
})
export class ResourcesService {
  private _resources = signal<ResourcesComponent | undefined>(undefined);
  private _resourcesSubscription: Subscription | undefined;

  subscribeResources(resources: Signal<ResourcesComponent | undefined>) {
    if (!resources) return;
    this._resourcesSubscription?.unsubscribe();
    this._resourcesSubscription = toObservable(resources).subscribe(res => this._resources.set(res));
  }

  resources = this._resources.asReadonly();
}
