import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  mobileMenuOpen = false;
  dropdownOpen = false;

  constructor(public authService: AuthService, private router: Router) { }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  async logout() {
    await this.authService.logout();
    this.dropdownOpen = false;
    this.router.navigate(['/login']);
  }
}
