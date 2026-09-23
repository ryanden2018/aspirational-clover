import { Routes } from "@angular/router";

import { documentUrlPrefix } from "./constants";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadComponent: () => import("./app/app.component").then(m => m.AppComponent),
  },
  {
    path: documentUrlPrefix.slice(1),
    loadComponent: () => import("./app/app.component").then(m => m.AppComponent),
    children: [
      {
        path: "**",
        loadComponent: () => import("./app/app.component").then(m => m.AppComponent),
      }
    ]
  }
]
