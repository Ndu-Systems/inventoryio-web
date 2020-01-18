import { Component, OnInit } from '@angular/core';
import { OrdersService, AccountService, ReportsService } from 'src/app/_services';
import { User, OrderProducts, Orders, TopSellingProduct, Qoutation } from 'src/app/_models';
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
  itemsSold: any = '00';
  topSelling: TopSellingProduct[];
  topSellingTop5: TopSellingProduct[] = [];
  quotes: Qoutation[];
  quotesSum: number;

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
    this.qoutationService.getQoutations(this.user.CompanyId);
    this.orders = this.ordersService.currentOrdersValue;
    this.ordersService.orders.subscribe(orders => {
      this.orders = orders;
    });
    this.ordersService.allOrderProducts.subscribe(topSelling => {
      this.topSelling = topSelling;
      this.getTop5();
    });
    this.qoutationService.qoutations.subscribe(quotes => {
      this.quotes = quotes;
      this.quotesSum = this.getTotal(quotes.map(x => Number(x.Total)));
    });
    this.dateRangeChanged();
    this.topSelling = this.ordersService.currentAllProductOrdersValue;
    this.getTop5();
  }

  getDate(date: Date) {
    const val = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    console.log(date, val);

    return val;
  }
  intLineGraph(vals, labels) {
    this.linedata = {
      // labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      labels,
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
      summary: 'Order Value',
      detail: `R ${this.linedata.datasets[event.element._datasetIndex].data[event.element._index]}`
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
    const data = this.reportsService.getOrdersForARange(this.dateFrom, this.dateTo, this.orderOrderAsc(this.orders));
    console.log('data data data', data);
    const vals = data.map(x => Number(x.Total));
    this.totalRev = this.getTotal(vals);
    this.itemsSold = vals.length;
    const labels = this.getLabels(data);

    this.intLineGraph(vals, labels);
    this.getTagValues();
  }
  getTotal(numbers: number[]) {
    let sum = 0;
    numbers.forEach(num => {
      sum += num;
    });
    return sum;
  }

  getLabels(orders: Orders[]) {
    const results = [];
    orders.forEach(order => {
      const date = new Date(order.CreateDate);
      const day = this.getDayName(date.getDay());
      const time = order.CreateDate.split(' ')[1];
      console.log(day);

      results.push(`${day} ${time}`);
    });
    return results;
  }

  getDayName(i: number): string {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
  }

  getDayFullName(i) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i];
  }
  orderOrderAsc(orders: Orders[]) {
    return orders.sort((a, b) => (a.OrderId > b.OrderId) ? 1 : ((b.OrderId > a.OrderId) ? -1 : 0));
  }
  getTagValues() {
    const days = this.reportsService.getDateDiffInDays(this.dateFrom, this.dateTo);
    this.reportTag = `PAST ${days} DAYS REPORT`;

    if (days === 0) {
      this.reportTag = `Today's report`;
    }
    if (days === 1) {
      this.reportTag = `yesterday REPORT`;
    }
  }
  getTop5() {
    this.topSellingTop5 = [];
    if (this.topSelling.length <= 5) {
      this.topSellingTop5 = this.topSelling;
      return;
    }
    let index = 0;
    this.topSelling.forEach(d => {
      index++;
      if (index <= 5) {
        this.topSellingTop5.push(d)
      }
    });
  }
}
