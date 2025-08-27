// 👇 agrega esta línea
import { expect as jestExpect } from '@jest/globals';

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateComponent } from './create.component';
import { ProductApiRepository } from '../../../infraestructure/repositories/product-api.repository';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

describe('CreateComponent (crear)', () => {
  let repoSpy: { createProduct: jest.Mock; updateProduct: jest.Mock; getProductById: jest.Mock };

  beforeEach(async () => {
    repoSpy = {
      createProduct: jest.fn().mockReturnValue(of({})),
      updateProduct: jest.fn().mockReturnValue(of({})),
      getProductById: jest.fn().mockReturnValue(of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [CreateComponent],
      providers: [
        { provide: ProductApiRepository, useValue: repoSpy },
        { provide: Router, useValue: { navigateByUrl: jest.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            snapshot: { paramMap: convertToParamMap({}) },
          },
        },
      ],
    }).compileComponents();
  });

  it('submit crea producto cuando el form es válido', () => {
    const fixture = TestBed.createComponent(CreateComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    c.form.patchValue({
      id: 'PROD123',
      name: 'Visa Gold',
      description: 'Tarjeta de crédito premium con beneficios.',
      logo: 'https://example.com/logo.png',
      date_release: ymd(today),
      date_revision: ymd(tomorrow),
    });

  
    const idCtrl = c.form.get('id')!;
    idCtrl.clearAsyncValidators?.();
    idCtrl.updateValueAndValidity({ onlySelf: true });
    c.form.updateValueAndValidity();

    c.submit();

    expect(repoSpy.createProduct).toHaveBeenCalledWith(
      jestExpect.objectContaining({
        id: 'PROD123',
        name: 'Visa Gold',
      })
    );
  });
});

describe('CreateComponent (editar)', () => {
  let repoSpy: { createProduct: jest.Mock; updateProduct: jest.Mock; getProductById: jest.Mock };

  beforeEach(async () => {
    repoSpy = {
      createProduct: jest.fn().mockReturnValue(of({})),
      updateProduct: jest.fn().mockReturnValue(of({})),
      getProductById: jest.fn().mockReturnValue(
        of({
          id: 'P1',
          name: 'Visa',
          description: 'Tarjeta de crédito',
          logo: 'https://example.com/logo.png',
          date_release: ymd(new Date()),
          date_revision: ymd(new Date()),
        })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [CreateComponent],
      providers: [
        { provide: ProductApiRepository, useValue: repoSpy },
        { provide: Router, useValue: { navigateByUrl: jest.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'P1' })),
            snapshot: { paramMap: convertToParamMap({ id: 'P1' }) },
          },
        },
      ],
    }).compileComponents();
  });

  it('submit actualiza producto cuando isEdit=true', () => {
    const fixture = TestBed.createComponent(CreateComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();

    c.form.patchValue({ name: 'Visa GOLD' });
    c.submit();

    expect(repoSpy.updateProduct).toHaveBeenCalledWith(
      'P1',
      // 👇 alias de Jest otra vez
      jestExpect.objectContaining({ name: 'Visa GOLD' })
    );
  });
});
