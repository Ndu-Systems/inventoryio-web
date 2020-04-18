import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Orders, OrderProducts, Item, Product, SellModel, Partner, Company } from 'src/app/_models';
import { HttpClient } from '@angular/common/http';
import { SplashService } from '../../splash.service';
import { environment } from 'src/environments/environment';
import { COMMON_CONN_ERR_MSG } from 'src/app/_shared';
import { ProductService } from '../..';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private _sell: BehaviorSubject<SellModel>;
  public sell: Observable<SellModel>;

  private _customer: BehaviorSubject<Partner>;
  public customer: Observable<Partner>;

  private _order: BehaviorSubject<Orders>;
  public order: Observable<Orders>;


  private _company: BehaviorSubject<Company>;
  public company: Observable<Company>;




  url: string;
  constructor(
    private productService: ProductService,
    private http: HttpClient,

  ) {
    this._sell = new BehaviorSubject<SellModel>(JSON.parse(localStorage.getItem('shop_sale')));
    this.sell = this._sell.asObservable();

    this._customer = new BehaviorSubject<Partner>(JSON.parse(localStorage.getItem('shop_customer')));
    this.customer = this._customer.asObservable();

    this._order = new BehaviorSubject<Orders>(JSON.parse(localStorage.getItem('shop_order')));
    this.order = this._order.asObservable();


    this._company = new BehaviorSubject<Company>(JSON.parse(localStorage.getItem('shop_company')));
    this.company = this._company.asObservable();


    this.url = environment.API_URL;

  }

  public get currentSellModelValue(): SellModel {
    return this._sell.value;
  }

  public get currentCompany(): Company {
    return this._company.value;
  }

  updateState(data: SellModel) {
    if (data) {
      this.calculateTotal();
      this._sell.next(data);
      localStorage.setItem('shop_sale', JSON.stringify(data));
    }

  }

  updateOrderState(data: Orders) {
    if (data) {
      this._order.next(data);
      localStorage.setItem('shop_order', JSON.stringify(data));
    }

  }
  updateCompanyState(data: Company) {
    if (data) {
      this._company.next(data);
      localStorage.setItem('shop_company', JSON.stringify(data));
    }

  }

  updateCustomerState(data: Partner) {
    if (data) {
      this.calculateTotal();
      this._customer.next(data);
      localStorage.setItem('shop_customer', JSON.stringify(data));
    }

  }

  clearState() {
    this.updateState({
      items: [],
      total: 0,
      companyId: ''
    });
  }

  doSellLogic(item: Item, CompanyId: string) {
    let sale: SellModel;
    if (this.currentSellModelValue) {
      sale = this.currentSellModelValue;
    } else {
      this.updateState({
        items: [],
        total: 0,
        companyId: ''
      });
      sale = this.currentSellModelValue;
    }
    const checkIfOtemExist = sale.items.find(x => x.prodcuId === item.prodcuId &&
      (JSON.stringify(item.options) === JSON.stringify(x.options)));
    const product = this.productService.getSigleProductFronState(item.prodcuId);


    if (checkIfOtemExist) {
      // item is on the sale already it just needs to be updated
      checkIfOtemExist.subTotal = checkIfOtemExist.quantity * item.price;
      sale.items[sale.items.indexOf(item)] = checkIfOtemExist;
      if (CompanyId === item.companyId) {
        sale.companyId = CompanyId;
      }
      this.updateState(sale);
      this.productService.appendState(product);

    } else {
      item.subTotal = item.price * item.quantity;
      sale.items.push(item);
      if (CompanyId === item.companyId) {
        sale.companyId = CompanyId;
      }
      this.updateState(sale);

    }

  }
  removeItem(item: Item) {
    if (this.currentSellModelValue) {
      const sale = this.currentSellModelValue;
      const product = this.productService.getSigleProductFronState(item.prodcuId);
      product.QuantityAvailable = item.quantity;
      this.productService.appendState(product);

      const itemToRemove = sale.items.indexOf(item);
      sale.items.splice(itemToRemove, 1);
      this.updateState(sale);
    }
  }
  calculateTotal() {
    if (this.currentSellModelValue) {
      let total = 0;
      const sale = this.currentSellModelValue;
      sale.items.forEach(item => {
        total += item.subTotal;
      });
      if (sale.charges) {
        sale.charges.forEach(x => {
          if (!isNaN(x && x.amount)) {
            total += Number(x.amount);
          }

        });
      }
      sale.total = total;
    }
  }

  // save the order
  addOrder(data: Orders, items: Item[]) {
    const productItems = [];
    items.forEach(item => {
      const productItem: OrderProducts = {
        OrderId: '0',
        ProductId: item.prodcuId,
        CompanyId: data.CompanyId,
        ProductName: item.name,
        UnitPrice: item.price,
        Quantity: item.quantity,
        subTotal: item.subTotal,
        CreateUserId: data.CreateUserId,
        ModifyUserId: data.CreateUserId,
        StatusId: 1,
        Options: item.options
      };
      productItems.push(productItem);
    });
    return this.http.post<any>(`${this.url}/api/orders/shop.php`, { order: data, products: productItems });
  }

  getAllShops(): Observable<Company[]> {
    return this.http.get<any>(`${this.url}/api/company/shops.php`);
  }
}
