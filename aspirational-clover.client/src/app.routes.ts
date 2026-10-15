import { Routes } from "@angular/router";

import { documentUrlPrefix, defaultSlugs } from "./constants";

export const routes: Routes = [
  {
    path: "",
    redirectTo: `${ documentUrlPrefix.slice(1) }/${ defaultSlugs[0] }`,
    pathMatch: "full",
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
