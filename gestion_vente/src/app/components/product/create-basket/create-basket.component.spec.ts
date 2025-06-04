import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBasketComponent } from './create-basket.component';

describe('CreateBasketComponent', () => {
  let component: CreateBasketComponent;
  let fixture: ComponentFixture<CreateBasketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBasketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
