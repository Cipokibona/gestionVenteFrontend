import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToPointOfSellComponent } from './to-point-of-sell.component';

describe('ToPointOfSellComponent', () => {
  let component: ToPointOfSellComponent;
  let fixture: ComponentFixture<ToPointOfSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToPointOfSellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToPointOfSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
