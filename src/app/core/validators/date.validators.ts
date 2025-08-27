import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


function toYMDLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}


function normalizeYMD(raw: unknown): string {
  if (!raw) return '';
  if (raw instanceof Date) return toYMDLocal(raw);
  const s = String(raw).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}


export function dateNotInPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueStr = normalizeYMD(control.value);
    if (!valueStr) return null; 

    const todayStr = toYMDLocal(new Date());
    return valueStr >= todayStr ? null : { pastDate: true };
  };
}


export function dateGreaterOrEqual(aCtrl: string, bCtrl: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(aCtrl)?.value;
    const b = group.get(bCtrl)?.value;
    const A = normalizeYMD(a);
    const B = normalizeYMD(b);
    if (!A || !B) return null;
    return B >= A ? null : { dateOrder: { [aCtrl]: A, [bCtrl]: B } };
  };
}
