import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from 'src/app/_models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private _messages: BehaviorSubject<Message>;
  public messages: Observable<Message>;
  constructor() {
    this._messages = new BehaviorSubject<Message>(
      null
    );
    this.messages = this._messages.asObservable();
  }
  public get get() {
    return this._messages.value;
  }
  setMessage(message: Message) {
    this._messages.next(message);
  }
  clear() {
    this._messages.next({
      body: [],
      canShow: false,
      class: '',
      img: '',
      link: '',
      linkname: '',
    });
  }
}
