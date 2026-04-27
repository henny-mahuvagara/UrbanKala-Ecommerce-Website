import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-checkout',
    imports: [NgForOf, NgIf, RouterLink, FormsModule],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
    cartItems: any[] = [];
    totalPrice = 0;

    // Shipping form
    fullName = '';
    address = '';
    city = '';
    zipCode = '';
    phone = '';

    // Payment modal
    showPaymentModal = false;
    showSuccessModal = false;
    selectedPayment = 'card';
    processing = false;

    // Dummy card
    cardNumber = '';
    cardExpiry = '';
    cardCvv = '';
    upiId = '';

    constructor(private cartService: CartService, private router: Router) { }

    ngOnInit() {
        this.cartService.getCartItems().subscribe((items: any[]) => {
            this.cartItems = items;
            this.totalPrice = items.reduce((sum, item) => sum + Number(item.price), 0);
        });
    }

    formatPhone() {
        this.phone = this.phone.replace(/[^0-9]/g, '').slice(0, 10);
    }

    formatZip() {
        this.zipCode = this.zipCode.replace(/[^0-9]/g, '').slice(0, 6);
    }

    // openPaymentModal() {
    //     if (!this.fullName || !this.address || !this.city || !this.zipCode || !this.phone) {
    //         alert('Please fill in all shipping details');
    //         return;
    //     }
    //     this.showPaymentModal = true;
    // }
    openPaymentModal() {

        if (!this.fullName || !this.address || !this.city || !this.zipCode || !this.phone) {
            Swal.fire({
                title: 'details',
                text: 'Please Fill Out Shipping Details',
                imageUrl: '/images/contact2.png',
                color: 'rgb(245 233 216)',
                background: '#3e0703',
                confirmButtonColor: 'rgb(245 233 216)',
                confirmButtonText: 'OK',

                customClass: {
                    popup: 'my-popup',
                    confirmButton: 'my-confirm-btn'
                }
            });
            return;
        }

        if (!/^[0-9]{10}$/.test(this.phone)) {
            // alert('Please enter valid 10 digit mobile number');
            Swal.fire({
                title: '',
                text: 'Please enter valid 10 digit mobile number',
                icon: 'info',
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

        if (!/^[0-9]{6}$/.test(this.zipCode)) {
            // alert('Please enter valid 6 digit PIN code');
            Swal.fire({
                title: '',
                text: 'Please enter valid 6 digit PIN code',
                icon: 'info',
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

        this.showPaymentModal = true;
    }
    closePaymentModal() {
        this.showPaymentModal = false;
    }

    // async processPayment() {
    //     this.processing = true;

    //     // Simulate payment processing
    //     await new Promise(resolve => setTimeout(resolve, 2000));

    //     // Clear cart after successful payment
    //     for (const item of this.cartItems) {
    //         await this.cartService.removeFromCart(item.id);
    //     }

    //     this.processing = false;
    //     this.showPaymentModal = false;
    //     this.showSuccessModal = true;
    // }
    async processPayment() {

        // Final validation before payment
        if (!/^[0-9]{10}$/.test(this.phone)) {
            Swal.fire({
                title: '',
                text: 'Please enter valid 10 digit mobile number',
                icon: 'info',
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

        if (!/^[0-9]{6}$/.test(this.zipCode)) {
            this.showAlert('Invalid PIN code');
            return;
        }

        // Card Validation
        if (this.selectedPayment === 'card') {
            if (!this.cardNumber || !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(this.cardNumber) && !/^\d{16}$/.test(this.cardNumber)) {
                this.showAlert('Please enter a valid 16-digit card number');
                return;
            }
            if (!this.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.cardExpiry)) {
                this.showAlert('Please enter a valid expiry date (MM/YY)');
                return;
            }
            // Simple check for future date
            const parts = this.cardExpiry.split('/');
            const expMonth = parseInt(parts[0], 10);
            const expYear = parseInt('20' + parts[1], 10);
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
            if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                this.showAlert('Card has expired');
                return;
            }
            if (!this.cardCvv || !/^\d{3}$/.test(this.cardCvv)) {
                this.showAlert('Please enter a valid 3-digit CVV');
                return;
            }
        }

        // UPI Validation
        if (this.selectedPayment === 'upi') {
            if (!this.upiId || !/^[\w.-]+@[\w.-]+$/.test(this.upiId)) {
                this.showAlert('Please enter a valid UPI ID (e.g., name@bank)');
                return;
            }
        }

        this.processing = true;

        await new Promise(resolve => setTimeout(resolve, 2000));

        // CRITICAL FIX: Save orders to database before clearing cart
        try {
            await this.cartService.placeOrder(this.cartItems, {
                fullName: this.fullName,
                address: this.address,
                city: this.city,
                zipCode: this.zipCode,
                phone: this.phone
            });
            console.log('Order successfully placed via Checkout');
        } catch (error) {
            console.error('Failed to place order:', error);
            // Optionally handle error here, but proceed for now as per logic flow
        }

        // Successfully placed, now clear cart
        // Note: placeOrder already clears items from cart in service logic, 
        // but we keep this loop for safety or if placeOrder fails partially.
        for (const item of this.cartItems) {
            try {
                await this.cartService.removeFromCart(item.id);
            } catch (e) {
                // Ignore if already deleted by placeOrder
            }
        }

        this.processing = false;
        this.showPaymentModal = false;
        this.showSuccessModal = true;
    }

    goHome() {
        this.router.navigate(['/']);
    }
    increaseQty(item: any) {
        const maxStock = item.stock || 999;
        const currentQty = item.quantity || 1;
        if (currentQty >= maxStock) {
            this.showAlert(`Only ${maxStock} items available in stock`);
            return;
        }
        item.quantity = currentQty + 1;
        this.updateTotal();
    }

    decreaseQty(item: any) {
        if ((item.quantity || 1) > 1) {
            item.quantity--;
            this.updateTotal();
        }
    }

    updateTotal() {
        this.totalPrice = this.cartItems.reduce((sum, item) => {
            return sum + Number(item.price) * (item.quantity || 1);
        }, 0);
    }

    private showAlert(message: string) {
        Swal.fire({
            title: '',
            text: message,
            icon: 'info',
            background: '#3e0703',
            color: '#f5e6c8',
            confirmButtonColor: '#3e0703',
            customClass: {
                popup: 'my-popup',
                confirmButton: 'my-confirm-btn'
            }
        });
    }
}