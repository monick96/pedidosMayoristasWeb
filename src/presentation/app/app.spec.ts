import { TestBed } from '@angular/core/testing';
import { App } from './app';

import { GetConfigRuleUseCase } from '../../aplication/use-cases/GetConfigRuleUseCase';
import { UpdateRuleConfigUseCase } from '../../aplication/use-cases/UpdateRuleConfigUseCase';
import { ok } from '../../shared/Result';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: GetConfigRuleUseCase,
          useValue: {
            execute: jasmine.createSpy().and.resolveTo(
              ok({
                minimoGeneral: 0,
                minimoConCombos: 0,
                escalas: [],
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
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});