import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespoPosComponent } from './respo-pos.component';

describe('RespoPosComponent', () => {
  let component: RespoPosComponent;
  let fixture: ComponentFixture<RespoPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespoPosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespoPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
