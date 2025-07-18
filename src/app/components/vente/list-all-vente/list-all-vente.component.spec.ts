import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllVenteComponent } from './list-all-vente.component';

describe('ListAllVenteComponent', () => {
  let component: ListAllVenteComponent;
  let fixture: ComponentFixture<ListAllVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllVenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
