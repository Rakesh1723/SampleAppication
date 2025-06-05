import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvpPrimaryButtonComponent } from './cvp-primary-button.component';

describe('CvpPrimaryButtonComponent', () => {
  let component: CvpPrimaryButtonComponent;
  let fixture: ComponentFixture<CvpPrimaryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvpPrimaryButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvpPrimaryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
