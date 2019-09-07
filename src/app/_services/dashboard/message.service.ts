import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private currentMessageSubject: BehaviorSubject<Message>;
  public currentMessage: Observable<Message>;
  constructor() {
    this.currentMessageSubject = new BehaviorSubject<Message>(
      {
        heading: [`Hey John`, `Welcome to inventory-io!`],
        body: [`Your simplified  inventory
                  management with real-time
                  updates, please complete your profile to get started.`],
        canShow: true,
        class: 'success',
        img: 'assets/images/undraw_Hello_qnas.png',
        link: '/dashboard/add-company',
        linkname: 'Complete my profile',
      }
    );
    this.currentMessage = this.currentMessageSubject.asObservable();
  }

  setMessage(message: Message) {
    this.currentMessageSubject.next(message);
  }
  clear() {
    this.currentMessageSubject.next({
      body: [],
      canShow: false,
      class: '',
      img: '',
      link: '',
      linkname: '',
    });
  }
}
