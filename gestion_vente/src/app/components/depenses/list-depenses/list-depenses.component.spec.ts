import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDepensesComponent } from './list-depenses.component';

describe('ListDepensesComponent', () => {
  let component: ListDepensesComponent;
  let fixture: ComponentFixture<ListDepensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDepensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDepensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
