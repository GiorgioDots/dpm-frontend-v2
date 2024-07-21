import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export enum eThemes {
  LARA_LIGHT_TEAL = 'lara-light-teal',
  LARA_DARK_TEAL = 'lara-dark-teal',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public currTheme = eThemes.LARA_LIGHT_TEAL;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  initialize() {
    let savedTheme = localStorage.getItem('dots-theme');
    if (savedTheme != null) {
      this.currTheme = savedTheme as eThemes;
      this.setTheme();
      return;
    }
    this.currTheme =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? eThemes.LARA_DARK_TEAL
        : eThemes.LARA_LIGHT_TEAL;
    this.setTheme();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        this.currTheme = event.matches
          ? eThemes.LARA_DARK_TEAL
          : eThemes.LARA_LIGHT_TEAL;
        console.log(event);
        this.setTheme();
      });
  }

  toggleTheme() {
    this.currTheme = this.isLightMode()
      ? eThemes.LARA_DARK_TEAL
      : eThemes.LARA_LIGHT_TEAL;
    this.setTheme();
  }

  isLightMode() {
    return this.currTheme == eThemes.LARA_LIGHT_TEAL;
  }

  private setTheme() {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;
    if (themeLink != null) {
      themeLink.href = this.currTheme + '.css';
    }
    localStorage.setItem('dots-theme', this.currTheme);
    let themeColor = this.document.getElementById('theme-color') as HTMLMetaElement;
    if(themeColor){
      themeColor.content = this.isLightMode() ? "#14b8a6" : "#2dd4bf"
    }
  }
}
