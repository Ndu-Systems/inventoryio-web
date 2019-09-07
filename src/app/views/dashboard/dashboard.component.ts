import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showMessage: boolean;
  messages: string[];
  class: string;
  img: string;
  link: string;
  linkname: string;
  heading: string[];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.currentMessage.subscribe(data => {
      if (data) {
        this.showMessage = data.canShow;
        this.messages = data.body;
        this.class = data.class;
        this.img = data.img;
        this.link = data.link;
        this.linkname = data.linkname;
        this.heading = data.heading;
      }

    });
  }
  clearMessages() {
    this.messageService.clear();
  }
}
