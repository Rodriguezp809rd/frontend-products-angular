import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { PRODUCT_REPOSITORY } from './app/core/tokens/product.repository.token';
import { ProductInMemoryRepository } from './app/infraestructure/repositories/product-inmemory.repository';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    { provide: PRODUCT_REPOSITORY, useExisting: ProductInMemoryRepository }
  ],
}).catch(err => console.error(err));
