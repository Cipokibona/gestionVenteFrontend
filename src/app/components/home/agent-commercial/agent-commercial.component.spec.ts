import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCommercialComponent } from './agent-commercial.component';

describe('AgentCommercialComponent', () => {
  let component: AgentCommercialComponent;
  let fixture: ComponentFixture<AgentCommercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCommercialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCommercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
