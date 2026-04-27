import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../component/footer/footer.component';
import { ProductService } from '../../services/product.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-home',
  imports: [FooterComponent, NgForOf, RouterLink, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  constructor(
    private prservice: ProductService,private authService: AuthService) { }

  isLoggedIn: boolean = false;
  ngOnInit() {
  this.prservice.getProducts().subscribe((data: any) => {
    this.products = data.slice(0,4);
    console.log(this.products);
  });+

  this.authService.currentUser$.subscribe(user => {
    this.isUserLoggedInState = !!user; // Update the logged-in state based on the user object
  });
}
isUserLoggedInState:boolean=false;

 get isUserLoggedIn(): boolean {
    return this.isUserLoggedInState;
  }
}
