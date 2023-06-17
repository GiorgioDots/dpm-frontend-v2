import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  public messages: Message[] = [];

  public onMessageAdded: ((message: Message) => void) | undefined;

  constructor() {}

  public pushErrorMessage(message: string) {
    this.pushMessage(message, MessageTypes.error);
  }

  public pushSuccessMessage(message: string) {
    this.pushMessage(message, MessageTypes.success);
  }

  public pushInfoMessage(message: string) {
    this.pushMessage(message, MessageTypes.info);
  }

  public pushMessage(message: string, type: MessageTypes) {
    const newMsg = new Message(message, type, 3000);
    newMsg.onNoMoreVisible = (message: Message) => this.removeMessage(message);
    this.messages.push(newMsg);
    if (this.onMessageAdded != undefined) this.onMessageAdded(newMsg);
  }

  public removeMessage(message: Message) {
    this.messages = this.messages.filter((k) => k != message);
  }

  public clear() {
    this.messages = [];
  }
}

export class Message {
  public message: string;
  public type: MessageTypes;
  public onNoMoreVisible: ((message: Message) => void) | undefined;

  constructor(message: string, type: MessageTypes, time: number) {
    this.message = message;
    this.type = type;
    setTimeout(() => {
      if (this.onNoMoreVisible != null) this.onNoMoreVisible(this);
    }, time);
  }
}

export enum MessageTypes {
  error = 'error',
  success = 'success',
  info = 'info',
}
