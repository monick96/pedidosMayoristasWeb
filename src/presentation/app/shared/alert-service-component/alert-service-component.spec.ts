import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertServiceComponent } from './alert-service-component';

describe('AlertServiceComponent', () => {
  let component: AlertServiceComponent;
  let fixture: ComponentFixture<AlertServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
