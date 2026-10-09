import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToolTipButtonComponent } from './tool-tip-button.component';
import { ThemeService } from '../../app/theme.service';

describe('ToolTipButtonComponent', () => {
  let component: ToolTipButtonComponent;
  let fixture: ComponentFixture<ToolTipButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolTipButtonComponent],
      providers: [
        { provide: ThemeService, useValue: { mode: () => 'light', classNames: () => ({}) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTipButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
