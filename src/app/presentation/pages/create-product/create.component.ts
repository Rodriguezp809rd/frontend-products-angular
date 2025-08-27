import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { ProductApiRepository } from '../../../infraestructure/repositories/product-api.repository';
import { finalize, map, of, switchMap, timer } from 'rxjs';
import { dateNotInPastValidator } from '../../../core/validators/date.validators';
import { NotificationService } from '../../../core/ui/notification.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  isEdit = false;
  productId: string | null = null;
  todayISO = this.toISO(new Date());
  isSubmitting = false;
  constructor(
    private fb: FormBuilder,
    private repo: ProductApiRepository,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
  ) {}

  
  form = this.fb.group({
    id: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{3,30}$/)],
      asyncValidators: [],
      updateOn: 'blur'
    }),
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|svg|webp|gif))(?:\?.*)?$/i),
      ],
    ],
    date_release: ['', [Validators.required, dateNotInPastValidator()]],
    date_revision: [{ value: '', disabled: true }, [Validators.required]],
  });

  get f() { return this.form.controls; }
  showError(name: keyof typeof this.form.controls) {
    const c = this.form.get(name as string)!;
    return c.invalid && (c.dirty || c.touched);
  }

  ngOnInit() {
    
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      this.isEdit = !!id;
      this.productId = id;

      if (this.isEdit && id) {
        this.loadProduct(id);
        this.form.get('id')!.disable();
      } else {
       
        this.form.get('id')!.addAsyncValidators(this.idExistsValidator());
        this.form.get('id')!.updateValueAndValidity();
      }
    });

    this.form.get('date_release')!.valueChanges.subscribe((value) => {
      const next = this.computeNextYearISO(value);
      this.form.get('date_revision')!.setValue(next);
    });
  }

  private loadProduct(id: string) {
    this.repo.getProductById(id).subscribe({
      next: (p) => {
        const releaseISO = p.date_release?.split('T')[0] ?? p.date_release;
        const revisionISO = p.date_revision?.split('T')[0] ?? p.date_revision;

        this.form.patchValue({
          id: p.id,
          name: p.name,
          description: p.description,
          logo: p.logo,
          date_release: releaseISO,
          date_revision: revisionISO,
        });
      },
      error: () => {
        alert('No se pudo cargar el producto');
        this.router.navigateByUrl('/');
      }
    });
  }

  private idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value || '').trim();
      if (!value) return of(null);
      return timer(300).pipe(
        switchMap(() => this.repo.verifyId(value)),
        map(exists => (exists ? { idTaken: true } : null))
      );
    };
  }

  private computeNextYearISO(dateStr: string | null): string {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const release = new Date(y, m - 1, d);
    const revision = new Date(release);
    revision.setFullYear(revision.getFullYear() + 1);
    return this.toISO(revision);
  }

  private toISO(d: Date): string {
 const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  }

  resetForm() {
    if (this.isEdit) {
      this.productId && this.loadProduct(this.productId);
    } else {
      this.form.reset({
        id: '',
        name: '',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      });
    }
  }

 submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const raw = this.form.getRawValue();
  const payload: Product = {
    id: this.isEdit ? this.productId! : raw.id!,
    name: raw.name!,
    description: raw.description!,
    logo: raw.logo!,
    date_release: raw.date_release!,
    date_revision: raw.date_revision!,
  };

  this.isSubmitting = true;

  const req$ = this.isEdit
    ? this.repo.updateProduct(this.productId!, payload)
    : this.repo.createProduct(payload);

  req$
    .pipe(finalize(() => (this.isSubmitting = false)))
    .subscribe({
      next: () => {
        this.notify.success(this.isEdit ? 'Producto actualizado' : 'Producto creado');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
      },
    });
 }
}
