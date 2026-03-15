import { GetConfigRuleUseCase } from '../../../../aplication/use-cases/GetConfigRuleUseCase';
import { UpdateRuleConfigUseCase } from '../../../../aplication/use-cases/UpdateRuleConfigUseCase';
import { ok } from '../../../../shared/Result';

providers: [
  {
    provide: GetConfigRuleUseCase,
    useValue: { execute: jasmine.createSpy().and.resolveTo(ok({
      minimoGeneral: 0,
      minimoConCombos: 0,
      escalas: [],
      telefonoWhatsapp: '',
      tiendaAbierta: true,
    })) },
  },
  {
    provide: UpdateRuleConfigUseCase,
    useValue: { execute: jasmine.createSpy().and.resolveTo(ok(undefined)) },
  },
]