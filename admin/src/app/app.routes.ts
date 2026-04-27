import { Routes } from '@angular/router';
import { AddproductComponent } from './pages/addproduct/addproduct.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Admin Dashboard Routes
  { path: '', component: AddproductComponent }, // Default dashboard
  { path: 'users', component: UsersComponent }, // New Users page
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders.component')
        .then(m => m.OrdersComponent),
  },
  {
    path: 'inquiries',
    loadComponent: () =>
      import('./pages/inquiries/inquiries.component')
        .then(m => m.InquiriesComponent),
  },
  { path: '**', redirectTo: '' },
];

