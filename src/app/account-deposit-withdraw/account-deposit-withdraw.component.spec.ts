import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDepositWithdrawComponent } from './account-deposit-withdraw.component';

describe('AccountDepositWithdrawComponent', () => {
  let component: AccountDepositWithdrawComponent;
  let fixture: ComponentFixture<AccountDepositWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDepositWithdrawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDepositWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
