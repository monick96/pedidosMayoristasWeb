import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideCart } from './side-cart';

describe('SideCart', () => {
  let component: SideCart;
  let fixture: ComponentFixture<SideCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
