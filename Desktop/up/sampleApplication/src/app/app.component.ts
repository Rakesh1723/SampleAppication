import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TileComponent } from './shared/components/tile/tile.component';
import { DropdownComponent } from './shared/components/dropdown/dropdown.component';
import { CvpPrimaryButtonComponent } from './shared/components/cvp-primary-button/cvp-primary-button.component';
import { CvpSecondaryButtonComponent } from './shared/components/cvp-secondary-button/cvp-secondary-button.component';
import { CvpConfirmationDialogComponent } from './shared/components/cvp-conformation-dialog/cvp-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TileComponent,
    CvpPrimaryButtonComponent,
    CvpSecondaryButtonComponent,
    CvpConfirmationDialogComponent
  ]
})
export class AppComponent {
  title = 'Modal Example';
  isModalOpen = false;
  exampleInput = '';
  isPrimaryDisabled = false;
  isSecondaryDisabled = true;

  constructor(private dialog: MatDialog) {}

  openModal() {
    const dialogRef = this.dialog.open(CvpConfirmationDialogComponent, {
      data: {
        title: 'Confirm Logout ?',
        message: 'Are you sure you want to logout ?',
        confirmButtonText: 'Log off',
        cancelButtonText: 'Cancel',
        showCloseButton: true
      },
      disableClose: false,
      autoFocus: false,
      panelClass: ['cvp-dialog-container'],
      maxHeight: '100vh',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSave();
      }
      this.closeModal();
    });
  }

  openLogout2Modal() {
    const dialogRef = this.dialog.open(CvpConfirmationDialogComponent, {
      data: {
        title: 'Confirm Logout ?',
        message: `
          <div class="logout-content">
            <img src="./assets/images/download.png" alt="Logout" class="logout-icon">
            <p>Are you sure you want to logout from the application?</p>
          </div>
        `,
        confirmButtonText: 'Log off',
        cancelButtonText: 'Cancel',
        showCloseButton: false
      },
      disableClose: true,
      autoFocus: false,
      panelClass: ['cvp-dialog-container'],
      maxHeight: '100vh',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSave();
      }
      this.closeModal();
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSave() {
    console.log('Saving input:', this.exampleInput);
    this.closeModal();
  }

  onPrimaryAction(): void {
    console.log('Primary button clicked');
  }

  onSecondaryAction(): void {
    console.log('Secondary button clicked');
  }

  // Dropdown methods
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

  onSingleSelectChange(selection: any) {
    console.log('Single Select Changed:', selection);
  }

  onMultiSelectChange(selections: any[]) {
    console.log('Multi Select Changed:', selections);
  }
}
