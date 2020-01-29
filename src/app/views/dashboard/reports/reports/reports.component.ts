import { Component, OnInit } from '@angular/core';
import { OrdersService, AccountService, ReportsService, ProductService } from 'src/app/_services';
import { User, OrderProducts, Orders, TopSellingProduct, Qoutation, CountValueModel, Product } from 'src/app/_models';
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
  quotes: Qoutation[];
  quotesSum: number;
  allProductsSold: OrderProducts[];
  topSellingTop5: TopSellingProduct[] = [];
  quotesToday: any[]; // Qoutation

  // sales overview
  allOrders: CountValueModel;
  updaidOrders: CountValueModel;
  partialyOrders: CountValueModel;
  fullyOrders: CountValueModel;

  // stock 
  allproducts = 0;
  lowProducts = 0;
  allProductsItems = 0;
  canShowLowStockItems: boolean;
  lowStocktems: any[];
  canShowItemsSold: boolean;
  itemsSoldList: Orders[];
  stateHeader: string;

  constructor(
    private ordersService: OrdersService,
    private accountService: AccountService,
    private router: Router,
    private messageService: MessageService,
    private reportsService: ReportsService,
    private qoutationService: QoutationService,
    private productService: ProductService,

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
    this.ordersService.getOrderProductsByCompanyId(this.user.CompanyId);
    this.qoutationService.getQoutations(this.user.CompanyId);
    this.orders = this.ordersService.currentOrdersValue;
    this.ordersService.orders.subscribe(orders => {
      this.orders = orders;
    });
    this.ordersService.allOrderProducts.subscribe(orders => {
      this.allProductsSold = orders;
      this.dateRangeChanged();
    });

    this.qoutationService.qoutations.subscribe(quotes => {
      this.quotes = quotes;
    });
    this.dateRangeChanged();

    this.productService.products.subscribe(data => {
      this.getStockOverview(data);
    })
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
    const vals = data.map(x => Number(x.Total));
    this.totalRev = this.getTotal(vals);
    this.itemsSold = vals.length;
    this.itemsSoldList = data;
    const labels = this.getLabels(data);

    this.intLineGraph(vals, labels);
    this.getTagValues();

    // get to selling
    const tops = this.reportsService.getProductsSalesForARange(this.dateFrom, this.dateTo,
      this.orderProductsOrdersAsc(this.allProductsSold));
    this.topSellingTop5 = this.orderTopSellingByTimesDesc(this.reportsService.groupTopSelling(tops));

    // qoutes
    this.quotesToday = this.reportsService.getOrdersForARange(this.dateFrom, this.dateTo, this.orderOrderAsc(this.quotes));
    this.quotesSum = this.getTotal(this.quotesToday.map(x => Number(x.Total)));

    // sales overview
    this.allOrders = this.getOverView(data, '');
    this.updaidOrders = this.getOverView(data, 'new');
    this.partialyOrders = this.getOverView(data, 'Partially paid');
    this.fullyOrders = this.getOverView(data, 'Fully paid');
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
      const dayMonth = `${date.getDate()} ${this.getMonthName(date.getMonth())}`;
      console.log(day);

      results.push(`${day}, ${dayMonth} ${time}`);
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
    if (!orders) {
      return [];
    }
    return orders.sort((a, b) => (a.OrderId > b.OrderId) ? 1 : ((b.OrderId > a.OrderId) ? -1 : 0));
  }
  orderProductsOrdersAsc(orders: OrderProducts[]) {
    if (!orders) {
      return [];
    }
    return orders.sort((a, b) => (new Date(a.CreateDate).getDate() > new Date(b.CreateDate).getDate()) ? 1
      : ((new Date(b.CreateDate).getDate() > new Date(a.CreateDate).getDate()) ? -1 : 0));
  }
  orderTopSellingADesc(orders: TopSellingProduct[]) {
    if (!orders) {
      return [];
    }
    return orders.sort((a, b) => (Number(a.Total) > Number(b.Total)) ? 1
      : ((Number(b.Total) > Number(a.Total)) ? -1 : 0));
  }
  orderTopSellingByTimesDesc(orders: TopSellingProduct[]) {
    if (!orders) {
      return [];
    }
    return orders.sort((a, b) => (Number(a.Quantity) < Number(b.Quantity)) ? 1
      : ((Number(b.Quantity) < Number(a.Quantity)) ? -1 : 0));
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
  getMonthName(monthIndex: number) {
    const monthNames = ['Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'];
    return monthNames[monthIndex];
  }
  getOverView(orders: Orders[], status: string) {
    let data = orders.filter(x => x.Status === status);
    if (status === '') {
      data = orders;
    }
    let total = 0;
    if (status === 'Partially paid') {
      total = this.getTotal(data.map(x => Number(x.Due)));

    } else {
      total = this.getTotal(data.map(x => Number(x.Total)));

    }
    const results: CountValueModel = {
      Value: total,
      Count: data.length
    };
    return results;
  }
  getStockOverview(prodcuts: Product[]) {
    this.allproducts = prodcuts.length;
    // all items
    let totalItems = 0;
    this.lowStocktems = [];
    let lowStocktemsCount = 0;
    prodcuts.forEach(item => {
      totalItems += Number(item.Quantity);
      if (Number(item.Quantity) < Number(item.LowStock)) {
        lowStocktemsCount++;
        this.lowStocktems.push(item);
      }
    });
    this.allProductsItems = totalItems;
    this.lowProducts = lowStocktemsCount;

  }

  showLowStockItems() {
    this.canShowLowStockItems = true;
  }
  veiwItemsSold(status?: string) {
    this.itemsSoldList = this.reportsService.getOrdersForARange(this.dateFrom, this.dateTo, this.orderOrderAsc(this.orders));
    this.canShowItemsSold = true;
    this.stateHeader = 'Items Sold';
    if (status) {
      this.itemsSoldList = this.itemsSoldList.filter(x => x.Status === status);
      this.stateHeader = status;
    }
  }
}
