import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  collectionData,
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productCollection;
  constructor(private fireStore: Firestore, private injector: Injector) {
    this.productCollection = collection(this.fireStore, 'products');
  }

  addProduct(data: any) {
    return addDoc(this.productCollection, data);
  }

  getProducts() {
    return runInInjectionContext(this.injector, () => collectionData(this.productCollection, { idField: 'id' }));
  }

  delProducts(id: string) {
    const docRef = doc(this.fireStore, `products/${id}`);
    return deleteDoc(docRef);
  }

  updateProduct(id: string, data: any) {
    const productDoc = doc(this.fireStore, `products/${id}`);

    return updateDoc(productDoc, data);
  }

  getAllOrders(): Observable<any[]> {
    const ordersRef = collection(this.fireStore, 'orders');
    const q = query(ordersRef, orderBy('orderedAt', 'desc'));
    return runInInjectionContext(this.injector, () => collectionData(q, { idField: 'id' }));
  }

  updateOrderStatus(orderId: string, status: string) {
    const orderDoc = doc(this.fireStore, `orders/${orderId}`);
    return updateDoc(orderDoc, { status });
  }

  getInquiries(): Observable<any[]> {
    const inquiriesRef = collection(this.fireStore, 'inquiries');
    const q = query(inquiriesRef, orderBy('createdAt', 'desc'));
    return runInInjectionContext(this.injector, () => collectionData(q, { idField: 'id' }));
  }

  deleteInquiry(id: string) {
    const inquiryDoc = doc(this.fireStore, `inquiries/${id}`);
    return deleteDoc(inquiryDoc);
  }
}