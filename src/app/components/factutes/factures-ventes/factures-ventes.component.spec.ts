import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturesVentesComponent } from './factures-ventes.component';

describe('FacturesVentesComponent', () => {
  let component: FacturesVentesComponent;
  let fixture: ComponentFixture<FacturesVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturesVentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturesVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
