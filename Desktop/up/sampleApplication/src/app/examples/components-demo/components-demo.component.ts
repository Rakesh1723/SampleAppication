import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TileComponent } from '../../shared/components/tile/tile.component';

@Component({
  selector: 'app-components-demo',
  standalone: true,
  imports: [ButtonComponent, TileComponent],
  templateUrl: './components-demo.component.html',
  styleUrls: ['./components-demo.component.scss']
})
export class ComponentsDemoComponent {} 