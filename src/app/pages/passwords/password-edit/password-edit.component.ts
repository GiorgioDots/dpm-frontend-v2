import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faClose,
  faRandom,
  faLink,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

import { passwordDTO } from 'src/app/api/Models/password/passwordDTO';
import { PasswordsService } from 'src/app/api/services/passwords.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-password-edit',
  templateUrl: './password-edit.component.html',
  styleUrls: ['./password-edit.component.scss'],
})
export class PasswordEditComponent implements OnInit {
  faClose = faClose;
  faRandom = faRandom;
  faLink = faLink;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  isPasswordVisible = false;
  passwordId: string | undefined;
  passwordForm: FormGroup | undefined;
  password: passwordDTO = {};
  activeModal: string | undefined;

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
    activeRoute: ActivatedRoute,
    private pswSvc: PasswordsService,
    private router: Router,
    private msgSvc: MessagesService
  ) {
    activeRoute.params.subscribe((params) => {
      this.passwordId = params['id'];
      this.initialize();
    });
  }

  ngOnInit(): void {}

  async initialize(): Promise<void> {
    if (this.isNew || this.passwordId == undefined) {
      this.passwordForm = this.generateForm({});
      return;
    }
    try {
      this.password = await this.pswSvc.getPassword(this.passwordId);
      this.passwordForm = this.generateForm(this.password);
    } catch (error) {
      this.passwordId = 'not-found';
    }
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

  checkCanGoBack() {
    if (this.passwordForm != undefined && this.passwordForm.dirty) {
      this.activeModal = 'cancel';
      return;
    }
    this.goBack();
  }

  goBack() {
    this.router.navigate(['/', 'passwords']);
  }

  checkCanSave() {
    if (!this.canSave) {
      // nulla da salvare
      return;
    }
    this.activeModal = 'save';
  }

  async save() {
    this.dismissModal();
    if (this.passwordForm == undefined || this.passwordId == undefined) return;

    let psw = this.passwordForm.getRawValue() as passwordDTO;
    if (this.isNew) {
      // create
      let ret = await this.pswSvc.createPassword(psw);
      this.msgSvc.pushSuccessMessage(ret.message);
      this.router.navigate(['/', 'passwords', ret.id]);
    } else {
      // update
      let ret = await this.pswSvc.updatePassword(this.passwordId, psw);
      this.msgSvc.pushSuccessMessage(ret.message);
      await this.initialize();
    }
  }

  checkConfirmDelete() {
    this.activeModal = 'delete';
  }

  async deletePassword() {
    this.dismissModal();
    if (this.passwordId == undefined) return;
    let ret = await this.pswSvc.delete(this.passwordId);
    this.msgSvc.pushSuccessMessage(ret.message);
    this.router.navigate(['/', 'passwords']);
  }

  dismissModal() {
    this.activeModal = undefined;
  }

  generatePassword() {
    var length = Math.random() * 10 + 20,
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
