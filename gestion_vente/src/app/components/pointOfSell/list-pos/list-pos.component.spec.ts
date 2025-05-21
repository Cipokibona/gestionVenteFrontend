import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPOSComponent } from './list-pos.component';

describe('ListPOSComponent', () => {
  let component: ListPOSComponent;
  let fixture: ComponentFixture<ListPOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPOSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
