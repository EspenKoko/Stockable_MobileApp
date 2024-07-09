import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangePrinterPage } from './exchange-printer.page';

describe('ExchangePrinterPage', () => {
  let component: ExchangePrinterPage;
  let fixture: ComponentFixture<ExchangePrinterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExchangePrinterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
