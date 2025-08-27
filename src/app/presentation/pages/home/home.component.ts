import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Product } from '../../../core/models/product.model';
import { ProductApiRepository } from '../../../infraestructure/repositories/product-api.repository';

import { SearchInputComponent } from '../../components/ui/search-input/search-input.component';
import { PaginationSelectComponent } from '../../components/ui/pagination-select/pagination-select.component';
import { PaginationButtonsComponent } from '../../components/ui/pagination-buttons/pagination-buttons.component';
import { ProductTableComponent } from '../../components/table/product-table/product-table.component';
import { SkeletonRowComponent } from '../../components/table/skeleton-row/skeleton-row.component';
import { ConfirmationModalComponent } from '../../components/ui/confirmation-modal/confirmation-modal.component';
import { NotificationService } from '../../../core/ui/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    SearchInputComponent, PaginationSelectComponent, PaginationButtonsComponent,
    ProductTableComponent, SkeletonRowComponent, ConfirmationModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {

  products: Product[] = [];
  searchTerm = '';

  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;

  isLoading = false;
  errorMessage = '';
  showDeleteModal = false;
  deleting = false;
  productToDelete: Product | null = null;

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private productRepo: ProductApiRepository, private router: Router,private notify: NotificationService ) {}

  ngOnInit() {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(term => {
        this.searchTerm = term;
        this.currentPage = 1;
        this.fetchProducts();
      });

    this.fetchProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
        
    this.productRepo.getProducts({
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchTerm?.trim() ? this.searchTerm.trim() : undefined,
    })
      .subscribe({
        next: (res) => {
          this.products = res.data ?? [];
          this.totalPages = res.totalPages ?? 1;
          this.totalResults = res.total ?? this.products.length;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Error loading products.';
          this.isLoading = false;
        },
      });
  }

  onSearchChange(term: string) {
    this.search$.next(term);
  }

  onItemsPerPageChange(e: number | Event) {
    const limit =
      typeof e === 'number'
        ? e
        : Number((e as any)?.target?.value);

    if (!Number.isFinite(limit) || limit <= 0) return;

    this.itemsPerPage = limit;
    this.currentPage = 1;
    this.fetchProducts();
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchProducts();
  }

  onEditProduct(product: Product) {
    this.router.navigate(['/edit', product.id]);
  }

  onDeleteClick(product: Product) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  onConfirmDelete() {
     if (!this.productToDelete || this.deleting) return;
    this.deleting = true;

    this.productRepo.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        
        if (this.products.length === 1 && this.currentPage > 1) this.currentPage--;

        this.deleting = false;
        this.showDeleteModal = false;
        this.productToDelete = null;

        this.fetchProducts();
        this.notify.success('Producto eliminado correctamente');
      },
      error: () => {
        this.deleting = false;
        this.showDeleteModal = false;
        this.productToDelete = null;
      },
    });
  }

  onCancelDelete() {
    if (this.deleting) return;
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  get resultsLabel(): string {
    const n = this.totalResults || 0;
    return `${n} resultado${n === 1 ? '' : 's'}`;
  }
}
