import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  @Input() title: string = '';
  @Input() status: string = '';
  @Input() field1Label: string = '';
  @Input() field1Value: string = '';
  @Input() field2Label: string = '';
  @Input() field2Value: string = '';
  @Input() field3Label: string = '';
  @Input() field3Value: string = '';

  isActive: boolean = false;

  onMouseDown() {
    this.isActive = true;
  }

  onMouseUp() {
    // Remove this method as we don't want to deactivate on mouse up
  }

  onMouseLeave() {
    this.isActive = false;
  }
} 