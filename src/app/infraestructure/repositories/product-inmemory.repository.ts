import { Injectable } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ProductRepository } from '../../domain/usecases/product.repository';

@Injectable({ providedIn: 'root' })
export class ProductInMemoryRepository implements ProductRepository {
  private data: Product[] = [
    {
      id: '1',
      name: 'Cuenta Ahorro Familiar',
      description: 'Producto de ahorro sin comisiones.',
      logo: 'CF',
      date_release: '01/01/2000',
      date_revision: '01/01/2001',
    },
    {
      id: '2',
      name: 'Préstamo Hipotecario',
      description: 'Financiamiento de vivienda a largo plazo.',
      logo: 'PH',
      date_release: '10/03/1999',
      date_revision: '12/08/2005',

    },
    {
      id: '3',
      name: 'Tarjeta Oro',
      description: 'Crédito premium con beneficios exclusivos.',
      logo: 'TO',
      date_release: '20/11/2005',
      date_revision: '10/10/2010',
    },
  ];

  async getProducts(params?: { search?: string; page?: number; size?: number }): Promise<Product[]> {
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    await delay(500);

    let list = [...this.data];
    if (params?.search) {
      const term = params.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    return list;
  }

  async createProduct(input: Product): Promise<Product> {
    this.data.push(input);
    return input;
  }

  async updateProduct(input: Product): Promise<Product> {
    const idx = this.data.findIndex(p => p.id === input.id);
    if (idx >= 0) this.data[idx] = input;
    return input;
  }

  async deleteProduct(id: string): Promise<void> {
    this.data = this.data.filter(p => p.id !== id);
  }
}
