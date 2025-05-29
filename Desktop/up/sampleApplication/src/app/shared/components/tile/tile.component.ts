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
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() variant?: 'primary' | 'success' | 'warning' | 'danger';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() height?: string;

  getTileClasses(): string {
    const classes = ['tile'];
    if (this.variant) {
      classes.push(`tile-${this.variant}`);
    }
    classes.push(`tile-${this.size}`);
    return classes.join(' ');
  }
} 