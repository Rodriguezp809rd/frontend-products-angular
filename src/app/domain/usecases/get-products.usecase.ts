import { ProductRepository } from './product.repository';
import { Product } from '../../core/models/product.model';

export class GetProducts {
  constructor(private repo: ProductRepository) {}
  exec(params?: { search?: string; page?: number; size?: number }): Promise<Product[]> {
    return this.repo.getProducts(params);
  }
}
