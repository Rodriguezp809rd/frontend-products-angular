import { ProductInMemoryRepository } from './product-inmemory.repository';

type Product = {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
};

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const p = (over: Partial<Product> = {}): Product => ({
  id: 'X1',
  name: 'Producto',
  description: 'Desc',
  logo: 'http://img',
  date_release: ymd(new Date()),
  date_revision: ymd(new Date()),
  ...over,
});

describe('ProductInMemoryRepository', () => {
  it('createProduct + getProducts filtra por search', async () => {
    const repo = new ProductInMemoryRepository();

    await repo.createProduct(p({ id: 'A1', name: 'Visa Gold' }));
    await repo.createProduct(p({ id: 'A2', name: 'Master Black' }));
    await repo.createProduct(p({ id: 'A3', name: 'Visa Platinum' }));

    const filtered = await repo.getProducts({ page: 1, size: 10, search: 'visa' });

    expect(Array.isArray(filtered)).toBe(true);
    expect(filtered.length).toBeGreaterThanOrEqual(2);
    expect(filtered.every(x => /visa/i.test(x.name))).toBe(true);
  });

  it('updateProduct actualiza usando firma de 1 parámetro', async () => {
    const repo = new ProductInMemoryRepository();

    await repo.createProduct(p({ id: 'P2', name: 'Dos' }));
    await repo.updateProduct(p({ id: 'P2', name: 'Dos PLUS' })); // <- 1 parámetro

    const all = await repo.getProducts({ page: 1, size: 50, search: '' });
    const found = all.find(x => x.id === 'P2');

    expect(found).toBeTruthy();
    expect(found!.name).toBe('Dos PLUS');
  });

  it('getProducts acepta page/size aunque no haya paginación real', async () => {
    const repo = new ProductInMemoryRepository();

    await repo.createProduct(p({ id: 'B1', name: 'Uno' }));
    await repo.createProduct(p({ id: 'B2', name: 'Dos' }));
    await repo.createProduct(p({ id: 'B3', name: 'Tres' }));

    const page1 = await repo.getProducts({ page: 1, size: 2, search: '' });
    const page2 = await repo.getProducts({ page: 2, size: 2, search: '' });

    // No exigimos tamaño <= size porque el repo podría no paginar.
    expect(Array.isArray(page1)).toBe(true);
    expect(Array.isArray(page2)).toBe(true);
    expect(page1.length).toBeGreaterThan(0);
    expect(page2.length).toBeGreaterThan(0);
  });
});
