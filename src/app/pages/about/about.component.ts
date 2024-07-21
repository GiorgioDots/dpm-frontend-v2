import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollTopModule, ButtonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  public get now(){
    return new Date().getFullYear();
  }
}
