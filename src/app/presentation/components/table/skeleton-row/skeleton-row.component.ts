import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-row',
  standalone: true,
  imports: [],
   template: `<div class="skeleton"></div>`,
  styles: [`
    .skeleton { width: 100%; height: 64px; background: linear-gradient(90deg,#eee,#f5f5f5,#eee); background-size: 200% 100%; animation: sh 1.2s infinite; border-radius: 8px; }
    @keyframes sh { 0%{background-position: 200% 0} 100%{background-position: -200% 0} }
  `]
})
export class SkeletonRowComponent {

}
