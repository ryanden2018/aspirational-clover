import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PropertyViewerComponent } from './property-viewer.component';
import { SelectionService } from '../../app/selection.service';
import { DocumentService } from '../../app/document.service';

describe('PropertyViewerComponent', () => {
  let component: PropertyViewerComponent;
  let fixture: ComponentFixture<PropertyViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyViewerComponent],
      providers: [
        { provide: SelectionService, useValue: { selectedShapeClientUuid: () => null } },
        { provide: DocumentService, useValue: { activeDocument: () => ({ layers: [] }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
