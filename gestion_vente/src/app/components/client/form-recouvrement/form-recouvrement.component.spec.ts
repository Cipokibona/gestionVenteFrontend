import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRecouvrementComponent } from './form-recouvrement.component';

describe('FormRecouvrementComponent', () => {
  let component: FormRecouvrementComponent;
  let fixture: ComponentFixture<FormRecouvrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRecouvrementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRecouvrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
