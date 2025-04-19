import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../shared-module';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {}
