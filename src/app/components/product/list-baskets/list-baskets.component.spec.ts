import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBasketsComponent } from './list-baskets.component';

describe('ListBasketsComponent', () => {
  let component: ListBasketsComponent;
  let fixture: ComponentFixture<ListBasketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBasketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBasketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
