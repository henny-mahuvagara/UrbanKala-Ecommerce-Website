import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
    collection,
    collectionData,
    addDoc,
    deleteDoc,
    doc,
    Firestore,
    query,
    where,
    getDocs,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { authState } from '@angular/fire/auth';
import { switchMap, filter, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { orderBy } from '@angular/fire/firestore';
import { updateDoc } from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root',
})
export class CartService {
    private cartCollection;
    private orderCollection;

    constructor(private fireStore: Firestore, private auth: Auth, private injector: Injector) {
        this.cartCollection = collection(this.fireStore, 'cart');
        this.orderCollection = collection(this.fireStore, 'orders');
    }

    // =============================
    // Check if product is already in cart
    // =============================
    async isInCart(productId: string): Promise<boolean> {
        const user = this.auth.currentUser;
        if (!user) return false;

        const q = query(
            this.cartCollection,
            where('uid', '==', user.uid),
            where('productId', '==', productId)
        );
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    }

    // =============================
    // Add product to cart
    // =============================
    addToCart(product: any) {
        const user = this.auth.currentUser;
        if (!user) {
            return Promise.reject('Not logged in');
        }

        const cartItem = {
            uid: user.uid,
            productId: product.id,
            pname: product.pname,
            price: product.price,
            image: product.image,
            pdesc: product.pdesc || '',
            stock: product.stock || 0,
            addedAt: new Date().toISOString(),
        };

        return addDoc(this.cartCollection, cartItem);
    }

    // =============================
    // Get cart items for current user
    // =============================
    getCartItems(): Observable<any[]> {
        return runInInjectionContext(this.injector, () => authState(this.auth)).pipe(
            filter(user => user !== null),
            switchMap(user => {
                const q = query(
                    this.cartCollection,
                    where('uid', '==', user!.uid)
                );
                return runInInjectionContext(this.injector, () => collectionData(q, { idField: 'id' }));
            })
        );
    }

    // =============================
    // Remove item from cart
    // =============================
    removeFromCart(cartItemId: string) {
        const cartDoc = doc(this.fireStore, `cart/${cartItemId}`);
        return deleteDoc(cartDoc);
    }

    // =============================
    // PLACE ORDER (Move Cart Items to Orders)
    // =============================
    async placeOrder(cartItems: any[], shippingDetails: any) {
        const user = this.auth.currentUser;
        if (!user) return;

        console.log('Placing order for user:', user.uid);

        for (let item of cartItems) {
            await addDoc(this.orderCollection, {
                uid: user.uid,
                productId: item.productId,
                pname: item.pname,
                price: item.price,
                image: item.image,
                quantity: item.quantity || 1,
                total: item.price * (item.quantity || 1),
                status: 'Processing',
                orderedAt: new Date(), // Keeping Date object for easy toDate() call in template
                ...shippingDetails
            });

            await this.removeFromCart(item.id);
        }
    }
    // =============================
    // GET USER ORDERS
    // =============================
    getUserOrders(): Observable<any[]> {
        return runInInjectionContext(this.injector, () => authState(this.auth)).pipe(
            switchMap(user => {
                if (!user) {
                    console.log('No user logged in, returning empty orders');
                    return of([]);
                }

                console.log('Fetching orders for user:', user.uid);
                const q = query(
                    this.orderCollection,
                    where('uid', '==', user.uid)
                    // Removed orderBy to avoid index requirements for now
                );

                return runInInjectionContext(this.injector, () => collectionData(q, { idField: 'id' }));
            })
        );
    }

    //  UPDATE ORDER STATUS
    updateOrderStatus(orderId: string, status: string) {
        const orderDoc = doc(this.fireStore, `orders/${orderId}`);
        return updateDoc(orderDoc, { status });
    }


    cancelOrder(orderId: string) {
        const orderDoc = doc(this.fireStore, `orders/${orderId}`);
        return updateDoc(orderDoc, { status: 'Cancelled' });
    }
}