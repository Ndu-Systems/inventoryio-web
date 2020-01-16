import { Component, OnInit } from '@angular/core';
import { Partner, User } from 'src/app/_models';
import { AccountService, PartnerService, SpinnerService, BannerService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'ts-xlsx';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-import-partners',
  templateUrl: './import-partners.component.html',
  styleUrls: ['./import-partners.component.scss']
})
export class ImportPartnersComponent implements OnInit {
  file: File;
  arrayBuffer: any;
  user: User;
  isConfirmingImportNow: boolean;
  partners: Partner[] = [];
  PartnerToBeCreated: number;
  PartnerToBeUpdated = 0;
  partnerType = 'customer';
  type;


  constructor(private accountService: AccountService,
    private partnerService: PartnerService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private routeTo: Router,
    private activatedRoute: ActivatedRoute,
    private bannerService: BannerService

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.type = r.id;
      this.partnerType = this.type.slice(0, -1);

    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
  }
  onFileSelect(event) {
    this.file = null;
    this.file = event.target.files[0];
    this.Upload(this.file);

  }
  Upload(file) {
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
      const allData: Partner[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.mapPartners(allData);
    };
    fileReader.readAsArrayBuffer(file);
  }

  mapPartners(filePartners: Partner[]) {
    filePartners.forEach(fp => {
      const newProd: any = {
        Name: fp.Name,
        CellphoneNumber: fp.CellphoneNumber,
        Surname: fp.Surname,
        Password: '',
        EmailAddress: fp.EmailAddress,
        Address: fp.Address,
        PartnerType: this.partnerType,
        CompanyId: this.user.CompanyId,
        CreateUserId: this.user.UserId,
        StatusId: 1,
        ModifyUserId: this.user.UserId

      };
      this.partners.push(newProd);
    });
    this.isConfirmingImportNow = true;
    this.PartnerToBeCreated = this.partners.length;
    console.log(this.partners);

  }

  save() {
    this.partnerService.addPartnersRange(this.partners).subscribe(r => {
      this.partnerService.getPartners(this.user.CompanyId);
      this.spinnerService.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Partners created '
      });
      this.routeTo.navigate([this.bannerService.currentBannerValue.backto]);
    });


  }
  cancel() {
    this.partners = [];
    this.file = null;
    this.isConfirmingImportNow = false;
  }
}
