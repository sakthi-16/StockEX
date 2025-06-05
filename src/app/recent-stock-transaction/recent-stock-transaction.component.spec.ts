import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentStocksTransactionsComponent } from './recent-stock-transaction.component';

describe('RecentStockTransactionComponent', () => {
  let component: RecentStocksTransactionsComponent;
  let fixture: ComponentFixture<RecentStocksTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentStocksTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentStocksTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
