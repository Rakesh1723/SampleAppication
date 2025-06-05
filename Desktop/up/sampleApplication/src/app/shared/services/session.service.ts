import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CvpConfirmationDialogComponent } from '../components/cvp-conformation-dialog/cvp-confirmation-dialog.component';
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly INACTIVITY_TIMEOUT = 1 * 60 * 1000; // 14 minutes in milliseconds
  private readonly WARNING_DURATION = 60 * 1000; // 60 seconds in milliseconds
  private activityTimer: Subscription | null = null;
  private warningTimer: Subscription | null = null;
  private destroy$ = new Subject<void>();
  private timeLeft = new BehaviorSubject<number>(60);

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

  initializeSession(): void {
    this.resetActivityTimer();
    this.setupActivityListeners();
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.resetActivityTimer());
    });
  }

  private resetActivityTimer(): void {
    if (this.activityTimer) {
      this.activityTimer.unsubscribe();
    }

    this.activityTimer = timer(this.INACTIVITY_TIMEOUT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showTimeoutWarning();
      });
  }

  private showTimeoutWarning(): void {
    const dialogRef = this.dialog.open(CvpConfirmationDialogComponent, {
      data: {
        title: 'Session Timeout Warning',
        message: `You're being timed out due to inactivity. Please choose Extend Session to stay otherwise you will be logged-off automatically in 60 sec`,
        confirmButtonText: 'Extend Session',
        cancelButtonText: 'Log Off',
        showCloseButton: false
      },
      disableClose: true,
      autoFocus: false,
      panelClass: ['cvp-dialog-container'],
    });

    this.timeLeft.next(60);
    
    // Start the warning countdown timer
    this.warningTimer = timer(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const currentTime = this.timeLeft.value - 1;
        this.timeLeft.next(currentTime);
        
        if (currentTime <= 0) {
          this.warningTimer?.unsubscribe();
          dialogRef.close(false); // Force close with "log off" result
        }

        // Update the dialog message with the countdown
        dialogRef.componentInstance.message = `You're being timed out due to inactivity. Please choose Extend Session to stay otherwise you will be logged-off automatically in ${currentTime} sec`;
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked "Extend Session"
        this.resetActivityTimer();
      } else {
        // User clicked "Log Off" or timer expired
        this.logout();
      }
      if (this.warningTimer) {
        this.warningTimer.unsubscribe();
      }
    });
  }

  logout(): void {
    // Clear any session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Stop all timers
    this.destroy$.next();
    this.destroy$.complete();
    if (this.activityTimer) {
      this.activityTimer.unsubscribe();
    }
    if (this.warningTimer) {
      this.warningTimer.unsubscribe();
    }

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.activityTimer) {
      this.activityTimer.unsubscribe();
    }
    if (this.warningTimer) {
      this.warningTimer.unsubscribe();
    }
  }
} 