import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PasswordsService } from '../../../../api/services/passwords.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { passwordDTO } from '../../../../api/models/passwords/passwordDTO';
import { catchError, finalize, throwError } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageAdapterService } from '../../../../shared/services/message-adapter.service';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    CommonModule,
    InputIconModule,
    IconFieldModule,
    RouterModule,
    FloatLabelModule,
    InputTextareaModule,
    FieldsetModule,
    ConfirmDialogModule,
    PasswordModule,
    InputGroupModule,
    InputGroupAddonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
  providers: [ConfirmationService],
})
export class PasswordComponent {
  passwordId: string | undefined;
  passwordForm: FormGroup | undefined;
  password: passwordDTO = {};

  get isNew() {
    return this.passwordId == 'new';
  }

  get isNotFound() {
    return this.passwordId == 'not-found';
  }

  get canSave() {
    return (
      this.passwordForm != undefined &&
      this.passwordForm.dirty &&
      this.passwordForm.valid
    );
  }

  constructor(
    private confirmationService: ConfirmationService,
    activeRoute: ActivatedRoute,
    private pswSvc: PasswordsService,
    private router: Router,
    private msgSvc: MessageAdapterService
  ) {
    activeRoute.params.subscribe((params) => {
      this.passwordId = params['id'];
      this.initialize();
    });
  }

  initialize() {
    if (this.isNew || this.passwordId == undefined) {
      this.passwordForm = this.generateForm({});
      return;
    }
    if(this.passwordForm != undefined){
      this.passwordForm.disable();
    }
    this.pswSvc
      .getPassword(this.passwordId)
      .pipe(
        catchError((e) => {
          this.passwordId = 'not-found';
          return throwError(() => e);
        })
      )
      .subscribe((psw) => {
        this.password = psw;
        this.passwordForm = this.generateForm(this.password);
      });
  }

  generateForm(psw: passwordDTO): FormGroup {
    return new FormGroup({
      url: new FormControl(psw.url ?? ''),
      login: new FormControl(psw.login ?? '', [Validators.required]),
      secondLogin: new FormControl(psw.secondLogin ?? ''),
      notes: new FormControl(psw.notes ?? ''),
      name: new FormControl(psw.name ?? '', [Validators.required]),
      password: new FormControl(psw.password ?? '', [Validators.required]),
    });
  }

  onDelete() {
    this.confirmationService.confirm({
      message:
        'You choosed to delete the password, if you continue, this password will be deleted permanently, are you sure you want to proceed?',
      header: 'Warning',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deletePassword();
      },
      reject: () => {},
      key: 'confirmDialog',
    });
  }

  checkCanGoBack() {
    if (this.passwordForm != undefined && this.passwordForm.dirty) {
      this.confirmationService.confirm({
        message:
          'You have made some changes, if you continue you will lose them, are you sure you want to proceed?',
        header: 'Continue?',
        icon: 'pi pi-info-circle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.goBack();
        },
        reject: () => {},
        key: 'confirmDialog',
      });
      return;
    }
    this.goBack();
  }

  checkCanSave() {
    if (!this.canSave) {
      // nulla da salvare
      return;
    }
    this.confirmationService.confirm({
      message:
        'If you continue, all your changes will be applied, are you sure you want to proceed?',
      header: 'Continue?',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.save();
      },
      reject: () => {},
      key: 'confirmDialog',
    });
  }

  goBack() {
    this.router.navigate(['/', 'passwords']);
  }

  save() {
    if (this.passwordForm == undefined || this.passwordId == undefined) return;

    let psw = this.passwordForm.getRawValue() as passwordDTO;
    this.passwordForm.disable();
    if (this.isNew) {
      // create
      this.pswSvc
        .createPassword(psw)
        .pipe(finalize(() => this.passwordForm?.enable()))
        .subscribe((res) => {
          this.msgSvc.addSuccess(res.message);
          this.router.navigate(['/', 'passwords', res.id]);
        });
    } else {
      // update
      this.pswSvc
        .updatePassword(this.passwordId, psw)
        .pipe(finalize(() => this.passwordForm?.enable()))
        .subscribe((res) => {
          this.msgSvc.addSuccess(res.message);
          this.initialize();
        });
    }
  }

  deletePassword() {
    if (this.passwordId == undefined) return;
    this.passwordForm?.disable();
    this.pswSvc
      .delete(this.passwordId)
      .pipe(finalize(() => this.passwordForm?.enable()))
      .subscribe((res) => {
        this.msgSvc.addSuccess(res.message);
        this.router.navigate(['/', 'passwords']);
      });
  }

  onGeneratePsw(){
    var length = Math.random() * 10 + 12,
      charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.#!;:_-/@^',
      retVal = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    var passwordControl = this.passwordForm?.get('password');
    if (passwordControl == undefined) return;
    passwordControl.setValue(retVal);
    passwordControl.markAsDirty();
  }
}
