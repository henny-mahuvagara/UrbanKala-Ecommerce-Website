import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent {
  private firestore = inject(Firestore);

  inquiry = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  async submitInquiry() {
    if (!this.inquiry.name || !this.inquiry.email || !this.inquiry.subject || !this.inquiry.message) {
      this.errorMessage = 'Please fill out all fields.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      const inquiriesRef = collection(this.firestore, 'inquiries');
      await addDoc(inquiriesRef, {
        ...this.inquiry,
        createdAt: new Date().toISOString()
      });

      this.successMessage = 'Your message has been elegantly crafted and sent! We will connect soon.';
      this.inquiry = { name: '', email: '', subject: '', message: '' };

      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      this.errorMessage = 'An error occurred while sending your digital letter. Please try again.';
      setTimeout(() => this.errorMessage = '', 3000);
    } finally {
      this.isSubmitting = false;
    }
  }
}
