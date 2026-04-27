import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactusComponent } from './pages/contactus/contactus.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'contactus',
    component: ContactusComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];
