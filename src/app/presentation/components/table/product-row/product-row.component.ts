import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { NgIf } from '@angular/common';
@Component({
    selector: 'tr[app-product-row]',
  standalone: true,
  imports: [NgIf],
  templateUrl: './product-row.component.html',
  styleUrl: './product-row.component.css'
})
export class ProductRowComponent {
  @Input() product!: Product;
  @Input() open = false;

  @Output() menuToggle = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  toggleMenu(e: MouseEvent) {
    e.stopPropagation();
    this.menuToggle.emit();
  }

  onEdit() { this.edit.emit(this.product); }
  onDelete() { this.delete.emit(this.product); }
}
