import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { Product } from '../../../../core/models/product.model';
import { ProductRowComponent } from '../product-row/product-row.component';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [NgFor, ProductRowComponent],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {
 @Input() products: Product[] = [];
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();

  openMenuId: string | null = null;

  onMenuToggle(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  onEdit(p: Product) { this.editProduct.emit(p); this.openMenuId = null; }
  onDelete(p: Product) { this.deleteProduct.emit(p); this.openMenuId = null; }

  @HostListener('document:click')
  onOutsideClick() {
    this.openMenuId = null;
  }
}
