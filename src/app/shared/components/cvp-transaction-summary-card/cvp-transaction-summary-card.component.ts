import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-cvp-transaction-summary-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './cvp-transaction-summary-card.component.html',
  styleUrls: ['./cvp-transaction-summary-card.component.scss']
})
export class CvpTransactionSummaryCardComponent implements AfterViewInit, OnDestroy {
  @Input() isDisabled = false;
  @Input() title: string = '';
  @Input() hasFiles: boolean = true;
  @Input() files: string = '';
  @Input() hasTypes: boolean = true;
  @Input() types: string = '';
  @Input() field1Label: string = '';
  @Input() field1Value: string = '';
  @Input() field2Label: string = '';
  @Input() field2Value: string = '';
  @Input() field3Label: string = '';
  @Input() field3Value: string = '';
  @Input() chartValue1: number = 60;
  @Input() chartValue2: number = 40;

  @ViewChild('donutChart') donutChart!: ElementRef;
  private chart: Chart | undefined;

  isActive: boolean = false;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart() {
    if (!this.donutChart?.nativeElement) return;

    const ctx = this.donutChart.nativeElement.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.chartValue1, this.chartValue2],
          backgroundColor: ['#F91E05','#00D6B8'],
          borderWidth: 0,
          spacing: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        animation: {
          duration: 0
        },
        cutout: '75%'
      }
    });
  }

  onMouseEnter() {
    if (this.isDisabled) return;
    this.isActive = true;
  }

  onMouseLeave() {
    if (this.isDisabled) return;
    this.isActive = false;
  }
} 