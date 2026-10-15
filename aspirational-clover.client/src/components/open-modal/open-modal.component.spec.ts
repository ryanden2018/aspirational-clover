import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OpenModalComponent } from './open-modal.component';
import { DocumentService } from '../../app/document.service';

describe('SaveModalComponent', () => {
  let component: OpenModalComponent;
  let fixture: ComponentFixture<OpenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenModalComponent],
      providers: [
        { provide: DocumentService, useValue: { allowSave: () => true, onSave: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
