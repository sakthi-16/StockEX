import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  MyStocksComponent } from './my-stocks.component';

describe('MyStocksComponent ', () => {
  let component: MyStocksComponent;
  let fixture: ComponentFixture<MyStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyStocksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
