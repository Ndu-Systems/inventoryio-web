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
import { Config } from 'src/app/_models/Config';

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
  showCart;
  searchByCatergory = '';
  width: number;
  notFoundModel: NotFoundModel;
  searchCustomer;
  customerSuggestions = [];
  // results = [];

  selectedCustomerId = '';
  customers: Partner[] = [];
  customers$: Observable<Array<Partner>>;
  showScan: boolean;
  showChangeCustomer: boolean;
  selectedPartner: Partner;

  // order options
  productOptions: OrderOptions[] = [];
  shippingsList = [];
  selectedShippingMethod: any;
  deliveryFee = 0;
  shippings: Config[] = [];
  currency = 'R';
  productForAttributes: Product;
  selectProductQnty = 1;
  customerNotFound: boolean;
  Notes: string;



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
      // this.getDeviceSize();
      const categories = data.map(c => c.Catergory && c.Catergory.Name || '') || [];
      this.categories = categories.filter((item, index) => categories.indexOf(item) === index);
      this.categories = this.categories.filter(c => c !== '' && c !== undefined && c !== null);
    });


    this.saleService.sell.subscribe(state => {
      this.sale = state;
      if (this.sale && this.sale.Customer) {
        this.selectedPartner = this.sale.Customer;
      } else {
        this.selectedPartner = {
          PartnerId: '',
          CompanyId: '',
          PartnerType: '',
          Name: '',
          Surname: '',
          CellphoneNumber: '',
          EmailAddress: '',
          Password: '',
          Address: '',
          CreateDate: '',
          CreateUserId: '',
          ModifyDate: '',
          ModifyUserId: '',
          StatusId: 1
        };
      }
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

    if (this.user.Company.Shipping) {
      this.shippings = this.user.Company.Shipping;
      this.groupShipping();
    }

    this.bannerService.cartModal.subscribe(data => {
      this.showCart = data;
    });
    this.Notes = localStorage.getItem('Notes') || '';
  }
  add() {
    this.router.navigate(['/dashboard/product']);
  }
  doSell(product: Product) {
    if (!this.sale) {
      this.saleService.updateState({
        items: [],
        total: 0,
        companyId: ''
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
        checkOptionMatch.quantity += Number(product.QuantitySelected);
        this.saleService.doSellLogic(checkOptionMatch);

      } else {
        // create a new item in to the cart
        this.saleService.doSellLogic(
          {
            prodcuId: product.ProductId,
            companyId: this.user.CompanyId,
            name: product.Name,
            price: Number(product.UnitPrice),
            quantity: Number(product.QuantitySelected),
            image: product.Images && product.Images[0].Url,
            options: JSON.parse(this.getProductSelectedItemsString(product))
          });
      }
    }
    this.closeOptions();
    this.productOptions = [];
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

    // if (!this.selectedShippingMethod && this.shippings.length > 0) {
    //   this.messageService.add({
    //     severity: 'warn',
    //     summary: 'Shipping Method not selected',
    //     detail: 'Please select shipping method before you checkout.'
    //   });
    //   return false;
    // }
    if (this.customerNotFound) {
      console.log(this.selectedPartner);
      const partnerToAdd: Partner = {
        EmailAddress: this.selectedPartner.EmailAddress,
        Name: this.selectedPartner.Name,
        CellphoneNumber: this.selectedPartner.EmailAddress,
        Address: this.selectedPartner.Address,
        Surname: this.selectedPartner.Surname,
        Password: 'na',
        PartnerType: 'customer',
        CompanyId: this.user.CompanyId,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
      };
      this.partnerService.addPartnerSync(partnerToAdd).subscribe(data => {
        this.selectedPartner = data;
        this.sale.charges = [this.selectedShippingMethod];
        this.saleService.updateState(this.sale);
        const order: Orders = {
          CompanyId: this.user.CompanyId,
          ParntersId: data.PartnerId,
          ParntersEmail: data.EmailAddress,
          OrderType: 'Sell',
          Total: this.sale.total,
          Paid: 0,
          Due: this.sale.total,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          Status: 'new',
          StatusId: 1
        };

        const shipment = {
          ConfigId: '',
          CompanyId: this.user.CompanyId,
          Name: 'shippingFee',
          Label: this.sale.charges[0] && this.sale.charges[0].line || '',
          Type: 'shippingFee',
          GroupKey: '',
          Value: this.sale.charges[0] && this.sale.charges[0].amount || '',
          IsRequired: true,
          FieldType: 'string',
          CreateUserId: 'system',
          ModifyUserId: 'system',
          StatusId: 1
        };
        order.Charges = [shipment];
        order.Notes = this.Notes || '';
        localStorage.setItem('Notes', this.Notes);

        console.log(order);
        console.log('items', this.sale.items);
        this.ordersService.addOrder(order, this.sale.items);
        this.updateProductsRange(this.sale.items);
        // clear state
        this.saleService.clearState();
        this.ordersService.updateOrderState(null);
        this.ordersService.updateOrderProductsState(null);
        this.router.navigate(['/dashboard/list-orders']);
      });
    } else {
      this.sale.charges = [this.selectedShippingMethod];
      this.saleService.updateState(this.sale);
      const order: Orders = {
        CompanyId: this.user.CompanyId,
        ParntersId: this.selectedPartner && this.selectedPartner.PartnerId || null,
        ParntersEmail: this.selectedPartner && this.selectedPartner.EmailAddress || null,
        OrderType: 'Sell',
        Total: this.sale.total,
        Paid: 0,
        Due: this.sale.total,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        Status: 'new',
        StatusId: 1
      };

      const shipment = {
        ConfigId: '',
        CompanyId: this.user.CompanyId,
        Name: 'shippingFee',
        Label: this.sale.charges[0] && this.sale.charges[0].line || '',
        Type: 'shippingFee',
        GroupKey: '',
        Value: this.sale.charges[0] && this.sale.charges[0].amount || '',
        IsRequired: true,
        FieldType: 'string',
        CreateUserId: 'system',
        ModifyUserId: 'system',
        StatusId: 1
      };
      order.Charges = [shipment];

      console.log(order);
      console.log('items', this.sale.items);
      order.Notes = this.Notes || '';
      localStorage.setItem('Notes', this.Notes);
      this.ordersService.addOrder(order, this.sale.items);
      this.updateProductsRange(this.sale.items);
      // clear state
      this.saleService.clearState();
      this.ordersService.updateOrderState(null);
      this.ordersService.updateOrderProductsState(null);
      this.router.navigate(['/dashboard/list-orders']);
    }

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
  // getDeviceSize() {
  //   this.width = screen.width;
  //   console.log(this.width);
  //   this.showCart = this.width >= 720;
  // }
  toggleCart() {
    this.showCart = !this.showCart;
    this.bannerService.updateCartModal(this.showCart);
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
    this.selectedCustomerId = customer.PartnerId;
    if (customer.Surname) {
      customer.Surname = ' ' + customer.Surname;
    }
    customer.Name = customer.Name + customer.Surname;
    this.selectedPartner = customer;
    this.customerSuggestions = [];
    if (this.sale) {
      this.sale.Customer = customer;
    } else {
      this.sale = {
        items: [],
        total: 0,
        companyId: this.user.CompanyId,
        charges: [],
        Customer: customer,
        Shipping: null,

      };

    }

    this.saleService.updateState(this.sale);
  }


  optionSelected(valueId, attributeId, product: Product) {
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
    if (product.Attributes.filter(x => x.Values && x.Values.length > 0).length
      !== this.productOptions.filter(x => x.ProductId === product.ProductId).length) {
      this.productForAttributes = product;
      this.productForAttributes.QuantitySelected = product.QuantitySelected || 1;
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
  deliveryChanged(data) {
    if (data === 'delivery') {
      this.selectedShippingMethod = undefined;
      return false;
    }
    const cost = this.shippingsList.find(x => x.key === data);
    if (cost && !isNaN(cost.amount)) {
      this.deliveryFee = Number(cost.amount);
      this.selectedShippingMethod = cost;
    } else {
      this.deliveryFee = 0;
      this.selectedShippingMethod = cost;
    }
    console.log(cost);


  }
  groupShipping() {
    const groupedItems: { key: string, data: Config[] }[] = [];
    this.shippings.forEach(item => {
      if (!groupedItems.find(x => x.key === item.GroupKey)) {
        groupedItems.push({
          data: this.shippings.filter(x => x.GroupKey === item.GroupKey),
          key: item.GroupKey
        });
      }
    });
    // console.log('nn', groupedItems);
    groupedItems.forEach(x => {
      x.data.forEach(vals => { });
      let item =
        `${this.findConfigByName('name', x.data)}-  ${this.currency}${this.findConfigByName('amount', x.data)}`;
      if (isNaN(this.findConfigByName('amount', x.data))) {
        item = `${this.findConfigByName('name', x.data)}- ${this.findConfigByName('amount', x.data)}`;
      }
      this.shippingsList.push({
        line: item,
        amount: this.findConfigByName('amount', x.data),
        key: this.findConfigKeyByName('amount', x.data),
      });

    });
  }

  findConfigByName(name: string, items) {
    return (items.find(x => x.Name === name).Value || '').trim();
  }
  findConfigKeyByName(name: string, items) {
    return items.find(x => x.Name === name).GroupKey;
  }
  searchCustomers(key: string) {
    if (key) {
      this.customerSuggestions = this.customers.filter(
        x => x.Name.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
          x.Surname.toLocaleLowerCase().includes(key.toLocaleLowerCase())
      );
    }

    if (this.customerSuggestions.length === 0) {
      this.customerNotFound = true;
      this.selectCustomer(this.selectedPartner);
    }
  }

  closeOptions() {
    this.productForAttributes = null;
  }
  selectProductQntyAdjust(product: Product, key) {
    if (!product.QuantitySelected) {
      product.QuantitySelected = 1;
    }
    if (Number(key) === 1) {
      product.QuantitySelected++;
    } else {
      if (this.selectProductQnty > 0) {
        product.QuantitySelected--;
      }
    }
  }
}

