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
     null
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
