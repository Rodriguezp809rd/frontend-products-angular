import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface Toast { id: number; type: ToastType; text: string; }

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private seq = 0;
  private _bus = new Subject<Toast>();
  messages$ = this._bus.asObservable();

  private emit(type: ToastType, text: string) { this._bus.next({ id: ++this.seq, type, text }); }
  success(t: string) { this.emit('success', t); }
  error(t: string) { this.emit('error', t); }
  info(t: string) { this.emit('info', t); }
  warning(t: string) { this.emit('warning', t); }
}
