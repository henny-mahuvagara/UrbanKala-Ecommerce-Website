import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';

@Component({
    selector: 'app-inquiries',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './inquiries.component.html',
    styleUrl: './inquiries.component.css'
})
export class InquiriesComponent implements OnInit {
    inquiries: any[] = [];
    isLoading = true;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.productService.getInquiries().subscribe({
            next: (data) => {
                this.inquiries = data;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error fetching inquiries:', error);
                this.isLoading = false;
            }
        });
    }

    deleteInquiry(id: string): void {
        if (confirm('Are you sure you want to delete this inquiry?')) {
            this.productService.deleteInquiry(id).then(() => {
                console.log('Inquiry deleted successfully');
            }).catch(error => {
                console.error('Error deleting inquiry:', error);
            });
        }
    }
}
