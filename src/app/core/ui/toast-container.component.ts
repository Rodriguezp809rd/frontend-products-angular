import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { NotificationService, Toast } from './notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrap" role="status" aria-live="polite">
      <div *ngFor="let t of toasts()" class="toast" [class.err]="t.type==='error'" [class.ok]="t.type==='success'">
        {{ t.text }}
      </div>
    </div>
  `,
  styles: [`
    .toast-wrap{position:fixed;right:16px;top:16px;display:flex;flex-direction:column;gap:8px;z-index:9999}
    .toast{padding:10px 14px;border-radius:8px;background:#1f2937;color:#fff;box-shadow:0 10px 20px rgba(0,0,0,.15)}
    .toast.ok{background:#16a34a}.toast.err{background:#dc2626}
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  private sub?: Subscription;
  private list: Toast[] = [];
  toasts = signal<Toast[]>([]);
  constructor(private bus: NotificationService) {}
  ngOnInit() {
    this.sub = this.bus.messages$.subscribe(t => {
      this.list = [...this.list, t];
      this.toasts.set(this.list);
      timer(3500).subscribe(() => {
        this.list = this.list.filter(x => x.id !== t.id);
        this.toasts.set(this.list);
      });
    });
  }
  ngOnDestroy() { this.sub?.unsubscribe(); }
}
