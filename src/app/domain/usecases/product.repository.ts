import { Product } from '../../core/models/product.model';

export abstract class ProductRepository {
  abstract getProducts(params?: { search?: string; page?: number; size?: number }): Promise<Product[]>;
  abstract createProduct(input: Product): Promise<Product>;
  abstract updateProduct(input: Product): Promise<Product>;
  abstract deleteProduct(id: string): Promise<void>;
}
