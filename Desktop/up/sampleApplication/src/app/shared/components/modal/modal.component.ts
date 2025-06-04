import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() primaryButtonText: string = 'Confirm';
  @Input() secondaryButtonText: string = 'Cancel';
  @Input() showCloseButton: boolean = true;

  @Output() close = new EventEmitter<void>();
  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onPrimaryAction() {
    this.primaryAction.emit();
  }

  onSecondaryAction() {
    this.secondaryAction.emit();
  }
} 