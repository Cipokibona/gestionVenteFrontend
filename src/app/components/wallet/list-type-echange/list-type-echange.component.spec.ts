import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeEchangeComponent } from './list-type-echange.component';

describe('ListTypeEchangeComponent', () => {
  let component: ListTypeEchangeComponent;
  let fixture: ComponentFixture<ListTypeEchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTypeEchangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTypeEchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
