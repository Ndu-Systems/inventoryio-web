import { Component, OnInit, Input } from '@angular/core';
import { OurModuleModel } from 'src/app/_models';

@Component({
  selector: 'app-our-modules',
  templateUrl: './our-modules.component.html',
  styleUrls: ['./our-modules.component.scss']
})
export class OurModulesComponent implements OnInit {
  Key: string;

  data: OurModuleModel[] =
    [
      {
        Key: 'inventory',
        BannerImage: 'assets/images/home/modules/inventory-bg.svg',
        BannerHeader: 'Manage your product items on the go',
        BannerText: 'Say goodbye to the paper process and discover intelligent inventory management and sales.',
        Bullets: [
          {
            point: 'Manage your inventory'
          },
          {
            point: 'Track your orders & invoices'
          },
          {
            point: 'Customize your online shop'
          },
          {
            point: 'Get real time reports'
          },
        ],
        Mockups: [
          {
            main: 'manage your sales and stock.',
            // tslint:disable-next-line: max-line-length
            text: ' manage your product sales and capture orders for those products with a simple click, select and a press on that submit button.',
            img: 'assets/images/home/modules/inventory-mock-1.svg'
          },
          {
            main: 'Product onload is easy & configurable.',
            // tslint:disable-next-line: max-line-length
            text: 'We have enabled the product loading process easy to fill in with optional inputs to update later.',
            img: 'assets/images/home/modules/inventory-mock-2.svg'
          },
          {
            main: 'Update items at real time.',
            // tslint:disable-next-line: max-line-length
            text: 'Update the item with additional options.',
            img: 'assets/images/home/modules/inventory-mock-3.svg'
          },
        ]
      },
      {
        Key: 'sales',
        BannerImage: 'assets/images/home/modules/sales-bg.svg',
        BannerHeader: 'Manage item sales and quotes in no time',
        BannerText: 'Add revenue streams to your organization with seamless point of sales functionalities.',
        Bullets: [
          {
            point: 'Online sales of items'
          },
          {
            point: 'Sell to new/existing customers'
          },
          {
            point: 'Generate sale invoices/quotes'
          },
          {
            point: 'Make online partial & full payments'
          },
        ],
        Mockups: [
          {
            main: 'Online sales of items.',
            // tslint:disable-next-line: max-line-length
            text: ' manage your product sales and capture orders for those products with a simple click, select and a press on that submit button.',
            img: 'assets/images/home/modules/sale-mock-1.svg'
          },
          {
            main: 'Product onload is easy & configurable.',
            // tslint:disable-next-line: max-line-length
            text: 'We have enabled the product loading process easy to fill in with optional inputs to update later.',
            img: 'assets/images/home/modules/sale-mock-2.svg'
          },
          {
            main: 'Update items at real time.',
            // tslint:disable-next-line: max-line-length
            text: 'Update the item with additional options.',
            img: 'assets/images/home/modules/sale-mock-3.svg'
          },
        ]
      },
      {
        Key: 'crm',
        BannerImage: 'assets/images/home/modules/crm-bg.svg',
        BannerHeader: 'Manage partner relations on the system',
        BannerText: 'Manage partners such as customers or suppliers for current information.',
        Bullets: [
          {
            point: 'Bulk import on any excel'
          },
          {
            point: 'Multiple input forms for data capture'
          },
          {
            point: 'Storage in simple data tables.'
          },

        ],
        Mockups: [
          {
            main: 'Bulk import on any excel.',
            // tslint:disable-next-line: max-line-length
            text: 'We have a  pre-structured   template to import your customer information into the system.',
            img: 'assets/images/home/modules/crm-1.svg'
          },
          {
            main: 'multiple input forms for data capture.',
            // tslint:disable-next-line: max-line-length
            text: 'You can add customer information in one place so you can push your business anywhere anytime you see the opportunity..',
            img: 'assets/images/home/modules/crm-2.svg'
          },
          {
            main: 'storage in simple data tables.',
            // tslint:disable-next-line: max-line-length
            text: 'Get a tabulated view of your customers or suppliers in the system.',
            img: 'assets/images/home/modules/crm-3.svg'
          },
        ]
      },
      {
        Key: 'reporting',
        BannerImage: 'assets/images/home/modules/reporting-bg.svg',
        BannerHeader: 'Reports management',
        BannerText: 'Get a graph and statistic compilation of data presented in multiple formats.',
        Bullets: [
          {
            point: 'based on date range'
          },
          {
            point: 'sales and stock overview'
          },
        ],
        Mockups: [
          {
            main: 'Based on date range.',
            // tslint:disable-next-line: max-line-length
            text: 'Get a graphical view based on the date range selected by the user on reports.',
            img: 'assets/images/home/modules/reporting-1.svg'
          },
          {
            main: 'sales and stock overview.',
            // tslint:disable-next-line: max-line-length
            text: 'Get a data statistics view of sales and stock with alerts on low stocks.',
            img: 'assets/images/home/modules/reporting-2.svg'
          },

        ]
      },
      {
        Key: 'reporting',
        BannerImage: 'assets/images/home/modules/reporting-bg.svg',
        BannerHeader: 'Reports management',
        BannerText: 'Get a graph and statistic compilation of data presented in multiple formats.',
        Bullets: [
          {
            point: 'based on date range'
          },
          {
            point: 'sales and stock overview'
          },
        ],
        Mockups: [
          {
            main: 'Based on date range.',
            // tslint:disable-next-line: max-line-length
            text: 'Get a graphical view based on the date range selected by the user on reports.',
            img: 'assets/images/home/modules/reporting-1.svg'
          },
          {
            main: 'sales and stock overview.',
            // tslint:disable-next-line: max-line-length
            text: 'Get a data statistics view of sales and stock with alerts on low stocks.',
            img: 'assets/images/home/modules/reporting-2.svg'
          },

        ]
      },
      {
        Key: 'shop',
        BannerImage: 'assets/images/home/modules/shop-bg.svg',
        BannerHeader: 'Reach customers online through the shop',
        // tslint:disable-next-line: max-line-length
        BannerText: 'Create options for online shop so that your customers can purchase your product items in the convenience of their home.',
        Bullets: [
          {
            point: 'Product listings'
          },
          {
            point: 'add to cart options'
          },
          {
            point: 'customer data capture on checkout'
          },
          {
            point: 'Payment options'
          },
          {
            point: 'Order successfully created'
          },
        ],
        Mockups: [
          {
            main: 'Product listings.',
            // tslint:disable-next-line: max-line-length
            text: 'List multiple product items on the online shop.',
            img: 'assets/images/home/modules/shop-1.svg'
          },
          {
            main: 'add to cart options.',
            // tslint:disable-next-line: max-line-length
            text: 'Your customers will be able to add product items to their carts together with the quantity option.',
            img: 'assets/images/home/modules/shop-2.svg'
          },
          {
            main: 'customer data capture on checkout.',
            // tslint:disable-next-line: max-line-length
            text: 'Customers will be able to fill in their contact information so the shop owner can contact them to confirm delivery of service.',
            img: 'assets/images/home/modules/shop-3.svg'
          },
          {
            main: 'Payment options.',
            // tslint:disable-next-line: max-line-length
            text: 'Based on the shop owners preference the customer can choose the method of payment  available for their convenience.',
            img: 'assets/images/home/modules/shop-4.svg'
          },
        ]
      },
    ];
  selectedModule: OurModuleModel;
  constructor() { }

  ngOnInit() {
    this.Key = localStorage.getItem('Key');
    this.data.forEach((item) => {
      if (item.Key === this.Key) {
        this.selectedModule = item;
      }
    });
  }

}
