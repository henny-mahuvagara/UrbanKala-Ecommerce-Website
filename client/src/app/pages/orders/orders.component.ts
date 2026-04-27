import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { filter, take } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  loading = true;
  processingOrders: any[] = [];
  pastOrders: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.getUserOrders().subscribe({
      next: (data) => {
        console.log('Orders received in component:', data);

        // Manual client-side sorting by date (descending)
        const sortedData = [...data].sort((a, b) => {
          const dateA = a.orderedAt?.toDate?.() || new Date(a.orderedAt);
          const dateB = b.orderedAt?.toDate?.() || new Date(b.orderedAt);
          return dateB - dateA;
        });

        const activeStatuses = ['Processing', 'Ordered', 'Accepted', 'Packed', 'Shipped'];
        this.processingOrders = sortedData.filter(o => activeStatuses.includes(o.status));
        this.pastOrders = sortedData.filter(o => !activeStatuses.includes(o.status));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error in OrdersComponent:', err);
        this.loading = false;
      }
    });
  }

  // BUY AGAIN
  buyAgain(order: any) {
    this.cartService.addToCart(order).then(() => {
      alert("Added to cart again!");
    });
  }

  // CANCEL ORDER
  cancelOrder(orderId: string) {
    this.cartService.updateOrderStatus(orderId, 'Cancelled');
  }

}