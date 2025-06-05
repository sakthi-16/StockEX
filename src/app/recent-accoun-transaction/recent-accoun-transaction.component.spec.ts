import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentAccountTransactionsComponent  } from './recent-accoun-transaction.component';

describe('RecentAccounTransactionComponent', () => {
  let component: RecentAccountTransactionsComponent ;
  let fixture: ComponentFixture<RecentAccountTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentAccountTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentAccountTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
