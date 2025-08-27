import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-pagination-select',
  standalone: true,
  imports: [NgFor],
  templateUrl: './pagination-select.component.html',
  styleUrl: './pagination-select.component.css'
})
export class PaginationSelectComponent {
   @Input() itemsPerPage = 5;
  @Output() limitChange = new EventEmitter<number>();
  options = [5, 10, 20, 50];

  onChange(e: Event) {
    const limit = Number((e.target as HTMLSelectElement).value);
    this.limitChange.emit(limit);
  }
}
