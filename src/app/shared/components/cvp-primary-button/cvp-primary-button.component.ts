import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cvp-primary-button',
  templateUrl: './cvp-primary-button.component.html',
  styleUrls: ['./cvp-primary-button.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CvpPrimaryButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = ''; // Material icon name
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() isDisabled: boolean = false;
  
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.isDisabled) {
      this.buttonClick.emit();
    }
  }
}
