import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
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

  getProducts() {
    return runInInjectionContext(this.injector, () => 
      collectionData(this.productCollection, { idField: 'id' })
    );
  }

  getSingleProduct(id: string) {
    const prodDoc = doc(this.fireStore, `products/${id}`);
    return runInInjectionContext(this.injector, () => 
      docData(prodDoc, { idField: 'id' })
    );
  }
}
