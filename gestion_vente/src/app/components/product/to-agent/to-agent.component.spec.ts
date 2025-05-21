import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToAgentComponent } from './to-agent.component';

describe('ToAgentComponent', () => {
  let component: ToAgentComponent;
  let fixture: ComponentFixture<ToAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
