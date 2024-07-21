import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../shared/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  constructor(public theme: ThemeService) {}
}
