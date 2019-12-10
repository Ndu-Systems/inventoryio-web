import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss']
})
export class HomeSliderComponent implements OnInit {
  slides: Slide[] = [
    {
      heading: `Welcome to Inventory IO`,
      paragraph: `Say goodbye to the paper process and discover intelligent inventory management and sales.`,
      img: `assets/images/home/silder/one.png`,
      active: true
    },
    {
      heading: `Welcome to Inventory IO`,
      paragraph: `Create product inventory of any type or make it's secured data driven. Which
                  means you can modify the information that matters to you.`,
      img: `assets/images/home/silder/two.png`,
      active: false
    },
    {
      heading: `Welcome to Inventory IO`,
      paragraph: `Manage your sales, product inventory with insights for your business that keeps you up to updated.`,
      img: `assets/images/home/silder/three.png`,
      active: false
    },
  ];
  constructor() { }

  ngOnInit() {
    this.playSlide();
  }
  playSlide() {
    setInterval(() => {
      const slide = this.slides.find(x => x.active === true);
      if (slide.active) {
        const index = this.slides.indexOf(slide);
        slide.active = false;
        if (index < this.slides.length - 1) {
          if (this.slides[index + 1]) { this.slides[index + 1].active = true; }
        } else {
          if (this.slides[0]) { this.slides[0].active = true };
        }
      }
      // this.slides.forEach((slide, index) => {
      //   console.log(index);
      //   console.log(this.slides);
      //   if (slide.active) {
      //     if (index < this.slides.length) {
      //       slide.active = false;
      //       if (this.slides[index + 1]) { this.slides[index + 1].active = true; }
      //     } else {
      //       this.slides[0].active = true;
      //     }
      //   }
      // });
    }, 5000);
  }

}


export interface Slide {
  heading: string;
  paragraph: string;
  img: string;
  active: boolean;
}
