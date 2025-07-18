import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsForUserComponent } from './tools-for-user.component';

describe('ToolsForUserComponent', () => {
  let component: ToolsForUserComponent;
  let fixture: ComponentFixture<ToolsForUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsForUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolsForUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
