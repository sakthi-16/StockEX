import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAdditionComponent } from './account-addition.component';

describe('AccountAdditionComponent', () => {
  let component: AccountAdditionComponent;
  let fixture: ComponentFixture<AccountAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountAdditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
