import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addproduct',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css',
})
export class AddproductComponent implements OnInit {
  selectedFile!: File;
  imageurl = '';
  products: any[] = [];
  editId = '';

  constructor(private productService: ProductService) { }

  product = new FormGroup({
    pname: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    pdesc: new FormControl('', Validators.required),
    about: new FormControl(''),
    care: new FormControl('', Validators.required),
    category: new FormControl('wooden', Validators.required),
    stock: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  // ✅ when file selected
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // ✅ upload to cloudinary
  uploadImage() {
    const data = new FormData();

    data.append('file', this.selectedFile);
    data.append('upload_preset', 'eox6aglb');

    return fetch('https://api.cloudinary.com/v1_1/do6jfda9k/image/upload', {
      method: 'POST',
      body: data,
    }).then((res) => res.json());
  }

  // ✅ SAVE PRODUCT (UPDATED)
  async saveProduct() {
    if (this.product.invalid) {
      this.product.markAllAsTouched();
      return;
    }

    let imageUrlToSave = this.imageurl;

    // ✅ upload image ONLY if new image selected
    if (this.selectedFile) {

      const result = await this.uploadImage();
      imageUrlToSave = result.secure_url;
    }

    // combine form data + image
    const productData = {
      ...this.product.value,
      image: imageUrlToSave,
    };

    // ✅ UPDATE mode
    if (this.editId) {

      await this.productService.updateProduct(this.editId, productData);

      alert('Product Updated');

      this.editId = '';

    } else {

      // ✅ ADD mode
      await this.productService.addProduct(productData);

      alert('Product Added');

    }

    this.product.reset({
      pname: '',
      price: '',
      pdesc: '',
      about: '',
      care: '',
      category: 'wooden',
      stock: 0
    });

  }


  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
      this.sanitizeProductData(data);
    });
  }

  // ✅ Temporary helper to fix any 'null' names/descriptions that break the client side
  async sanitizeProductData(products: any[]) {
    for (const p of products) {
      if (p.pname === null || p.pname === undefined) {
        await this.productService.updateProduct(p.id, { pname: 'New Artisan Piece' });
        console.log(`Healed product ${p.id}: fixed null pname`);
      }
      if (p.pdesc === null || p.pdesc === undefined) {
        await this.productService.updateProduct(p.id, { pdesc: 'Handcrafted with love.' });
      }
    }
  }

  // ✅ AUTO-ASSIGN CATEGORIES to existing Firebase products
  async autoAssignCategoriesToOldProducts() {
    const allowedCategories = ['wooden', 'saree', 'footwear', 'lamp', 'homedecore'];
    for (let i = 0; i < this.products.length; i++) {
      const p = this.products[i];
      if (!p.category || !allowedCategories.includes(p.category.toLowerCase())) {
        const newCat = allowedCategories[i % allowedCategories.length];
        await this.productService.updateProduct(p.id, { category: newCat });
      }
    }
    alert('Categories have been successfully updated and saved for all old products!');
  }

  deleteProduct(id: string) {
    this.productService.delProducts(id);
  }

  editProduct(product: any) {

    this.editId = product.id;

    this.imageurl = product.image;

    this.product.patchValue({
      pname: product.pname,
      price: product.price,
      pdesc: product.pdesc,
      about: product.about,
      care: product.care,
      category: product.category || 'wooden',
      stock: product.stock || 0
    });

  }


}
