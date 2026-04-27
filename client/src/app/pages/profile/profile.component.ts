import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  totalOrders = 0;
  activeOrders = 0;
  deliveredOrders = 0;
  loading = true;

  constructor(private authService: AuthService, private cartService: CartService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    this.cartService.getUserOrders().subscribe(orders => {
      this.totalOrders = orders.length;
      const activeStatuses = ['Processing', 'Ordered', 'Accepted', 'Packed', 'Shipped'];
      this.activeOrders = orders.filter(o => activeStatuses.includes(o.status)).length;
      this.deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
      this.loading = false;
    });
  }
}
