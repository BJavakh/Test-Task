import { Route } from "@angular/router";
import { CreateUsersComponent } from "./pages/create-users/create-users.component";

export const appRoutes: Route[] = [
  {
    path: '**',
    // Here Should be Not Found
    component: CreateUsersComponent
  },
  {
    path: 'create-users',
    loadComponent: () => import('@pages').then(m => m.CreateUsersComponent)
  }
]
