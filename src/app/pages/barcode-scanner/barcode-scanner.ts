import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Barcode, BarcodeFormat, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { StockService } from '../../services/stock.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Stock } from '../../models/stocks';
import { GeneralServices } from '../../services/general-services';


@Component({
  selector: 'page-barcode-scanner',
  templateUrl: 'barcode-scanner.html',
  styleUrls: ['./barcode-scanner.scss'],
})
export class BarcodeScannerPage implements OnInit {
  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;
  public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;
  isScanned: boolean = false;
  stock: Stock;
  id: number = 0;
  newStockQTY: number = 0;

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Front),
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });

  constructor(private readonly ngZone: NgZone,
    private stockService: StockService,
    private generalService: GeneralServices) {

  }

  public ngOnInit(): void {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
    BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
            const { state, progress } = event;
            this.formGroup.patchValue({
              googleBarcodeScannerModuleInstallState: state,
              googleBarcodeScannerModuleInstallProgress: progress,
            });
          });
        }
      );
    });
  }

  public async scan(): Promise<void> {
    const formats = this.formGroup.get('formats')?.value || [];
    const { barcodes } = await BarcodeScanner.scan({
      formats,
    });
    this.barcodes = barcodes;
    this.isScanned = true;
    this.getStockByScan()
  }

  public async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  public async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions();
  }

  getStockByInput() {
    try {
      this.stockService.getStock(this.id).subscribe((result: any) => {
        this.stock = result;
        this.generalService.presentToast(`Found: ${this.stock.stockName}`, 5000);
        this.isScanned = true;
      })
    } catch (error) {
      this.generalService.presentToast(`Error finding stock: ${error}`, 5000);
    }
  }

  getStockByScan() {
    if (this.barcodes) {
      const barcodeValue = this.barcodes[0].rawValue;
      const parts = barcodeValue.split('-');
      if (parts.length > 1) {
        this.id = parseInt(parts[1], 10); // Parse the number after the hyphen
        console.log('Extracted ID:', this.id);
        this.generalService.presentToast(`Extracted ID: ${this.id}`, 5000);

      } else {
        console.log('Barcode value does not contain a hyphen.');
        this.generalService.presentToast(`Invalid format`, 5000);
      }

      try {
        this.stockService.getStock(this.id).subscribe((result: any) => {
          this.stock = result;
          this.generalService.presentToast(`Found: ${this.stock.stockName}`, 5000);
          this.isScanned = true;
        })
      } catch (error) {
        this.generalService.presentToast(`Error finding stock: ${error}`, 5000);
      }
    }
  }

  updateStock() {
    this.stock.qtyOnHand = this.stock.qtyOnHand + this.newStockQTY;
    this.stockService.editStock(this.id, this.stock).subscribe({
      next: (value: any) => { },
      error: (response: HttpErrorResponse) => {
        if (response.status == 200) {
          this.generalService.presentToast(`${this.stock.stockName} quantity updated`, 5000);
          this.stock = undefined;
          this.isScanned = false;
        }
        else {
          this.generalService.presentToast(`Error occured updating stock`, 5000);
        }
      },
    })
  }
}

