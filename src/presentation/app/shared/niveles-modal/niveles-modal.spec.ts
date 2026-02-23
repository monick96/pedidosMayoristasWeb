import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelesModal } from './niveles-modal';

describe('NivelesModal', () => {
  let component: NivelesModal;
  let fixture: ComponentFixture<NivelesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NivelesModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelesModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
