import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoadingComponent } from './loading/loading.component';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalExcelComponent } from './modais/modal-excel/modal-excel.component';

export const SHARED_IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatIconModule,
  MatCheckboxModule,
  RouterModule,
  MatProgressSpinnerModule,
  MatButtonModule
];

export const SHARED_COMPONENTS = [
  LoadingComponent,
  ModalExcelComponent
];
