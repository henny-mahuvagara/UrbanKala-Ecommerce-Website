import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-cart',
    imports: [NgForOf, NgIf, RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
    cartItems: any[] = [];
    totalPrice = 0;

    constructor(private cartService: CartService) { }

    ngOnInit() {
        this.cartService.getCartItems().subscribe((items: any[]) => {
            this.cartItems = items;
            this.totalPrice = items.reduce((sum, item) => sum + Number(item.price), 0);
        });
    }

    removeItem(id: string) {
        this.cartService.removeFromCart(id);
    }
}
