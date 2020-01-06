import { Component, OnInit } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import { Product, User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  file: File;
  arrayBuffer: any;
  user: User;

  constructor(private accountService: AccountService) { }

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
    const products: Product[] = [];
    fileProducts.forEach(fp => {
      const newProd: any = {
        ProductId: fp.ProductId,
        Name: fp.Name,
        BrandId: fp.BrandId,
        CatergoryId: fp.CatergoryId,
        Description: '',
        UnitPrice: fp.UnitPrice,
        UnitCost: fp.UnitCost,
        Code: fp.Code,
        SKU: '',
        Quantity: fp.Quantity,
        LowStock: fp.LowStock,
        CompanyId: this.user.CompanyId,
        CreateUserId: this.user.UserId,
        StatusId: 1,
        ModifyUserId: this.user.UserId

      };
      products.push(newProd);
    });
    console.log(products);
  }
}
