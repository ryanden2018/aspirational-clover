import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { DocumentService } from './document.service';
import { ResourcesService } from './resources.service';
import { ThemeService } from './theme.service';
import { HotkeysService } from './hotkeys.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let docFlags: any;
  let hotFlags: any;

  beforeEach(async () => {
    docFlags = { retrieveCalled: false };
    const documentServiceStub = {
      retrieveSampleDocumentsOnce: () => { docFlags.retrieveCalled = true; },
      toast: () => null,
      closeToast: () => {},
    };

    const resourcesServiceStub = { subscribeResources: () => {} };

    const themeServiceStub = { classNames: () => ({ toolBar: '', propertyViewer: '', tabBar: '', appBody: '' }) };

    hotFlags = { connectDeleteCalled: false, connectCtrlZCalled: false };
    const hotkeysServiceStub = {
      connectDeleteKeydown: () => { hotFlags.connectDeleteCalled = true; },
      connectCtrlZKeydown: () => { hotFlags.connectCtrlZCalled = true; },
      connectCtrlYKeydown: () => {},
      connectCtrlShiftZKeydown: () => {},
      connectCtrlCKeydown: () => {},
      connectCtrlVKeydown: () => {},
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: DocumentService, useValue: documentServiceStub },
        { provide: ResourcesService, useValue: resourcesServiceStub },
        { provide: ThemeService, useValue: themeServiceStub },
        { provide: HotkeysService, useValue: hotkeysServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call retrieveSampleDocumentsOnce and connect hotkeys on init', () => {
    component.ngOnInit();

    expect(docFlags.retrieveCalled).toBe(true);
    expect(hotFlags.connectDeleteCalled).toBe(true);
    expect(hotFlags.connectCtrlZCalled).toBe(true);
  });
});
