 import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ProductService } from '../../service/product.service';

  @Component({
    selector: 'app-orders',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.css'
  })
  export class OrdersComponent {
    orders: any[] = [];

    constructor(private service: ProductService) {}
  ngOnInit() {
    this.service.getAllOrders().subscribe(data => {
      this.orders = data;
    });
  }

  acceptOrder(orderId: string) {
    this.service.updateOrderStatus(orderId, 'Accepted');
  }

  shipOrder(orderId: string) {
    this.service.updateOrderStatus(orderId, 'Shipped');
  }

  deliverOrder(orderId: string) {
    this.service.updateOrderStatus(orderId, 'Delivered');
  }

  cancelOrder(orderId: string) {
    this.service.updateOrderStatus(orderId, 'Cancelled');
  }
  }