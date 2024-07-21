import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthenticationService } from './shared/services/authentication.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageAdapterService } from './shared/services/message-adapter.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ProgressSpinnerModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  sessionRefreshed = new BehaviorSubject(false);

  constructor(
    private messageSvc: MessageService,
    private theme: ThemeService,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    public authSvc: AuthenticationService,
    public messageAdapterSvc: MessageAdapterService
  ) {
    messageAdapterSvc.messageAdder.subscribe((msg) => {
      this.messageSvc.add(msg);
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.theme.initialize();
    this.authSvc
      .refreshToken()
      .pipe(
        finalize(() => {
          this.sessionRefreshed.next(true);
          this.router.initialNavigation();
        })
      )
      .subscribe();
  }
}
