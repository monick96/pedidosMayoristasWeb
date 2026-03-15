import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelesModal } from './niveles-modal';

import { GetConfigRuleUseCase } from '../../../../aplication/use-cases/GetConfigRuleUseCase';
import { UpdateRuleConfigUseCase } from '../../../../aplication/use-cases/UpdateRuleConfigUseCase';
import { ok } from '../../../../shared/Result';

describe('NivelesModal', () => {
  let component: NivelesModal;
  let fixture: ComponentFixture<NivelesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NivelesModal],
      providers: [
        {
          provide: GetConfigRuleUseCase,
          useValue: {
            execute: jasmine.createSpy().and.resolveTo(
              ok({
                minimoGeneral: 0,
                minimoConCombos: 0,
                escalas: [], // si tu modal espera escalas, podés poner valores reales de prueba
                telefonoWhatsapp: '',
                tiendaAbierta: true,
              })
            ),
          },
        },
        {
          provide: UpdateRuleConfigUseCase,
          useValue: { execute: jasmine.createSpy().and.resolveTo(ok(undefined)) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NivelesModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});