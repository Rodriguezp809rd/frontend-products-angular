import { ProductInterface } from '../interfaces/product.interface';


export let productStore: ProductInterface[] = loadSeedIfEmpty();

function loadSeedIfEmpty(): ProductInterface[] {
  try {
  
    const seed = require('./seed.json') as ProductInterface[];
    if (Array.isArray(seed) && seed.length > 0) {
      return seed.map(p => ({
        ...p,
        createdAt: p.createdAt ?? new Date(p.date_release ?? Date.now()).toISOString()
      }));
    }
  } catch { }
  return [];
}
