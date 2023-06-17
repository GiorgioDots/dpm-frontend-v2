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
  ) {}
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
