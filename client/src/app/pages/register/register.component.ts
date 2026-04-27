import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  errorMsg = '';

  constructor(
    private authser: AuthService,
    private router: Router
  ) { }

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  async register() {

    try {

      const email = this.registerForm.value.email!;
      const password = this.registerForm.value.password!;

      const credential = await this.authser.register(email, password);
      await this.authser.saveUser(credential.user);

      alert('Registration successful');

      // ✅ redirect after register
      this.router.navigate(['/login']);

    } catch (error: any) {

      this.errorMsg = error.message;

    }

  }

}
