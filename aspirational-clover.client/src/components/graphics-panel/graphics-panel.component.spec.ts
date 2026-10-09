import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GraphicsPanelComponent } from './graphics-panel.component';
import { DocumentService } from '../../app/document.service';
import { UndoService } from '../../app/undo.service';
import { ShapeToolsService } from '../../app/shape-tools.service';
import { SelectionService } from '../../app/selection.service';
import { ThemeService } from '../../app/theme.service';

describe('GraphicsPanelComponent', () => {
  let component: GraphicsPanelComponent;
  let fixture: ComponentFixture<GraphicsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphicsPanelComponent],
      providers: [
        { provide: DocumentService, useValue: { activeDocument: () => ({ layers: [] }), selectedLayer: () => ({ id: undefined }) } },
        { provide: UndoService, useValue: {} },
        { provide: ShapeToolsService, useValue: { mode: () => null } },
        { provide: SelectionService, useValue: { selectedShapeClientUuid: () => null } },
        { provide: ThemeService, useValue: { mode: () => 'light', classNames: () => ({ graphicsPanelSvg: '' }), modeAsObservable: { subscribe: () => ({}) } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
