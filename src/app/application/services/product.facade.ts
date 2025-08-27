import { Inject, Injectable } from '@angular/core';
import { PRODUCT_REPOSITORY } from '../../core/tokens/product.repository.token';
import { ProductRepository } from '../../domain/usecases/product.repository';
import { GetProducts } from '../../domain/usecases/get-products.usecase';
import { Product } from '../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  constructor(@Inject(PRODUCT_REPOSITORY) private repo: ProductRepository) {}

  getProducts(params?: { search?: string; page?: number; size?: number }): Promise<Product[]> {
    return new GetProducts(this.repo).exec(params);
  }

  createProduct(input: Product) { return this.repo.createProduct(input); }
  updateProduct(input: Product) { return this.repo.updateProduct(input); }
  deleteProduct(id: string) { return this.repo.deleteProduct(id); }
}
