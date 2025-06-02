import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DropdownOption {
  label: string;
  value: any;
  selected?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select option';
  @Input() isMultiSelect: boolean = false;
  @Input() label: string = '';

  @Output() selectionChange = new EventEmitter<any>();

  isOpen: boolean = false;
  selectedOptions: DropdownOption[] = [];

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  toggleOption(option: DropdownOption) {
    if (this.isMultiSelect) {
      option.selected = !option.selected;
      this.updateSelectedOptions();
    } else {
      this.options.forEach(opt => opt.selected = false);
      option.selected = true;
      this.updateSelectedOptions();
      this.closeDropdown();
    }
  }

  private updateSelectedOptions() {
    this.selectedOptions = this.options.filter(opt => opt.selected);
    this.selectionChange.emit(
      this.isMultiSelect ? this.selectedOptions : this.selectedOptions[0]
    );
  }

  getDisplayText(): string {
    if (this.selectedOptions.length === 0) {
      return this.placeholder;
    }
    if (this.isMultiSelect) {
      return this.selectedOptions.length === 1
        ? this.selectedOptions[0].label
        : `${this.selectedOptions.length} items selected`;
    }
    return this.selectedOptions[0].label;
  }
} 