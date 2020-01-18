import { Component, OnInit } from '@angular/core';
import { OrdersService, AccountService, ReportsService } from 'src/app/_services';
import { User, OrderProducts, Orders } from 'src/app/_models';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { QoutationService } from 'src/app/_services/dashboard/qoutation.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  data: { labels: string[]; datasets: { data: number[]; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; };
  user: User;
  mainReportLineData: number[] = [];
  linedata: any;
  rangeDates: Date[];
  calendarStyle: any;

  dateTo;
  dateFrom;
  reportTag;
  items: OrderProducts[];
  orders: Orders[];
  totalRev: any = '00';

  constructor(
    private ordersService: OrdersService,
    private accountService: AccountService,
    private router: Router,
    private messageService: MessageService,
    private reportsService: ReportsService,
    private qoutationService: QoutationService,

  ) {
    this.dateTo = this.shortDate(new Date());
    this.dateFrom = this.shortDate(new Date());
    this.reportTag = `Today's report`;
  }
  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user.UserId) { this.router.navigate(['sign-in']); }
    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
    };
    this.initStyles();
    this.ordersService.getOrders(this.user.CompanyId);
    this.orders = this.ordersService.currentOrdersValue;
  }

  getDate(date: Date) {
    const val = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    console.log(date, val);

    return val;
  }
  intLineGraph(vals) {
    this.linedata = {
      // labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      labels: vals,
      datasets: [
        {
          label: 'Sales Today',
          data: vals,
          fill: false,
          borderColor: '#8e44ad'
        }
      ]
    };
  }

  selectData(event) {
    this.messageService.add({
      severity: 'info',
      summary: 'Data Selected',
      detail: this.linedata.datasets[event.element._datasetIndex].data[event.element._index]
    });
  }
  initStyles() {
    this.calendarStyle = { border: 'none' };
  }

  shortDate(date: Date) {

    const monthNames = ['Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // return '' + day + '-' + monthNames[monthIndex] + '-' + year;
    return year + '-' + monthIndex + 1 + '-' + day;
  }
  dateRangeChanged() {
    const data = this.reportsService.getOrdersForARange(this.dateFrom, this.dateTo, this.orders);
    console.log('data data data', data);
    const vals = data.map(x => Number(x.Total));
    this.totalRev = this.getTotal(vals);

    this.intLineGraph(vals);
  }
  getTotal(numbers: number[]) {
    let sum = 0;
    numbers.forEach(num => {
      sum += num;
    });
    return sum;
  }
}
