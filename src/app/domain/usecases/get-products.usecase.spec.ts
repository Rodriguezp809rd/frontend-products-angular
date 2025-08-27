import { GetProducts } from '../../domain/usecases/get-products.usecase';
import { ProductRepository } from '../../domain/usecases/product.repository';

import { Product } from '../../core/models/product.model';

describe('GetProducts (use case)', () => {
  const sample: Product = {
    id: '1',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
  };

  function makeRepo(overrides: Partial<ProductRepository> = {}): ProductRepository {
    return {
      getProducts: jest.fn().mockResolvedValue([sample]),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      getProductById: jest.fn(),
      ...overrides,
    } as unknown as ProductRepository;
  }

  it('llama al repositorio con params y retorna su resultado', async () => {
    const repo = makeRepo();
    const uc = new GetProducts(repo);
    const params = { search: 'visa', page: 2, size: 5 };

    const res = await uc.exec(params);

    expect(repo.getProducts).toHaveBeenCalledWith(params);
    expect(res).toEqual([sample]);
  });

  it('funciona sin params (undefined)', async () => {
    const repo = makeRepo({ getProducts: jest.fn().mockResolvedValue([]) });
    const uc = new GetProducts(repo);

    const res = await uc.exec();

    expect(repo.getProducts).toHaveBeenCalledWith(undefined);
    expect(res).toEqual([]);
  });
});
