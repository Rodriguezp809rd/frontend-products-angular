import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { NotificationService } from '../../core/ui/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let msg = 'Unexpected error. Please try again.';
      if (err.status === 0) msg = 'Network error. Check your connection.';
      else if (err.status === 400) msg = 'Bad request.';
      else if (err.status === 404) msg = 'Resource not found.';
      else if (err.status === 409) msg = 'Duplicate identifier.';
      else if (err.status >= 500) msg = 'Server error. Please try later.';
      notify.error(msg);
      return throwError(() => err);
    })
  );
};
