import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  errorMessage = '';

  constructor(private authser: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  async login() {

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    try {

      const credential = await this.authser.login(email, password);
      await this.authser.syncUser(credential.user);

      alert('Login successful');

      this.router.navigate(['/']);

    } catch (error: any) {

      console.log(error);

      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'User not found';
      }
      else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Incorrect password';
      }
      else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'Invalid email format';
      }
      else {
        this.errorMessage = 'Login failed. Try again.';
      }
    }
  }
}
