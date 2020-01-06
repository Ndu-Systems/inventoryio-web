import { Component, OnInit } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import { Product, User } from 'src/app/_models';
import { AccountService, ProductService, SpinnerService } from 'src/app/_services';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  file: File;
  arrayBuffer: any;
  user: User;
  isConfirmingImportNow: boolean;
  products: Product[] = [];


  constructor(private accountService: AccountService,
    private productService: ProductService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private routeTo: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
  }
  onFileSelect(event) {
    this.file = event.target.files[0];
    this.Upload();

  }
  Upload() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const allData: Product[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.mapProducts(allData);
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  mapProducts(fileProducts: Product[]) {
    fileProducts.forEach(fp => {
      const newProd: any = {
        ProductId: fp.ProductId || '',
        Name: fp.Name || '',
        BrandId: fp.BrandId || '',
        CatergoryId: fp.CatergoryId || '',
        Description: '',
        UnitPrice: fp.UnitPrice || 0,
        UnitCost: fp.UnitCost || 0,
        Code: fp.Code || '',
        SKU: '',
        Quantity: fp.Quantity || 0,
        LowStock: fp.LowStock || 0,
        CompanyId: this.user.CompanyId,
        CreateUserId: this.user.UserId,
        StatusId: 1,
        ModifyUserId: this.user.UserId

      };
      this.products.push(newProd);
    });
    this.isConfirmingImportNow = true;
    console.log(this.products);
  }
  save() {
    this.productService.addProductRange(this.products).subscribe(r => {
      this.productService.getProducts(this.user.CompanyId);
      this.spinnerService.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'products created '
      });
      this.routeTo.navigate([`/dashboard/list-product`]);
    });


  }
  cancel() {
    this.products = [];
    this.file = null;
    this.isConfirmingImportNow = false;
  }
}
