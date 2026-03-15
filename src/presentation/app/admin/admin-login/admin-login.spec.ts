import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLogin } from './admin-login';
import { AuthService } from '../../../../presentation/app/shared/services/auth-service';

const authServiceMock = {
  // ajustá nombres a tu AuthService real
  login: jasmine.createSpy('login').and.resolveTo(true),
  logout: jasmine.createSpy('logout'),
  user$: undefined,
  isAdmin$: undefined,
};

describe('AdminLogin', () => {
  let component: AdminLogin;
  let fixture: ComponentFixture<AdminLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLogin],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});