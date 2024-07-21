import { EventEmitter, Injectable } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageAdapterService {
  public messageAdder = new EventEmitter<Message>();
  constructor() { }

  next(message: Message) {
    this.messageAdder.emit(message);
  }

  addInfo(message: string){
    this.messageAdder.emit({
      severity: 'info',
      summary: 'Info',
      detail: message,
      life: 1500
    })
  }

  addSuccess(message: string){
    this.messageAdder.emit({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 1500
    })
  }
}
