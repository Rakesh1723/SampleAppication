import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './shared/components/modal/modal.component';
import { TileComponent } from './shared/components/tile/tile.component';
import { DropdownComponent } from './shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ModalComponent, TileComponent, DropdownComponent]
})
export class AppComponent {
  title = 'Modal Example';
  isModalOpen = false;
  exampleInput = '';

  singleSelectOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' }
  ];

  multiSelectOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' }
  ];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSave() {
    console.log('Saving input:', this.exampleInput);
    this.closeModal();
  }

  onSingleSelectChange(selection: any) {
    console.log('Single Select Changed:', selection);
  }

  onMultiSelectChange(selections: any[]) {
    console.log('Multi Select Changed:', selections);
  }
}
