import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CvpPrimaryButtonComponent } from '../cvp-primary-button/cvp-primary-button.component';
import { CvpSecondaryButtonComponent } from '../cvp-secondary-button/cvp-secondary-button.component';

@Component({
  selector: 'cvp-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CvpPrimaryButtonComponent,
    CvpSecondaryButtonComponent
  ],
  templateUrl: './cvp-date-picker.component.html',
  styleUrls: ['./cvp-date-picker.component.scss']
})
export class CvpDatePickerComponent {
  @Input() selectedDate: Date | null = null;
  @Output() selectedDateChange = new EventEmitter<Date>();
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() cancel = new EventEmitter<void>();

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  showCustomRange = false;
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Set min date to 6 months ago
  minDate: Date = (() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date;
  })();

  // Set max date to current date
  maxDate: Date = new Date();

  get monthNames(): string[] {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }

  get currentMonthName(): string {
    return this.monthNames[this.currentMonth];
  }

  previousMonth(): void {
    const newDate = new Date(this.currentYear, this.currentMonth - 1);
    if (newDate >= this.minDate) {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    }
  }

  nextMonth(): void {
    const newDate = new Date(this.currentYear, this.currentMonth + 1);
    if (newDate <= this.maxDate) {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    }
  }

  selectToday(): void {
    this.selectedDate = new Date();
    this.selectedDateChange.emit(this.selectedDate);
    this.dateSelected.emit(this.selectedDate);
  }

  selectThisWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Ensure start date is not before minDate
    if (startOfWeek < this.minDate) {
      startOfWeek.setTime(this.minDate.getTime());
    }
    
    this.startDate = startOfWeek;
    this.endDate = new Date(startOfWeek);
    this.endDate.setDate(startOfWeek.getDate() + 6);
    
    // Ensure end date is not after maxDate
    if (this.endDate > this.maxDate) {
      this.endDate.setTime(this.maxDate.getTime());
    }
    
    this.showCustomRange = true;
  }

  selectThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Ensure start date is not before minDate
    if (startOfMonth < this.minDate) {
      startOfMonth.setTime(this.minDate.getTime());
    }
    
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Ensure end date is not after maxDate
    if (endOfMonth > this.maxDate) {
      endOfMonth.setTime(this.maxDate.getTime());
    }
    
    this.startDate = startOfMonth;
    this.endDate = endOfMonth;
    this.showCustomRange = true;
  }

  selectCustomRange(): void {
    this.showCustomRange = true;
  }

  onDateSelected(date: Date): void {
    if (date >= this.minDate && date <= this.maxDate) {
      this.selectedDate = date;
      this.selectedDateChange.emit(date);
      this.dateSelected.emit(date);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOk(): void {
    if (this.showCustomRange && this.startDate && this.endDate) {
      // Handle custom range selection
      this.selectedDate = this.startDate;
      this.selectedDateChange.emit(this.startDate);
      this.dateSelected.emit(this.startDate);
    } else if (this.selectedDate) {
      this.selectedDateChange.emit(this.selectedDate);
      this.dateSelected.emit(this.selectedDate);
    }
  }
} 