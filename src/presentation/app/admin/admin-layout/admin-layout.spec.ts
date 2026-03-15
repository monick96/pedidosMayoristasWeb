import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminLayout } from './admin-layout';

import { AuthService } from '../../../../presentation/app/shared/services/auth-service';

const authServiceMock = {
  
  isLoggedIn: () => true,
  logout: jasmine.createSpy('logout'),

  // si tu layout muestra info del usuario:
  user: () => null,          // signal/computed
  user$: undefined,          //  observable
  isAdmin: () => true,       // si existe
};

describe('AdminLayout', () => {
  let component: AdminLayout;
  let fixture: ComponentFixture<AdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayout],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }, //  esto evita pedir Auth
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});