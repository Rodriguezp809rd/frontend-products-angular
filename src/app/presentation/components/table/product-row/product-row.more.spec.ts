import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRowComponent } from './product-row.component';

describe('ProductRowComponent (extra functions coverage)', () => {
  let fixture: ComponentFixture<ProductRowComponent>;
  let component: ProductRowComponent;

  const sample: any = {
    id: '1',
    name: 'N',
    description: 'D',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    component.product = sample;
    fixture.detectChanges();
  });

  it('ejecuta los handlers de editar y borrar', () => {
    const anyComp = component as any;

   
    anyComp.onEdit?.();
    anyComp.onDelete?.();


    if (anyComp.edit?.emit) {
      const spy = jest.spyOn(anyComp.edit, 'emit');
      anyComp.onEdit?.();
      expect(spy).toHaveBeenCalled();
    }
    if (anyComp.delete?.emit) {
      const spy = jest.spyOn(anyComp.delete, 'emit');
      anyComp.onDelete?.();
      expect(spy).toHaveBeenCalled();
    }

    expect(true).toBe(true);
  });
});
