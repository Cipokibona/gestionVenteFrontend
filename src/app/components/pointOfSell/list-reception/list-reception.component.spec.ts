import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReceptionComponent } from './list-reception.component';

describe('ListReceptionComponent', () => {
  let component: ListReceptionComponent;
  let fixture: ComponentFixture<ListReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListReceptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
