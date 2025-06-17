import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvpTransactionSummaryCardComponent } from '../shared/components/cvp-transaction-summary-card/cvp-transaction-summary-card.component';
import { CvpPrimaryButtonComponent } from '../shared/components/cvp-primary-button/cvp-primary-button.component';
import { CvpSecondaryButtonComponent } from '../shared/components/cvp-secondary-button/cvp-secondary-button.component';
import { CvpConfirmationDialogComponent } from '../shared/components/cvp-conformation-dialog/cvp-confirmation-dialog.component';
import { CvpDatePickerComponent } from '../shared/components/cvp-date-picker/cvp-date-picker.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../shared/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CvpTransactionSummaryCardComponent,
    CvpPrimaryButtonComponent,
    CvpSecondaryButtonComponent,
    CvpDatePickerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isPrimaryDisabled = false;
  isSecondaryDisabled = true;
  selectedDate: Date | null = null;
  showDatePicker = false;
  selectedLabel: string = '';

  constructor(
    private dialog: MatDialog,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Set logged in state
    localStorage.setItem('isLoggedIn', 'true');
    // Initialize session monitoring
    this.sessionService.initializeSession();
  }

  ngOnDestroy() {
    // Clean up session monitoring
    this.sessionService.destroy();
  }

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
        this.sessionService.logout();
      }
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
        this.sessionService.logout();
      }
    });
  }

  onPrimaryAction(): void {
    console.log('Primary button clicked');
  }

  onSecondaryAction(): void {
    console.log('Secondary button clicked');
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.selectedLabel = this.getSelectedLabel(date);
    this.showDatePicker = false;
    console.log('Selected date:', date);
  }

  getSelectedLabel(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date >= startOfWeek && date <= endOfWeek) {
      return 'This Week';
    } else if (date >= startOfMonth && date <= endOfMonth) {
      return 'This Month';
    } else {
      return 'Custom Range';
    }
  }

  onDatePickerCancel(): void {
    this.showDatePicker = false;
  }
} 