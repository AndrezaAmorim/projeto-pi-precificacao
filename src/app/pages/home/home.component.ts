import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  currentYear = new Date().getFullYear();
}
