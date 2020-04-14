import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  constructor() { }

  data: any =
    [
      {
        parentName: 'Which plan is right for me?',
        childProperties:
          [
            { propertyName: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
          ]
      },
      {
        parentName: 'How does your pricing work?',
        childProperties:
          [
            { propertyName: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
          ]
      },
      {
        parentName: 'What if I change my mind?',
        childProperties:
          [
            { propertyName: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
          ]
      },
      {
        parentName: 'How can I manage my billing?',
        childProperties:
          [
            { propertyName: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
          ]
      },
      {
        parentName: 'Can I change my plan?',
        childProperties:
          [
            { propertyName: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
          ]
      },
      {
        parentName: 'How secure is inventoryio.co.za?',
        childProperties:
          [
            { propertyName: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
          ]
      }
    ];

  ngOnInit() {

  }
  toggleAccordian(event, index) {
    const element = event.target;
    element.classList.toggle('active');
    if (this.data[index].isActive) {
      this.data[index].isActive = false;
    } else {
      this.data[index].isActive = true;
    }
    const panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  }
}
