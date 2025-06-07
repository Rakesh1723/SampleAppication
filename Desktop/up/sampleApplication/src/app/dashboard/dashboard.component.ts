import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvpTransactionSummaryCardComponent } from '../shared/components/cvp-transaction-summary-card/cvp-transaction-summary-card.component';
import { CvpPrimaryButtonComponent } from '../shared/components/cvp-primary-button/cvp-primary-button.component';
import { CvpSecondaryButtonComponent } from '../shared/components/cvp-secondary-button/cvp-secondary-button.component';
import { CvpConfirmationDialogComponent } from '../shared/components/cvp-conformation-dialog/cvp-confirmation-dialog.component';
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
    CvpConfirmationDialogComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="actions">
          <cvp-primary-button
            label="Primary Action"
            icon="close"
            [isDisabled]="isPrimaryDisabled"
            (buttonClick)="onPrimaryAction()"
          ></cvp-primary-button>
          <cvp-secondary-button
            label="Secondary Action"
            icon="close"
            [isDisabled]="isSecondaryDisabled"
            (buttonClick)="onSecondaryAction()"
          ></cvp-secondary-button>
          <button class="open-modal-btn" (click)="openModal()">LogOut</button>
          <button class="open-modal-btn logout2" (click)="openLogout2Modal()">LogOut2</button>
        </div>
      </header>

      <main class="container">
        <div class="cards-grid">
          <app-cvp-transaction-summary-card 
            title="Enrollment" 
            [hasFiles]="true" 
            files=" 1 Files" 
            [hasTypes]="false"
            types="Types" 
            field1Label="Total Transactions" 
            field1Value="85K" 
            field2Label="Successful Transactions"
            field2Value="75k" 
            field3Label="Fallouts" 
            field3Value="15">
          </app-cvp-transaction-summary-card>
          
          <app-cvp-transaction-summary-card 
            title="Correspondance Extract" 
            [hasFiles]="false" 
            files=" 0 Files" 
            [hasTypes]="true"
            types="Types" 
            field1Label="Total Transactions" 
            field1Value="50k" 
            field2Label="Successful Transactions"
            field2Value="45k" 
            field3Label="Fallouts" 
            field3Value="01">
          </app-cvp-transaction-summary-card>
          
          <app-cvp-transaction-summary-card 
            [isDisabled]="true" 
            title="Correspondance Update" 
            [hasFiles]="true" 
            files="0 Files"
            [hasTypes]="true" 
            types="12000Types" 
            field1Label="Total Transactions" 
            field1Value="47k"
            field2Label="Successful Transactions" 
            field2Value="45k" 
            field3Label="Fallouts" 
            field3Value=" 01">
          </app-cvp-transaction-summary-card>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8fafc;
    }

    .app-header {
      background-color: #ffffff;
      padding: 1rem 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: flex-end;
        padding: 0.5rem 0;

        .open-modal-btn {
          padding: 10px 20px;
          background-color: #000305;
          color: white;
          border: none;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: #1a1f25;
          }

          &.logout2 {
            background-color: #1a1f25;
            
            &:hover {
              background-color: #2a3441;
            }
          }
        }
      }
    }

    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      width: 100%;
    }

    @media (max-width: 1199px) {
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 767px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  isPrimaryDisabled = false;
  isSecondaryDisabled = true;

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
} 