import { Component, OnInit } from '@angular/core';
import { OrdersService, AccountService } from 'src/app/_services';
import { User } from 'src/app/_models';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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

  constructor(
    private ordersService: OrdersService,
    private accountService: AccountService,
    private router: Router,
    private messageService: MessageService,

  ) {

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
    this.getSalesReportsForToday();
  }

  getSalesReportsForToday() {
    const orders = this.ordersService.currentOrdersValue;
    console.log('orders', orders);
    const ordersToday = orders.filter(x => this.getDate(new Date(x.CreateDate)) === this.getDate(new Date()));
    console.log('ordersToday', ordersToday);
    this.mainReportLineData = ordersToday.map(x => Number(x.Total));
    this.intLineGraph();

  }
  getDate(date: Date) {
    const val = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    console.log(date, val);

    return val;
  }
  intLineGraph() {
    this.linedata = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Sales Today',
          data: [18000, 1500, 1350, 2200, 5000, 9900, 21000],
          fill: false,
          borderColor: '#4cd137'
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
}
