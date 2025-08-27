import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'create', loadComponent: () => import('./presentation/pages/create-product/create.component').then(m => m.CreateComponent) },
  { path: 'edit/:id', loadComponent: () => import('./presentation/pages/create-product/create.component').then(m => m.CreateComponent) },
  { path: '**', redirectTo: '' }
];
