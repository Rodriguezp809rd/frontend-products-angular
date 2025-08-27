import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  QueryParam,
  NotFoundError,
  BadRequestError,
} from "routing-controllers";
import { ProductDTO } from "../dto/Product";
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";
import { productStore } from "../data/productStore";

@JsonController("/products")
export class ProductController {
  
 @Get('')
  getAll(
    @QueryParam('page') page?: number,
    @QueryParam('limit') limit?: number,
    @QueryParam('search') search?: string
  ) {
    // Debug útil
    console.log('[GET /products]', { page, limit, search, storeLen: productStore.length });

    const currentPage = Number.isFinite(page as any) && Number(page) > 0 ? Number(page) : 1;
    const pageSize    = Number.isFinite(limit as any) && Number(limit) > 0 ? Number(limit) : 10;

    // Normalizador compatible (sin \p{Diacritic})
    const normalize = (v: unknown) =>
      String(v ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    // Sanitiza search: evita 'undefined'/'null' como texto
    const raw = (search ?? '').toString().trim();
    const q   = raw === 'undefined' || raw === 'null' ? '' : raw;

    // Fuente
    const all = [...productStore];

    // Filtro
    const filtered = q
      ? all.filter(p => {
          const needle = normalize(q);
          return (
            normalize(p.id).includes(needle) ||
            normalize(p.name).includes(needle) ||
            normalize(p.description).includes(needle)
          );
        })
      : all;

    // Orden (más reciente primero). Fallback si no hay createdAt.
    const sorted = filtered.sort((a, b) => {
      const aTs = a?.createdAt
        ? new Date(a.createdAt).getTime()
        : a?.date_release ? new Date(a.date_release).getTime() : 0;
      const bTs = b?.createdAt
        ? new Date(b.createdAt).getTime()
        : b?.date_release ? new Date(b.date_release).getTime() : 0;
      return bTs - aTs;
    });

    // Paginación
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const data = sorted.slice(startIndex, startIndex + pageSize);

    return { data, total, currentPage, totalPages };
  }




 @Get('/verification/:id')
verifyIdentifier(@Param('id') id: number | string) {
  return productStore.some(p => String(p.id) === String(id));
}


  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const index = this.findIndex(id);
    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return productStore[index];
  }

  @Post("")
createItem(@Body({ validate: true }) productItem: ProductDTO) {
  const index = this.findIndex(productItem.id);
  if (index !== -1) {
    throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
  }

  const productWithTimestamp = {
    ...productItem,
    createdAt: new Date().toISOString(),
  };

  productStore.push(productWithTimestamp);

  return {
    message: "Product added successfully",
    data: productWithTimestamp,
  };
}


  @Put("/:id")
  put(
    @Param("id") id: number | string,
    @Body() productItem: ProductInterface
  ) {
    const index = this.findIndex(id);
    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    productStore[index] = {
      ...productStore[index],
      ...productItem,
    };

    return {
      message: "Product updated successfully",
      data: productStore[index],
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const index = this.findIndex(id);
    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    productStore.splice(index, 1);

    return {
      message: "Product removed successfully",
    };
  }

  private findIndex(id: number | string) {
    return productStore.findIndex((product) => product.id === id);
  }
}
