import {
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { httpErrorInterceptor } from './http-error.interceptor';
import { NotificationService } from '../../core/ui/notification.service';

// Helpers "next" para el interceptor funcional
const nextOk: HttpHandlerFn = (_req: HttpRequest<unknown>) =>
  of(new HttpResponse({ status: 200, body: { ok: true } }));

const nextError = (status: number): HttpHandlerFn =>
  (req: HttpRequest<unknown>) =>
    throwError(() => new HttpErrorResponse({
      status,
      statusText: 'ERROR',
      url: req.url,
    }));

describe('httpErrorInterceptor (funcional, con inyección)', () => {
  const notifyMock = {
    error: jest.fn<void, [string]>(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: notifyMock },
      ],
    });
    jest.clearAllMocks();
  });

  it('propaga el error y notifica el mensaje correcto según status', (done) => {
    const cases: Array<{ status: number; msg: string }> = [
      { status: 0,   msg: 'Network error. Check your connection.' },
      { status: 400, msg: 'Bad request.' },
      { status: 404, msg: 'Resource not found.' },
      { status: 409, msg: 'Duplicate identifier.' },
      { status: 500, msg: 'Server error. Please try later.' },
    ];

    let processed = 0;

    for (const { status, msg } of cases) {
      const req = new HttpRequest('GET', `/boom-${status}`);

      TestBed.runInInjectionContext(() => {
        httpErrorInterceptor(req, nextError(status)).subscribe({
          next: () => fail('Debe ir por error'),
          error: (err: unknown) => {
            expect(err).toBeInstanceOf(HttpErrorResponse);
            expect(notifyMock.error).toHaveBeenCalledWith(msg);
            processed++;
            if (processed === cases.length) done();
          },
        });
      });
    }
  });

  it('deja pasar respuestas OK sin notificar', (done) => {
    const req = new HttpRequest('GET', '/ok');

    TestBed.runInInjectionContext(() => {
      httpErrorInterceptor(req, nextOk).subscribe({
        next: (ev: HttpEvent<unknown>) => {
          if (ev instanceof HttpResponse) {
            expect(ev.status).toBe(200);
            expect(notifyMock.error).not.toHaveBeenCalled();
            done();
          }
        },
        error: done,
      });
    });
  });
});
