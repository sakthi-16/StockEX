import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  AllStocksTransactionsComponent  } from './all-transaction.component';

describe(' AllStocksTransactionsComponent ', () => {
  let component: AllStocksTransactionsComponent ;
  let fixture: ComponentFixture< AllStocksTransactionsComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AllStocksTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent( AllStocksTransactionsComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
