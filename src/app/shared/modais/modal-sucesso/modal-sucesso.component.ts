import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../shared-module';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-modal-sucesso',
  templateUrl: './modal-sucesso.component.html',
  styleUrls: ['./modal-sucesso.component.scss'],
  imports: [...SHARED_IMPORTS],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),  
        animate('500ms 0s', style({ opacity: 1 })) 
      ])
    ])
  ]
})
export class ModalSucessoComponent {
  constructor(private dialogRef: MatDialogRef<ModalSucessoComponent>) {}

  irParaHome(): void {
    this.dialogRef.close('home');
  }

  novoCadastro(): void {
    this.dialogRef.close('novo');
  }
}
