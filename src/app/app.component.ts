import { Component, OnInit } from '@angular/core';
import { Message, MessagesService } from './services/messages.service';
import { faXmark, faCopy } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from './services/loading.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  faXmark = faXmark;
  faCopy = faCopy;

  public loading: boolean = false;

  constructor(
    public messagesSvc: MessagesService,
    private _loading: LoadingService
  ) {
    // setInterval(() => messagesSvc.pushErrorMessage('TEST'), 50);
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
  ngOnInit(): void {
    this.listenToLoading();
  }

  closeMessage(message: Message) {
    this.messagesSvc.removeMessage(message);
  }

  closeAllMessages() {
    this.messagesSvc.clear();
  }

  /**
   * Listen to the loadingSub property in the LoadingService class. This drives the
   * display of the loading spinner.
   */
  listenToLoading(): void {
    this._loading.loadingSub.pipe(delay(50)).subscribe((loading) => {
      this.loading = loading.find((k) => k.loading) != undefined;
    });
  }
}
