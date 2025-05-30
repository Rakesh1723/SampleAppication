import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './shared/components/modal/modal.component';
import { TileComponent } from './shared/components/tile/tile.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ModalComponent, TileComponent]
})
export class AppComponent {
  title = 'Modal Example';
  isModalOpen = false;
  exampleInput = '';

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
}
