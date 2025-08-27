// src/app/application/services/product.facade.spec.ts
import { TestBed } from '@angular/core/testing';
import { ProductFacade } from './product.facade';
import { PRODUCT_REPOSITORY } from '../../core/tokens/product.repository.token';
import { Product } from '../../core/models/product.model';

describe('ProductFacade', () => {
  const base: Product = {
    id: '1',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
  };

  const repo = {
    getProducts: jest.fn().mockResolvedValue([base]),
    createProduct: jest.fn().mockResolvedValue({ ...base, id: 'X' }),
    updateProduct: jest.fn().mockResolvedValue({ ...base, name: 'UPD' }),
    deleteProduct: jest.fn().mockResolvedValue(undefined),
  };

  let facade: ProductFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductFacade,
        { provide: PRODUCT_REPOSITORY, useValue: repo },
      ],
    });
    jest.clearAllMocks();
    facade = TestBed.inject(ProductFacade);
  });

  it('delegates getProducts al repositorio', async () => {
    const params = { search: 'visa', page: 1, size: 10 };
    const res = await facade.getProducts(params);
    expect(repo.getProducts).toHaveBeenCalledWith(params);
    expect(res).toEqual([base]);
  });

  it('delegates createProduct al repositorio', async () => {
    const prod: Product = { ...base, id: 'X' };
    const res = await facade.createProduct(prod);
    expect(repo.createProduct).toHaveBeenCalledWith(prod);
    expect(res).toEqual({ ...base, id: 'X' });
  });

  it('delegates updateProduct al repositorio', async () => {
    const prod: Product = { ...base, name: 'UPD' };
    const res = await facade.updateProduct(prod);
    expect(repo.updateProduct).toHaveBeenCalledWith(prod);
    expect(res).toEqual({ ...base, name: 'UPD' });
  });

  it('delegates deleteProduct al repositorio', async () => {
    await facade.deleteProduct('1');
    expect(repo.deleteProduct).toHaveBeenCalledWith('1');
  });
});
