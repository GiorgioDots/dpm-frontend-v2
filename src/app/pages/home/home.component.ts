import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../shared/services/theme.service';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DividerModule,
    SidebarModule,
    RippleModule,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  sidebarVisible = false;
  links: NavLink[] = [
    {
      path: ['passwords'],
      label: 'Passwords',
      icon: 'pi-key',
    },
    {
      path: ['settings'],
      label: 'Settings',
      icon: 'pi-cog',
    },
    {
      path: ['about'],
      label: 'About',
      icon: 'pi-info-circle',
    },
  ];

  constructor(
    public theme: ThemeService,
    private auth: AuthenticationService
  ) {}

  onLogout() {
    this.auth.logout();
  }
}

export interface NavLink {
  path: string[];
  label: string;
  icon?: string;
}
