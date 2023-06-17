import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/api/services/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  activeModal: string | undefined;

  faClose = faClose;
  constructor(
    private router: Router,
    private authSvc: AuthService,
    private msgSvc: MessagesService,
    private authenticationSvc: AuthenticationService
  ) {}

  ngOnInit(): void {}

  goBack() {
    this.router.navigate(['']);
  }

  checkAndDeleteAccount() {
    this.activeModal = 'delete-account';
  }

  dismissModal() {
    this.activeModal = undefined;
  }

  async deleteAccount() {
    let ret = await this.authSvc.deleteAccount();
    this.msgSvc.pushSuccessMessage(ret.message);
    this.authenticationSvc.logout();
  }
}
