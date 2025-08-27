import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ProductApiRepository } from './product-api.repository';
import { Product } from '../../core/models/product.model';

describe('ProductApiRepository', () => {
  let http: { get: jest.Mock; post: jest.Mock; put: jest.Mock; delete: jest.Mock };
  let repo: ProductApiRepository;

  beforeEach(() => {
    http = { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() };
    repo = new ProductApiRepository(http as unknown as HttpClient);
  });

  it('getProducts envía page/limit/search (trim)', () => {
    http.get.mockReturnValue(of({ data: [], total: 0, currentPage: 1, totalPages: 1 }));
    repo.getProducts({ page: 2, limit: 20, search: ' visa ' }).subscribe();
    const [, options] = http.get.mock.calls[0];
    const params = String(options.params);
    expect(params).toContain('page=2');
    expect(params).toContain('limit=20');
    expect(params).toContain('search=visa');
  });

  it('getProducts no envía search vacío', () => {
  http.get.mockReturnValue(of({ data: [], total: 0, currentPage: 1, totalPages: 1 }));
  repo.getProducts({ page: 1, limit: 10, search: '' }).subscribe();
  const [, options] = http.get.mock.calls[0];   // <-- era [1]
  expect(String(options.params)).toBe('page=1&limit=10');
});



  it('getProductById hace GET /:id', () => {
    http.get.mockReturnValue(of({}));
    repo.getProductById('P1').subscribe();
    const [url] = http.get.mock.calls.pop();
    expect(url).toMatch(/\/products\/P1$/);
  });

  it('createProduct hace POST /products', () => {
    http.post.mockReturnValue(of({}));
    const p = { id:'P1', name:'N', description:'', logo:'x', date_release:'2025-01-01', date_revision:'2026-01-01' } as Product;
    repo.createProduct(p).subscribe();
    const [url, body] = http.post.mock.calls[0];
    expect(url).toMatch(/\/products$/);
    expect(body).toEqual(p);
  });

  it('updateProduct hace PUT /:id', () => {
    http.put.mockReturnValue(of({}));
    const p = { id:'P1', name:'N', description:'', logo:'x', date_release:'2025-01-01', date_revision:'2026-01-01' } as Product;
    repo.updateProduct('P1', p).subscribe();
    const [url, body] = http.put.mock.calls[0];
    expect(url).toMatch(/\/products\/P1$/);
    expect(body).toEqual(p);
  });

  it('deleteProduct hace DELETE /:id', () => {
    http.delete.mockReturnValue(of({}));
    repo.deleteProduct('P1').subscribe();
    const [url] = http.delete.mock.calls[0];
    expect(url).toMatch(/\/products\/P1$/);
  });
});
