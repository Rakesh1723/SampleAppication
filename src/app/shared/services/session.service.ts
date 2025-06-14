import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CvpConfirmationDialogComponent } from '../components/cvp-conformation-dialog/cvp-confirmation-dialog.component';
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 1 minute in milliseconds (for testing)
  private readonly WARNING_DURATION = 60 * 1000; // 60 seconds in milliseconds
  private activityTimer: Subscription | null = null;
  private warningTimer: Subscription | null = null;
  private destroy$ = new Subject<void>();
  private timeLeft = new BehaviorSubject<number>(60);
  private routerSubscription: Subscription | null = null;

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {
    // Subscribe to router events to handle navigation
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        // If navigating to login page, stop session monitoring
        if (event.url === '/login') {
          this.stopSessionMonitoring();
        }
      });
  }

  private stopSessionMonitoring(): void {
    if (this.activityTimer) {
      this.activityTimer.unsubscribe();
      this.activityTimer = null;
    }
    if (this.warningTimer) {
      this.warningTimer.unsubscribe();
      this.warningTimer = null;
    }
    // Remove activity listeners
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    events.forEach(event => {
      document.removeEventListener(event, () => this.resetActivityTimer());
    });
  }

  initializeSession(): void {
    // Only initialize if user is logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.resetActivityTimer();
      this.setupActivityListeners();
    }
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    
    events.forEach(event => {
      // First remove any existing listeners to prevent duplicates
      document.removeEventListener(event, () => this.resetActivityTimer());
      // Then add the new listener
      document.addEventListener(event, () => this.resetActivityTimer());
    });
  }

  private resetActivityTimer(): void {
    // Only reset timer if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      return;
    }

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
    // Don't show warning if user is on login page or not logged in
    if (this.router.url === '/login' || localStorage.getItem('isLoggedIn') !== 'true') {
      return;
    }

    const dialogRef = this.dialog.open(CvpConfirmationDialogComponent, {
      data: {
        title: 'Session Timeout Warning',
        countdownTime: 60,
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
        
        if (currentTime < 0) {
          this.warningTimer?.unsubscribe();
          dialogRef.close(false); // Force close with "log off" result
          return;
        }

        // Update the countdown in the dialog component
        dialogRef.componentInstance.updateCountdown(currentTime);
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
    // Stop monitoring before clearing session data
    this.stopSessionMonitoring();
    
    // Clear any session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Stop all timers
    this.destroy$.next();
    this.destroy$.complete();

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  destroy(): void {
    this.stopSessionMonitoring();
    this.destroy$.next();
    this.destroy$.complete();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
} 