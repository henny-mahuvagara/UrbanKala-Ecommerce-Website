import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [NgForOf, NgIf, RouterLink, NgClass],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  searchQuery: string = '';
  sortBy: string = 'featured';

  constructor(private pser: ProductService) { }

  ngOnInit() {
    this.pser.getProducts().subscribe((data: any) => {
      const allowedCategories = ['wooden', 'saree', 'footwear', 'lamp', 'homedecore', 'kitchen appliances', 'idols'];

      this.products = data.map((p: any, index: number) => ({
        ...p,
        isNew: Math.random() > 0.85,
        // Assign a category deterministically based on index so it doesn't jump around, if it doesn't already have a valid one
        category: (p.category && allowedCategories.includes(p.category.toLowerCase())) ?
          p.category.toLowerCase() :
          allowedCategories[index % allowedCategories.length]
      }));

      // Set specific categories as requested by the user
      this.categories = ['All', 'wooden', 'saree', 'footwear', 'lamp', 'homedecore', 'kitchen appliances', 'idols'];

      this.applyFilters();
    });
  }

  searchProducts(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  sortProducts(criteria: string) {
    this.sortBy = criteria;
    this.applyFilters();
  }

  applyFilters() {
    let result = this.products.filter(p => {
      const productName = p.pname ? p.pname.toLowerCase() : '';
      const productDesc = p.pdesc ? p.pdesc.toLowerCase() : '';
      const matchesSearch = productName.includes(this.searchQuery) || productDesc.includes(this.searchQuery);
      const matchesCategory = this.selectedCategory === 'All' || p.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply Sorting
    switch (this.sortBy) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'nameAZ':
        result.sort((a, b) => (a.pname || '').localeCompare(b.pname || ''));
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    this.filteredProducts = result;
  }
}
