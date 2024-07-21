import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { RippleModule } from 'primeng/ripple';
import { PasswordsService } from '../../../api/services/passwords.service';
import { finalize } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { exportPasswordsDTO } from '../../../api/models/passwords/passwordDTO';
import { MessageAdapterService } from '../../../shared/services/message-adapter.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { AuthService } from '../../../api/services/auth.service';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FieldsetModule,
    ButtonModule,
    FileUploadModule,
    ConfirmDialogModule,
    DividerModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [ConfirmationService],
})
export class SettingsComponent {
  exportLoading = false;
  importLoading = false;
  deleteAccountLoading = false;

  constructor(
    private confirmationService: ConfirmationService,
    private pswSvc: PasswordsService,
    private msgSvc: MessageAdapterService,
    private authSvc: AuthService,
    private authenticationSvc: AuthenticationService
  ) {}

  async export() {
    this.exportLoading = true;
    this.pswSvc
      .export()
      .pipe(
        finalize(() => {
          this.exportLoading = false;
        })
      )
      .subscribe((passwords) => {
        var jsonPsws = JSON.stringify(passwords);
        var element = document.createElement('a');
        element.setAttribute(
          'href',
          'data:text/json;charset=UTF-8,' + encodeURIComponent(jsonPsws)
        );
        element.setAttribute('download', 'export.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
  }

  handleFileInput(event: any) {
    if (event.target == undefined) return;
    if (event.target.files == undefined) return;
    const file: File = event.target.files[0];
    if (file == undefined) return;

    console.log(event.target.files);
    let fileReader = new FileReader();
    fileReader.onload = async (e) => {
      let parsed = JSON.parse(
        fileReader.result?.toString() ?? ''
      ) as exportPasswordsDTO;
      this.importLoading = true;
      this.pswSvc
        .import(parsed)
        .pipe(
          finalize(() => {
            event.target.value = '';
            this.importLoading = false;
          })
        )
        .subscribe((ret) => {
          this.msgSvc.addSuccess(ret.message);
        });
    };
    fileReader.readAsText(file);
  }

  confirmDeleteAccount() {
    this.confirmationService.confirm({
      message:
        'Do you want to delete your account, the operation is irreversible and you will lose all your passwords, proceed?',
      header: 'Warning',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteAccount();
      },
      reject: () => {},
      key: 'confirmDialog',
    });
  }

  deleteAccount() {
    this.deleteAccountLoading = true;
    this.authSvc
      .deleteAccount()
      .subscribe((ret) => {
        this.msgSvc.addSuccess(ret.message);
        this.authenticationSvc.logout();
      });
  }
}
