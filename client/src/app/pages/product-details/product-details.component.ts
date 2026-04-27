import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  imports: [NgIf, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  addingToCart = false;
  addedToCart = false;
  alreadyInCart = false;

  constructor(
    private route: ActivatedRoute,
    private pser: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.pser.getSingleProduct(id).subscribe(async (data) => {
      this.product = data;
      // Check if already in cart
      if (this.authService.isLoggedIn()) {
        this.alreadyInCart = await this.cartService.isInCart(id);
      }
    });
  }

  async addToCart() {
    if (!this.authService.isLoggedIn) {
      alert('Please login first to add items to cart');
      this.router.navigate(['/login']);
      return;
    }

    this.addingToCart = true;
    try {
      // Check for duplicate
      const exists = await this.cartService.isInCart(this.product.id);
      if (exists) {
        Swal.fire({
          title: 'Already Added',
          text: 'This product is already in your cart',
          icon: 'info',
          background: '#3e0703',
          color: '#f5e6c8',
          confirmButtonColor: '#3e0703',

          customClass: {
            popup: 'my-popup',
            confirmButton: 'my-confirm-btn'
          }
        });
        this.product.quantity = this.quantity;
        this.alreadyInCart = true;
        this.addingToCart = false;
        return;
      }

      await this.cartService.addToCart(this.product);
      this.addedToCart = true;
      this.alreadyInCart = true;
      Swal.fire({
        title: 'Added to Cart',
        text: 'Your product has been added successfully',
        icon: 'success',
        color: 'rgb(245 233 216)',
        background: '#3e0703',
        confirmButtonColor: 'rgb(245 233 216)',

        customClass: {
          popup: 'my-popup',
          confirmButton: 'my-confirm-btn'
        }
      });
      setTimeout(() => { this.addedToCart = false; }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        title: 'Login Required',
        text: 'Please login first to add items to cart',
        icon: 'warning',
        color: 'rgb(245 233 216)',
        background: '#3e0703',
        confirmButtonColor: 'rgb(245 233 216)',
        // icon: 'error',

        customClass: {
          popup: 'my-popup',
          confirmButton: 'my-confirm-btn'
        }
      });
    } finally {
      this.addingToCart = false;
    }
  }

  async buyNow() {
    if (!this.authService.isLoggedIn) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login first to add items to cart',
        icon: 'warning',
        color: 'rgb(245 233 216)',
        background: '#3e0703',
        confirmButtonColor: 'rgb(245 233 216)',

        customClass: {
          popup: 'my-popup',
          confirmButton: 'my-confirm-btn'
        }
      });
      this.router.navigate(['/login']);
      return;
    }

    if (this.alreadyInCart) {
      this.product.quantity = this.quantity;
      this.router.navigate(['/checkout']);
      return;
    }

    this.addingToCart = true;
    try {
      await this.cartService.addToCart(this.product);
      this.router.navigate(['/checkout']);
    } catch (error) {
      console.error('Error in buy now:', error);
      // alert('Failed to process. Please try again.');
      Swal.fire({
        title: 'Login Required',
        text: 'Failed to process. Please try again.',
        color: 'rgb(245 233 216)',
        background: '#3e0703',
        confirmButtonColor: 'rgb(245 233 216)',
        icon: 'warning',

        customClass: {
          popup: 'my-popup',
          confirmButton: 'my-confirm-btn'
        }
      });
    } finally {
      this.addingToCart = false;
    }
  }

  quantity: number = 1;

  increaseQty() {
    const maxStock = this.product?.stock || 999;
    if (this.quantity >= maxStock) {
      Swal.fire({
        title: 'Stock Limit',
        text: `Only ${maxStock} items available in stock`,
        icon: 'warning',
        background: '#3e0703',
        color: '#f5e6c8',
        confirmButtonColor: '#3e0703',
        customClass: {
          popup: 'my-popup',
          confirmButton: 'my-confirm-btn'
        }
      });
      return;
    }
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  goBack() {
    this.location.back();
  }

  // activeSection: string | null = null;

  // toggleSection(section: string) {
  //   this.activeSection = this.activeSection === section ? null : section;
  // }

  showDetails: boolean = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
  // activeSection: string = 'details';


  // toggleSection(section: string) {
  //   this.activeSection = this.activeSection === section ? '' : section;
  // }
  activeSection: string | null = null;

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }
}
