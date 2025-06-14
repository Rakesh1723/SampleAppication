import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  @Input() isDisabled = false;
  @Input() title: string = '';
  @Input() hasFiles: boolean = true;
  @Input() files: string = '';
  @Input() hasTypes: boolean = true;
  @Input() types: string = '';
  @Input() field1Label: string = '';
  @Input() field1Value: string = '';
  @Input() field2Label: string = '';
  @Input() field2Value: string = '';
  @Input() field3Label: string = '';
  @Input() field3Value: string = '';

  isActive: boolean = false;

  onMouseEnter() {
    if (this.isDisabled) return;
    this.isActive = true;
  }

  onMouseLeave() {
    if (this.isDisabled) return;
    this.isActive = false;
  }
} 