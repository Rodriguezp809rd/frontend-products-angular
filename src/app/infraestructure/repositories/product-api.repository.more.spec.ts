import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductApiRepository } from './product-api.repository';
import { Product } from '../../core/models/product.model';

describe('ProductApiRepository (extra coverage)', () => {
  let repo: ProductApiRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductApiRepository],
    });

    repo = TestBed.inject(ProductApiRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const id = '1';
  const baseProduct: any = {
    id,
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
  };

  it('updateProduct hace PUT con id y partial y devuelve data', (done) => {
    const partial: any = { name: 'UPD' };

    repo.updateProduct(id, partial).subscribe((res: any) => {
      expect(res).toBeTruthy();
      expect(res.data.id).toBe(id);
      expect(res.data.name).toBe('UPD');
      done();
    });

    const req = httpMock.expectOne(
      (r) => r.method === 'PUT' && r.url.includes(id)
    );
    expect(req.request.body).toEqual(partial);
    req.flush({ message: 'updated', data: { ...baseProduct, ...partial } });
  });

  it('deleteProduct hace DELETE y devuelve message', (done) => {
    repo.deleteProduct(id).subscribe((res: any) => {
      expect(res).toEqual({ message: 'deleted' });
      done();
    });

    const req = httpMock.expectOne(
      (r) => r.method === 'DELETE' && r.url.includes(id)
    );
    req.flush({ message: 'deleted' });
  });

  it('getProductById hace GET y devuelve el producto', (done) => {
    repo.getProductById(id).subscribe((res: any) => {
      expect(res.id).toBe(id);
      done();
    });

    const req = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url.includes(id)
    );
    req.flush({ ...baseProduct });
  });
});
