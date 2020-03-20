import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, SellModel, Orders, User, Item, NotFoundModel, Partner } from 'src/app/_models';
import {
  ProductService, AccountService, BannerService, SaleService, OrdersService,
  PartnerService, ScannerService
} from 'src/app/_services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { NotFoundConstants } from '../../shared';
import { OrderOptions } from 'src/app/_models/order.options.model';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  search: string;
  products$: Observable<Product[]>;
  sale: SellModel;
  user: User;
  products: Product[];
  categories: string[] = [];
  showCart = true;
  searchByCatergory;
  width: number;
  notFoundModel: NotFoundModel;
  searchCustomer;
  // results = [];

  selectedCustomerId = '';
  customers: Partner[] = [];
  customers$: Observable<Array<Partner>>;
  showScan: boolean;
  showChangeCustomer: boolean;
  selectedPartner: Partner;

  // order options
  productOptions: OrderOptions[] = [];


  constructor(
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private bannerService: BannerService,
    private saleService: SaleService,
    private messageService: MessageService,
    private ordersService: OrdersService,
    private partnerService: PartnerService,
    private scannerService: ScannerService
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.checkSession();
    this.productService.getProducts(this.user.CompanyId);
    this.products$ = this.productService.products;
    this.productService.products.subscribe(data => {
      this.products = data;
      this.getDeviceSize();
      const categories = data.map(c => c.Catergory && c.Catergory.Name || '') || [];
      this.categories = categories.filter((item, index) => categories.indexOf(item) === index);
      this.categories = this.categories.filter(c => c !== '' && c !== undefined && c !== null);
    });


    this.saleService.sell.subscribe(state => {
      this.sale = state;
    });

    this.notFoundModel = {
      Image: NotFoundConstants.NOT_FOUND_SALES.image,
      Message: NotFoundConstants.NOT_FOUND_SALES.message
    };
    this.partnerService.getPartners(this.user.CompanyId);
    this.partnerService.partners.subscribe(data => {
      this.customers = data;
    });
    this.customers$ = this.partnerService.partners;
    this.scannerService.scann.subscribe(scan => {
      if (scan) {
        this.showScan = scan.isOpen;
        if (scan.code && window.location.href.includes('sell')) {
          const product = this.products.find(x => x.Code === scan.code);
          if (product) {
            this.doSell(product);
          }
        }

      }
    });
  }
  add() {
    this.router.navigate(['/dashboard/add-product']);
  }
  doSell(product: Product) {
    if (!this.sale) {
      this.saleService.updateState({
        items: [],
        total: 0
      });
    }
    if (this.sale) {
      if ((product.QuantityAvailable <= 0) || (Number(product.Quantity) <= 0)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Stock Alert.',
          detail: `You have run out of  ${product.Name}`
        });
        return false;
      }

      if (!this.checkIfProductOptionsAreSelected(product)) {
        return false;
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Added to cart',
        detail: `${product.Name} Added`
      });

      // find out if  I have the item in the cart already 

      const items = this.sale.items.filter(x => x.prodcuId === product.ProductId);

      //  does the product have  select options?
      const selectedProductOptions = this.productOptions.filter(x => x.ProductId === product.ProductId);

      // Does existing item have exatly match on the options?
      const checkOptionMatch = items.find(x => JSON.stringify(x.options) === JSON.stringify(selectedProductOptions));

      // if the item is a dublicate just inclease quantity
      if (checkOptionMatch) {
        checkOptionMatch.quantity++;
        this.saleService.doSellLogic(checkOptionMatch);

      } else {
        // create a new item in to the cart
        this.saleService.doSellLogic(
          {
            prodcuId: product.ProductId,
            name: product.Name,
            price: Number(product.UnitPrice),
            quantity: Number(1),
            image: product.images && product.images[0].Url,
            options: JSON.parse(this.getProductSelectedItemsString(product))
          });
      }
    }
  }
  clear() {
    this.saleService.clearState();
  }
  onSubmit() {
    if (!this.sale.total) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty cart',
        detail: 'Add items in the cart to continue'
      });
      return false;
    }
    this.ordersService.updateOrderState(null);
    const order: Orders = {
      CompanyId: this.user.CompanyId,
      ParntersId: this.selectedPartner && this.selectedPartner.PartnerId || null,
      OrderType: 'Sell',
      Total: this.sale.total,
      Paid: 0,
      Due: this.sale.total,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'new',
      StatusId: 1
    };
    console.log(order);
    console.log('items', this.sale.items);
    this.ordersService.addOrder(order, this.sale.items);
    this.updateProductsRange(this.sale.items);
    // clear state
    this.saleService.clearState();
    this.ordersService.updateOrderState(null);
    this.ordersService.updateOrderProductsState(null);
    this.router.navigate(['/dashboard/list-orders']);
  }

  updateProductsRange(items: Item[]) {
    const products: Product[] = [];
    items.forEach(item => {
      const product = this.products.find(x => x.ProductId === item.prodcuId);
      product.Quantity = Number(product.Quantity) - Number(item.quantity);
      product.TrackInventory = true;
      products.push(product);
    });
    this.productService.updateProductRange(products);
  }
  details(product: Product) {
    this.productService.updateCurrentProduct(product);
    this.bannerService.updateState({
      backto: '/dashboard/sell',
    });
    this.router.navigate([`/dashboard/product-details`]);
  }
  clearSearch() {
    this.search = '';
  }
  getDeviceSize() {
    this.width = screen.width;
    console.log(this.width);
    this.showCart = this.width >= 720;
  }
  toggleCart() {
    this.showCart = !this.showCart;
  }
  addCustomer() {
    this.bannerService.updateState({
      backto: `/dashboard/sell`,
    });
    this.router.navigate(['/dashboard/add-partner/customers']);
  }
  scann() {
    this.showScan = true;
  }
  changeCustomer() {
    this.showChangeCustomer = true;
  }
  selectCustomer(customer: Partner) {
    this.selectedPartner = customer;
    this.showChangeCustomer = false;
  }

  optionSelected(valueId, attributeId, product: Product) {
    // if (!this.checkIfPrevItemIsAddedToCart(product.ProductId)) {
    //   return false;
    // }

    const selectValueId = Number(valueId);
    if (this.productOptions.find(x => x.OptionId === attributeId)) {
      this.productOptions = this.productOptions.filter(x => x.OptionId !== attributeId);
    }
    const attribute = product.Attributes.find(x => x.AttributeId === attributeId);
    const itemOptionn: OrderOptions = {
      Id: '1',
      OrderId: 'na',
      ProductId: product.ProductId,
      OrderProductId: 'na',
      OptionId: attributeId,
      ValueId: selectValueId,
      OptionValue: attribute.Values.find(x => Number(x.Id) === selectValueId).AttributeValue,
      OptionName: attribute.Name,
      ValuePrice: product.UnitPrice,
      ValueIdQty: product.Quantity,
      CompanyId: this.user.CompanyId,
      CreateUserId: 'customer',
      ModifyUserId: 'customer',
      StatusId: 1
    };
    this.pushOptions(itemOptionn);
    console.log(this.productOptions);

  }

  pushOptions(orderOption: OrderOptions) {
    if (!this.productOptions.find(x => x.OptionId === orderOption.OptionId && x.ValueId === orderOption.ValueId)) {
      this.productOptions.push(orderOption);
    }
  }

  checkIfPrevItemIsAddedToCart(productId) {
    if (this.productOptions.length > 0 && !this.productOptions.find(x => x.ProductId === productId)) {
      const unsavedProduct = this.products.find(x => x.ProductId === this.productOptions[0].ProductId);
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty cart',
        life: 10000,
        detail: `Please ADD TO CART ${unsavedProduct.Name} first, or deselect all options.`
      });

      return false;
    }
    return true;
  }


  checkIfProductOptionsAreSelected(product: Product) {
    if (product.Attributes.length !== this.productOptions.filter(x => x.ProductId === product.ProductId).length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty cart',
        life: 10000,
        detail: `Please select all options for ${product.Name}, before adding it to cart.`
      });

      return false;
    }
    return true;
  }

  getProductSelectedItemsString(product: Product) {
    const optionsForAproduct = this.productOptions.filter(x => x.ProductId === product.ProductId);
    if (optionsForAproduct.length) {
      return JSON.stringify(optionsForAproduct);
    }

    return '[]';
  }


  // mapitemOptionsToOrderOptions(items: Item[]): OrderOptions[] {
  //   const options: OrderOptions[] = [];
  //   items.forEach(item => {

  //     item.options.forEach(itemOpt => {
  //       const optionsItem: OrderOptions = {
  //         // OrderId: '0',
  //         // ProductId: itemOpt.productId,
  //         // OrderProductId: '0',
  //         // OptionId: itemOpt.optionId,
  //         // ValueId:  itemOpt.valueId,
  //         // OptionValue: itemOpt.value,
  //         // OptionName: itemOpt.optionName,
  //         // ValuePrice: 0,
  //         // ValueIdQty: 0,
  //         // CompanyId: this.user.CompanyId,
  //         // CreateUserId: 'customer',
  //         // ModifyUserId: 'customer',
  //         // StatusId: 1


  //           Id: '1',
  //           OrderId: 'bc2497d5-6a76-11ea-aee0-48f17f8d4d88',
  //           ProductId: '10f18237-5dde-11ea-b68c-48f17f8d4d88',
  //           OptionId: '10f2eb99-5dde-11ea-b68c-48f17f8d4d88',
  //           // ValueId: itemOpt.ValueId,
  //           OptionValue: 'L',
  //           OptionName: 'Size',
  //           ValuePrice: '0',
  //           ValueIdQty: '0',
  //           CompanyId: '94c5b3cf-d170-11e9-b97c-48f17f8d4d88',
  //           CreateDate: '2020-03-20 08:47:58',
  //           CreateUserId: 'customer',
  //           ModifyDate: '2020-03-20 08:47:58',
  //           ModifyUserId: 'customer',
  //           StatusId: '1'

  //       };


  //       options.push(optionsItem);
  //     });
  //     // tslint:disable-next-line: one-variable-per-declaration

  //   });
  //   return options;
  // }

}

