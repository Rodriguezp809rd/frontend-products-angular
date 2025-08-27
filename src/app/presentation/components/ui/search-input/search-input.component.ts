import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
 @Input() searchTerm = '';
  @Output() valueChange = new EventEmitter<string>();
  onInput(e: Event) { this.valueChange.emit((e.target as HTMLInputElement).value); }
}
