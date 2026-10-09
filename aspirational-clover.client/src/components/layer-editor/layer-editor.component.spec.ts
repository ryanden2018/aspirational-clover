import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LayerEditorComponent } from './layer-editor.component';
import { DocumentService } from '../../app/document.service';

describe('LayerEditorComponent', () => {
  let component: LayerEditorComponent;
  let fixture: ComponentFixture<LayerEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerEditorComponent],
      providers: [
        { provide: DocumentService, useValue: { activeDocument: () => ({ layers: [] }), selectedLayer: () => ({ id: undefined }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
