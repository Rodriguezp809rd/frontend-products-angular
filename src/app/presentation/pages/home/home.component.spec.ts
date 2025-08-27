import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { ProductApiRepository } from '../../../infraestructure/repositories/product-api.repository';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/ui/notification.service';

const apiPage = (n = 1) => ({ data: [], total: 0, currentPage: n, totalPages: 3 });

describe('HomeComponent', () => {
  let repoSpy: { getProducts: jest.Mock; deleteProduct: jest.Mock };
  let notifySpy: { success: jest.Mock; error: jest.Mock; info: jest.Mock; warning: jest.Mock };

  beforeEach(async () => {
    repoSpy = {
      getProducts: jest.fn().mockReturnValue(of(apiPage(1))),
      deleteProduct: jest.fn().mockReturnValue(of({})),
    };
    notifySpy = { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ProductApiRepository, useValue: repoSpy },
        { provide: NotificationService, useValue: notifySpy },
        { provide: Router, useValue: { navigate: () => {}, navigateByUrl: () => {} } },
      ],
    }).compileComponents();
  });

  function makeComp() {
    const fixture = TestBed.createComponent(HomeComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, c };
  }

  it('should create', () => {
    const { c } = makeComp();
    expect(c).toBeTruthy();
  });

it('onSearchChange no rompe y acepta cadenas', () => {
  const { c } = makeComp();
  expect(() => c.onSearchChange('visa')).not.toThrow();
});


  it('onItemsPerPageChange desde number resetea página y recarga', () => {
    const { c } = makeComp();
    repoSpy.getProducts.mockClear();
    c.onItemsPerPageChange(20 as any);
    expect(c.itemsPerPage).toBe(20);
    expect(c.currentPage).toBe(1);
    expect(repoSpy.getProducts).toHaveBeenCalled();
  });

  it('onItemsPerPageChange desde Event', () => {
    const { c } = makeComp();
    const evt = { target: { value: '15' } } as any as Event;
    c.onItemsPerPageChange(evt);
    expect(c.itemsPerPage).toBe(15);
  });

  it('onPageChange fuera de rango NO recarga', () => {
    const { c } = makeComp();
    repoSpy.getProducts.mockClear();
    c.totalPages = 2;
    c.onPageChange(3);
    expect(repoSpy.getProducts).not.toHaveBeenCalled();
  });

  it('onPageChange válido recarga', () => {
    const { c } = makeComp();
    repoSpy.getProducts.mockClear();
    c.totalPages = 3;
    c.onPageChange(2);
    expect(c.currentPage).toBe(2);
    expect(repoSpy.getProducts).toHaveBeenCalled();
  });

  it('onDeleteClick y onConfirmDelete retroceden si era el último', () => {
    const { c } = makeComp();
    c.products = [{
      id:'X', name:'N', description:'', logo:'',
      date_release:'2025-01-01', date_revision:'2026-01-01'
    } as any];
    c.currentPage = 2;

    c.onDeleteClick(c.products[0] as any);
    expect(c.showDeleteModal).toBe(true);

    c.onConfirmDelete();
    expect(repoSpy.deleteProduct).toHaveBeenCalledWith('X');
    expect(c.currentPage).toBe(1);
    expect(repoSpy.getProducts).toHaveBeenCalled();
  });
});