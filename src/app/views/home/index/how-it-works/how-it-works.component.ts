import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {
  images: any[];
  mobileImages: any[];
  constructor() { }
  ngOnInit() {

    this.populateDesktopImages();
    this.populateMobileImages();
  }

  populateDesktopImages() {
    this.images = [];
    this.images.push({
      source: 'assets/images/home/frames/Frame-1.png',
      alt: 'View latest figures on your inventoryio dashboard',
      title: 'Main dashboard'
    });
    this.images.push({
      source: 'assets/images/home/frames/Frame-2.png',
      alt: 'View reports with a click of a button and filter on your preferences',
      title: 'Reports'
    });
    this.images.push({
      source: 'assets/images/home/frames/Frame-3.png',
      alt: 'Sell to new or existing customers and adjust your stock accordingly',
      title: 'Sales orders'
    });
    this.images.push({
      source: 'assets/images/home/frames/Frame-4.png',
      alt: 'Whether it is a service or a product for sale add according to your business domain',
      title: 'Add new items'
    });
    this.images.push({
      source: 'assets/images/home/frames/Frame-5.png',
      alt: 'Attract new clients for your business with our easy to use quotes and sales invoices.',
      title: 'Customer quotations'
    });
    this.images.push({
      source: 'assets/images/home/frames/Frame-6.png',
      alt: 'Our easy to use user interfaces will allow you to switch between different quotes improving productivity.',
      title: 'Quotation details'
    });

  }

  populateMobileImages() {
    this.mobileImages = [];
    this.mobileImages.push({
      source: 'assets/images/home/frames/Frame-1-m.png',
      alt: 'View latest figures on your inventoryio dashboard',
      title: 'Main dashboard'
    });
    this.mobileImages.push({
      source: 'assets/images/home/frames/Frame-2-m.png',
      alt: 'View reports with a click of a button and filter on your preferences',
      title: 'Reports'
    });
    this.mobileImages.push({
      source: 'assets/images/home/frames/Frame-3-m.png',
      alt: 'Sell to new or existing customers and adjust your stock accordingly',
      title: 'Sales orders'
    });
    this.mobileImages.push({
      source: 'assets/images/home/frames/Frame-4-m.png',
      alt: 'Whether it is a service or a product for sale add according to your business domain',
      title: 'Add new items'
    });
    this.mobileImages.push({
      source: 'assets/images/home/frames/Frame-5-m.png',
      alt: 'Attract new clients for your business with our easy to use quotes and sales invoices.',
      title: 'Customer quotations'
    });
    this.mobileImages.push({
      source: 'assets/images/home/frames/Frame-6-m.png',
      alt: 'Our easy to use user interfaces will allow you to switch between different quotes improving productivity.',
      title: 'Quotation details'
    });
  }
}
