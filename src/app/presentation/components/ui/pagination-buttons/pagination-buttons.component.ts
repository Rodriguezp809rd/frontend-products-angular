import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-pagination-buttons',
  standalone: true,
  imports: [NgFor],
  templateUrl: './pagination-buttons.component.html',
  styleUrl: './pagination-buttons.component.css'
})
export class PaginationButtonsComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  go(p: number) { this.pageChange.emit(p); }
}
