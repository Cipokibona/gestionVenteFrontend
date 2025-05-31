import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWalletComponent } from './list-wallet.component';

describe('ListWalletComponent', () => {
  let component: ListWalletComponent;
  let fixture: ComponentFixture<ListWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListWalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
