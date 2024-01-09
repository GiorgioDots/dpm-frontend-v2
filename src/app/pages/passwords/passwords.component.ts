import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  faGear,
  faRightFromBracket,
  faFileImport,
  faFileExport,
  faSliders,
  faInfo,
  faList,
  faGrip,
  faCopy,
  faArrowUpRightFromSquare,
  faAdd,
} from '@fortawesome/free-solid-svg-icons';
import {
  exportPasswordsDTO,
  passwordDTO,
} from 'src/app/api/Models/password/passwordDTO';
import { PasswordsService } from 'src/app/api/services/passwords.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-passwords',
  templateUrl: './passwords.component.html',
  styleUrls: ['./passwords.component.scss'],
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
})
export class PasswordsComponent implements OnInit {
  faGear = faGear;
  faRightFromBracket = faRightFromBracket;
  faFileImport = faFileImport;
  faFileExport = faFileExport;
  faSliders = faSliders;
  faInfo = faInfo;
  faList = faList;
  faGrip = faGrip;
  faCopy = faCopy;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  faAdd = faAdd;

  @ViewChild('actionContext') actionContextRef: ElementRef | undefined;
  @ViewChild('actionBtn') actionBtnRef: ElementRef | undefined;

  private _visibilityType: string;
  public get visibilityType(): string {
    return this._visibilityType;
  }
  public set visibilityType(value: string) {
    if (this._visibilityType != value) {
      this._visibilityType = value;
      localStorage.setItem('PSW_VISIBILITY_TYPE', value);
    }
  }

  searchTimer: ReturnType<typeof setTimeout> | undefined;
  private _searchTxt: string | undefined;
  public get searchTxt(): string | undefined {
    return this._searchTxt;
  }
  public set searchTxt(v: string | undefined) {
    this._searchTxt = v;
    if (this.searchTimer != undefined) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.search(this.searchTxt);
    }, 500);
  }

  public passwords: passwordDTO[] = [];
  public filteredPasswords: passwordDTO[] = [];

  public actionContextVisible = false;

  constructor(
    public pswSvc: PasswordsService,
    public authSvc: AuthenticationService,
    private msgSvc: MessagesService,
    private sanitizer: DomSanitizer
  ) {
    let visibilityType = localStorage.getItem('PSW_VISIBILITY_TYPE');
    if (visibilityType == undefined) {
      visibilityType = ListVisibilityMode.list;
    }
    this._visibilityType = visibilityType;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.passwords = await this.pswSvc.getAllPasswords();
      this.filteredPasswords = this.passwords;
    } catch (error) {
    }
  }

  async search(txt: string | undefined) {
    if (txt == undefined) {
      this.filteredPasswords = this.passwords;
    } else {
      let filter = txt.toLowerCase();
      this.filteredPasswords = this.passwords.filter((k) =>
        k.name?.toLowerCase()?.includes(filter)
      );
    }
  }

  logout() {
    this.authSvc.logout();
  }

  onClickOutside(event: any) {
    if (
      !this.actionContextRef?.nativeElement.contains(event.target) &&
      !this.actionBtnRef?.nativeElement.contains(event.target)
    )
      this.actionContextVisible = false;
  }

  showCopiedPopup() {
    this.msgSvc.pushInfoMessage('Copied');
  }

  async export() {
    let passwords = await this.pswSvc.export();
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
  }

  handleFileInput(event: any) {
    if (event.target == undefined) return;
    if (event.target.files == undefined) return;
    const file: File = event.target.files[0];
    if (file == undefined) return;

    let fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        let parsed = JSON.parse(
          fileReader.result?.toString() ?? ''
        ) as exportPasswordsDTO;
        let ret = await this.pswSvc.import(parsed);
        this.msgSvc.pushSuccessMessage(ret.message);
        this.ngOnInit();
      } catch (error: any) {
        this.msgSvc.pushErrorMessage(error.message);
      }
    };
    fileReader.readAsText(file);
  }
}

export enum ListVisibilityMode {
  list = 'list',
  grid = 'grid',
}
