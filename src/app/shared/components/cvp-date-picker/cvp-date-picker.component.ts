import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges, ElementRef, HostListener } from '@angular/core';
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
export class CvpDatePickerComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date | null = null;
  @Output() selectedDateChange = new EventEmitter<Date>();
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() cancel = new EventEmitter<void>();

  showDatePicker = false;
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  showCustomRange = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedOption: string = 'Today';
  highlightedDates: Date[] = [];
  dateRange: Date[] = [];
  calendarViewDate: Date = new Date();
  
  // Force calendar rebuild
  showCalendar = true;

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {}

  ngOnInit() {
    this.initializeDates();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDate']) {
      this.initializeDates();
    }
  }

  initializeDates() {
    if (!this.selectedDate) {
      this.selectedDate = new Date();
    }
    this.updateHighlightedDates();
    this.rebuildCalendar();
  }

  get monthNames(): string[] {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }

  get currentMonthName(): string {
    return this.monthNames[this.currentMonth];
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
    if (this.showDatePicker) {
      this.updateHighlightedDates();
      if (this.selectedOption === 'Custom' && this.startDate) {
        this.calendarViewDate = new Date(this.startDate);
        this.currentMonth = this.calendarViewDate.getMonth();
        this.currentYear = this.calendarViewDate.getFullYear();
      } else {
        this.calendarViewDate = this.selectedDate || new Date();
        this.currentMonth = this.calendarViewDate.getMonth();
        this.currentYear = this.calendarViewDate.getFullYear();
      }
      this.rebuildCalendar();
    }
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
      this.calendarViewDate = new Date(this.currentYear, this.currentMonth);
      this.updateHighlightedDates();
      this.rebuildCalendar();
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
      this.calendarViewDate = new Date(this.currentYear, this.currentMonth);
      this.updateHighlightedDates();
      this.rebuildCalendar();
    }
  }

  updateHighlightedDates(): void {
    this.highlightedDates = [];
    this.dateRange = [];
    switch (this.selectedOption) {
      case 'Today':
        const today = new Date();
        this.highlightedDates = [today];
        this.dateRange = [today];
        this.calendarViewDate = today;
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        break;
      case 'Yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        this.highlightedDates = [yesterday];
        this.dateRange = [yesterday];
        this.calendarViewDate = yesterday;
        this.currentMonth = yesterday.getMonth();
        this.currentYear = yesterday.getFullYear();
        break;
      case 'This Week':
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date();
        this.dateRange = [];
        for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
          this.dateRange.push(new Date(d));
        }
        this.highlightedDates = [weekStart, weekEnd];
        this.calendarViewDate = weekStart;
        this.currentMonth = weekStart.getMonth();
        this.currentYear = weekStart.getFullYear();
        break;
      case 'This Month':
        const monthStart = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const monthEnd = new Date();
        this.dateRange = [];
        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
          this.dateRange.push(new Date(d));
        }
        this.highlightedDates = [monthStart, monthEnd];
        this.calendarViewDate = monthStart;
        this.currentMonth = monthStart.getMonth();
        this.currentYear = monthStart.getFullYear();
        break;
      case 'Custom':
        if (this.startDate && this.endDate) {
          this.highlightedDates = [this.startDate, this.endDate];
          this.dateRange = [];
          for (
            let d = new Date(this.startDate);
            d <= this.endDate;
            d.setDate(d.getDate() + 1)
          ) {
            this.dateRange.push(new Date(d));
          }
        } else if (this.startDate) {
          this.highlightedDates = [this.startDate];
          this.dateRange = [this.startDate];
        }
        break;
    }
  }

  isDateHighlighted(date: Date): boolean {
    return this.dateRange.some(rangeDate => 
      rangeDate.getDate() === date.getDate() &&
      rangeDate.getMonth() === date.getMonth() &&
      rangeDate.getFullYear() === date.getFullYear()
    );
  }

  isDateRangeEnd(date: Date): boolean {
    return this.highlightedDates.some(d => 
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  }

  getDateClass = (date: Date): string => {
    const isInRange = this.isDateHighlighted(date);
    const isRangeEnd = this.isDateRangeEnd(date);

    // Check if this date is today
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isInRange && isRangeEnd) {
      return 'highlighted-range-end';
    }
    if (isInRange) {
      return 'highlighted-range';
    }
    if (isToday) {
      // Use the same class as highlighted-range
      return 'highlighted-range';
    }
    return '';
  };

  selectToday(): void {
    const today = new Date();
    this.selectedDate = today;
    this.selectedOption = 'Today';
    this.updateHighlightedDates();
    this.selectedDateChange.emit(today);
    this.dateSelected.emit(today);
    this.rebuildCalendar();
  }

  selectYesterday(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (yesterday >= this.minDate) {
      this.selectedDate = yesterday;
      this.selectedOption = 'Yesterday';
      this.updateHighlightedDates();
      this.selectedDateChange.emit(yesterday);
      this.dateSelected.emit(yesterday);
      this.rebuildCalendar();
    }
  }

  selectThisWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    if (startOfWeek < this.minDate) {
      startOfWeek.setTime(this.minDate.getTime());
    }
    
    this.startDate = startOfWeek;
    this.endDate = today;
    this.selectedDate = startOfWeek;
    this.selectedOption = 'This Week';
    this.showCustomRange = false;
    this.updateHighlightedDates();
    this.selectedDateChange.emit(startOfWeek);
    this.dateSelected.emit(startOfWeek);
    this.rebuildCalendar();
  }

  selectThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    if (startOfMonth < this.minDate) {
      startOfMonth.setTime(this.minDate.getTime());
    }
    
    this.startDate = startOfMonth;
    this.endDate = today;
    this.selectedDate = startOfMonth;
    this.selectedOption = 'This Month';
    this.showCustomRange = false;
    this.updateHighlightedDates();
    this.selectedDateChange.emit(startOfMonth);
    this.dateSelected.emit(startOfMonth);
    this.rebuildCalendar();
  }

  selectCustomRange(): void {
    this.selectedOption = 'Custom';
    this.showCustomRange = true;
    this.startDate = null;
    this.endDate = null;
    this.highlightedDates = [];
    this.dateRange = [];
    const today = new Date();
    this.calendarViewDate = today;
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.rebuildCalendar();
  }

  onDateSelected(date: Date | null): void {
    if (!date) return;

    if (this.selectedOption === 'Custom') {
      if (!this.startDate) {
        // First selection - set as start date
        this.startDate = new Date(date);
        this.endDate = null;
        this.highlightedDates = [new Date(date)];
        this.dateRange = [new Date(date)];
      } else if (!this.endDate) {
        // Second selection - validate and set as end date
        if (date < this.startDate) {
          // If selected date is before start date, make it the new start date
          this.startDate = new Date(date);
          this.highlightedDates = [new Date(date)];
          this.dateRange = [new Date(date)];
        } else {
          // Valid end date - set the range
          this.endDate = new Date(date);
          this.highlightedDates = [new Date(this.startDate), new Date(this.endDate)];
          
          // Generate all dates in range
          this.dateRange = [];
          for (let d = new Date(this.startDate); d <= this.endDate; d.setDate(d.getDate() + 1)) {
            this.dateRange.push(new Date(d));
          }
        }
      } else {
        // Third or subsequent selection - start new range
        this.startDate = new Date(date);
        this.endDate = null;
        this.highlightedDates = [new Date(date)];
        this.dateRange = [new Date(date)];
      }

      // Always keep calendar view at today's date
      const today = new Date();
      this.calendarViewDate = today;
      this.currentMonth = today.getMonth();
      this.currentYear = today.getFullYear();
      this.rebuildCalendar();
    } else {
      this.selectedDate = date;
      this.updateHighlightedDates();
      this.selectedDateChange.emit(date);
    }
  }

  onCancel(): void {
    this.showDatePicker = false;
    this.cancel.emit();
  }

  getDisplayText(): string {
    if (this.selectedOption === 'Custom') {
      if (this.startDate && this.endDate) {
        // Check if start and end dates are the same
        if (this.startDate.getDate() === this.endDate.getDate() && 
            this.startDate.getMonth() === this.endDate.getMonth() && 
            this.startDate.getFullYear() === this.endDate.getFullYear()) {
          return this.startDate.toLocaleDateString();
        }
        return `${this.startDate.toLocaleDateString()} - ${this.endDate.toLocaleDateString()}`;
      } else if (this.startDate) {
        return this.startDate.toLocaleDateString();
      }
    }
    return this.selectedOption || (this.selectedDate ? this.selectedDate.toLocaleDateString() : 'Select Date');
  }

  onOk(): void {
    if (this.selectedOption === 'Custom' && this.startDate) {
      this.selectedDate = this.startDate;
      this.selectedDateChange.emit(this.startDate);
      this.dateSelected.emit(this.startDate);
      // Reset calendar view to today after confirming
      const today = new Date();
      this.calendarViewDate = today;
      this.currentMonth = today.getMonth();
      this.currentYear = today.getFullYear();
    } else if (this.selectedDate) {
      this.selectedDateChange.emit(this.selectedDate);
      this.dateSelected.emit(this.selectedDate);
    }
    this.showDatePicker = false;
  }

  // Rebuild calendar by toggling its visibility
  private rebuildCalendar(): void {
    this.showCalendar = false;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.showCalendar = true;
      this.cdr.detectChanges();
    }, 0);
  }

  // Set min date to 6 months ago
  get minDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date;
  }

  // Set max date to current date
  get maxDate(): Date {
    return new Date();
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.showDatePicker &&
      (this.selectedOption === 'Today' || !this.selectedOption || this.selectedOption === '') &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.showDatePicker = false;
      this.cdr.detectChanges();
    }
  }
}