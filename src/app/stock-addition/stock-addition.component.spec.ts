import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdditionComponent } from './stock-addition.component';

describe('StockAdditionComponent', () => {
  let component: StockAdditionComponent;
  let fixture: ComponentFixture<StockAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
