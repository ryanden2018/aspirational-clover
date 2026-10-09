import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToolBarComponent } from './tool-bar.component';
import { ThemeService } from '../../app/theme.service';
import { ResourcesService } from '../../app/resources.service';
import { UndoService } from '../../app/undo.service';
import { ShapeToolsService } from '../../app/shape-tools.service';
import { DocumentService } from '../../app/document.service';
import { SelectionService } from '../../app/selection.service';

describe('ToolBarComponent', () => {
  let component: ToolBarComponent;
  let fixture: ComponentFixture<ToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolBarComponent],
      providers: [
        { provide: ThemeService, useValue: { mode: () => 'light', toggleMode: () => {} } },
        { provide: ResourcesService, useValue: { resources: () => ({}) } },
        { provide: UndoService, useValue: { undo: () => {}, redo: () => {} } },
        { provide: ShapeToolsService, useValue: { setMode: () => {}, mode: () => null } },
        { provide: DocumentService, useValue: { newDocument: () => {}, allowSave: () => true, onSave: () => {} } },
        { provide: SelectionService, useValue: { copySelectedShapeToClipboard: () => {}, pasteShapeFromClipboard: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
