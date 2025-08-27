import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonRowComponent } from './skeleton-row.component';

describe('SkeletonRowComponent', () => {
  let component: SkeletonRowComponent;
  let fixture: ComponentFixture<SkeletonRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkeletonRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
