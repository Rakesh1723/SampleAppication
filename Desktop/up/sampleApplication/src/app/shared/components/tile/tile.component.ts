import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tile" [ngClass]="[variant ? 'tile-' + variant : '', size ? 'tile-' + size : '']">
      <div class="tile-header">
        <h3 class="tile-title">{{ title }}</h3>
        <p *ngIf="subtitle" class="tile-subtitle">{{ subtitle }}</p>
      </div>
      <div class="tile-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() variant?: 'primary' | 'success' | 'warning' | 'danger';
  @Input() size?: 'sm' | 'lg';
} 