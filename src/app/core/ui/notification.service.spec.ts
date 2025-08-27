import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  it('emite success', (done) => {
    const svc = new NotificationService();
    svc.messages$.subscribe(t => {
      expect(t.type).toBe('success');
      expect(t.text).toBe('ok');
      done();
    });
    svc.success('ok');
  });

  it('emite error, info y warning', () => {
    const svc = new NotificationService();
    const types: string[] = [];
    const texts: string[] = [];
    const sub = svc.messages$.subscribe(t => { types.push(t.type); texts.push(t.text); });

    svc.error('e'); svc.info('i'); svc.warning('w');

    expect(types).toEqual(['error','info','warning']);
    expect(texts).toEqual(['e','i','w']);
    sub.unsubscribe();
  });
});
