import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AnchoredToolTipComponent } from './anchored-tool-tip.component';
import { ThemeService } from '../../app/theme.service';
import { AnchorService } from '../../app/anchor.service';

describe('AnchoredToolTipComponent', () => {
  let component: AnchoredToolTipComponent;
  let fixture: ComponentFixture<AnchoredToolTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnchoredToolTipComponent],
      providers: [
        { provide: ThemeService, useValue: { classNames: () => ({ toolTip: 'tool-tip' }), mode: () => 'light' } },
        { provide: AnchorService, useValue: { tooltip: () => ({ signalType: 'hide' }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnchoredToolTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
