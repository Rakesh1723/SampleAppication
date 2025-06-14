import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CvpPrimaryButtonComponent } from '../cvp-primary-button/cvp-primary-button.component';
import { CvpSecondaryButtonComponent } from '../cvp-secondary-button/cvp-secondary-button.component';
import { BehaviorSubject } from 'rxjs';

interface DialogData {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  showCloseButton: boolean;
  countdownTime?: number;
}

@Component({
  selector: 'cvp-confirmation-dialog',
  templateUrl: './cvp-confirmation-dialog.component.html',
  styleUrls: ['./cvp-confirmation-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    CvpPrimaryButtonComponent,
    CvpSecondaryButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvpConfirmationDialogComponent {
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  showCloseButton: boolean;
  countdownTime?: number;
  countdown$ = new BehaviorSubject<number>(0);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    public dialogRef: MatDialogRef<CvpConfirmationDialogComponent>
  ) {
    this.title = data.title;
    this.message = data.message;
    this.confirmButtonText = data.confirmButtonText || 'Yes';
    this.cancelButtonText = data.cancelButtonText || 'No';
    this.showCloseButton = data.showCloseButton ?? true;
    this.countdownTime = data.countdownTime;
    
    if (this.countdownTime) {
      this.countdown$.next(this.countdownTime);
    }

    // Prevent dialog from closing when clicking outside
    this.dialogRef.disableClose = true;
  }

  updateCountdown(time: number) {
    this.countdown$.next(time);
  }
}

  // onClose() {
  //   this.close.emit();
  // }

  // onPrimaryAction() {
  //   this.primaryAction.emit();
  // }

  // onSecondaryAction() {
  //   this.secondaryAction.emit();
  // }