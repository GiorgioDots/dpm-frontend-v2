import { Component } from '@angular/core';
import { Message, MessagesService } from './services/messages.service';
import { faXmark, faCopy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  faXmark = faXmark;
  faCopy = faCopy;

  constructor(public messagesSvc: MessagesService) {
    // // setInterval(() => messagesSvc.pushErrorMessage('TEST'), 50);
    // for (let i = 0; i < 50; i++) {
    //   if (i % 2 == 0) {
    //     messagesSvc.pushErrorMessage(`message ${i}`);
    //   } else if (i % 3 == 0) {
    //     messagesSvc.pushSuccessMessage(
    //       `message ${i} alsdfjoagir sag asiogj asldgkj asdgoi asjg sadgj sadgioj asdglks adg;ka jegrowivj alrskg asr;gj saroigjae raiogj;a gkjasr gj`
    //     );
    //   } else {
    //     messagesSvc.pushInfoMessage(`message ${i}`);
    //   }
    // }
  }

  closeMessage(message: Message) {
    this.messagesSvc.removeMessage(message);
  }

  closeAllMessages() {
    this.messagesSvc.clear();
  }
}
