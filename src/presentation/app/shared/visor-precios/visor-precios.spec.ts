import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorPrecios } from './visor-precios';

describe('VisorPrecios', () => {
  let component: VisorPrecios;
  let fixture: ComponentFixture<VisorPrecios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorPrecios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorPrecios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
