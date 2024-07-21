import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { passwordDTO } from '../../../api/models/passwords/passwordDTO';
import { PasswordsService } from '../../../api/services/passwords.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { catchError, debounceTime, finalize, throwError } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MessageAdapterService } from '../../../shared/services/message-adapter.service';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import * as _ from 'underscore';

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [
    DataViewModule,
    CommonModule,
    ToggleButtonModule,
    FormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ReactiveFormsModule,
    DividerModule,
    ClipboardModule,
    RippleModule,
    RouterModule,
    ProgressSpinnerModule,
    SelectButtonModule,
  ],
  templateUrl: './passwords.component.html',
  styleUrl: './passwords.component.scss',
})
export class PasswordsComponent implements OnInit {
  loading = true;

  get layout(): 'list' | 'grid' {
    return this.isGrid ? 'grid' : 'list';
  }
  get isGrid() {
    let saved = localStorage.getItem('dots-list-view');
    if (saved == null) return false;
    return saved == 'grid';
  }
  set isGrid(val) {
    localStorage.setItem('dots-list-view', val ? 'grid' : 'list');
  }

  originalPasswords!: passwordDTO[];
  filteredPasswords!: passwordDTO[];

  search: FormControl;
  preferredOnly: FormControl;
  preferredOnlyOptions: any[] = [{ icon: 'pi-star-fill', value: true }];

  constructor(
    private pwdSvc: PasswordsService,
    private msgSvc: MessageAdapterService
  ) {
    this.preferredOnly = new FormControl(
      sessionStorage.getItem('preferred-only-filter') == 'true'
    );
    this.search = new FormControl(
      sessionStorage.getItem('passwords-filter') ?? ''
    );
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((filt) => {
      sessionStorage.setItem('passwords-filter', filt ?? '');
      this.filter(filt);
    });
    this.preferredOnly.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
      sessionStorage.setItem('preferred-only-filter', val);
      this.filter(this.search.value);
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.pwdSvc
      .getAllPasswords()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((pwds) => {
        this.originalPasswords = pwds;
        this.filter(this.search.value);
      });
  }

  clipboardCopied() {
    this.msgSvc.addInfo('Copied');
  }

  filter(filt: string) {
    let filter = filt.toLowerCase();
    this.filteredPasswords = this.originalPasswords.filter((k) => {
      return (
        (!this.preferredOnly.value ||
          (this.preferredOnly.value && k.preferred)) &&
        (!filter ||
          filter == '' ||
          k.name?.toLowerCase()?.includes(filter) ||
          k.url?.toLowerCase()?.includes(filter))
      );
    });
  }

  togglePreferred(password: passwordDTO) {
    if (password._id == undefined) return;
    this.loading = true;
    this.pwdSvc
      .togglePreferred(password._id)
      .pipe(
        catchError((e) => {
          this.loading = false;
          return throwError(() => e);
        })
      )
      .subscribe((ret) => {
        this.msgSvc.addSuccess(ret.message);
        this.ngOnInit();
      });
  }
}
