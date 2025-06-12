import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseBordereauComponent } from './caisse-bordereau.component';

describe('CaisseBordereauComponent', () => {
  let component: CaisseBordereauComponent;
  let fixture: ComponentFixture<CaisseBordereauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaisseBordereauComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaisseBordereauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
