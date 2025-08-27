import { FormControl, FormGroup } from '@angular/forms';
import { dateNotInPastValidator, dateGreaterOrEqual } from './date.validators';

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

describe('date validators', () => {
  it('dateNotInPastValidator permite hoy', () => {
    const c = new FormControl(ymd(new Date()));
    expect(dateNotInPastValidator()(c)).toBeNull();
  });

  it('dateNotInPastValidator bloquea pasado', () => {
    const past = new Date(); past.setDate(past.getDate() - 1);
    const c = new FormControl(ymd(past));
    expect(dateNotInPastValidator()(c)).toEqual({ pastDate: true });
  });

  it('dateGreaterOrEqual OK cuando revision >= release', () => {
    const today = new Date();
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    const form = new FormGroup({
      date_release: new FormControl(ymd(today)),
      date_revision: new FormControl(ymd(tomorrow)),
    }, { validators: [dateGreaterOrEqual('date_release','date_revision')] });
    expect(form.errors).toBeNull();
  });

  it('dateGreaterOrEqual error cuando revision < release', () => {
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    const form = new FormGroup({
      date_release: new FormControl(ymd(today)),
      date_revision: new FormControl(ymd(yesterday)),
    }, { validators: [dateGreaterOrEqual('date_release','date_revision')] });
    expect(form.errors).toEqual({
      dateOrder: { date_release: ymd(today), date_revision: ymd(yesterday) }
    });
  });
});
