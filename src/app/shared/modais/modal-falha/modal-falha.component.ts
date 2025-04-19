import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../shared-module';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-modal-falha',
  templateUrl: './modal-falha.component.html',
  styleUrls: ['./modal-falha.component.scss'],
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
export class ModalfalhaComponent {
  constructor(private dialogRef: MatDialogRef<ModalfalhaComponent>) {}

  fecharModal(): void {
    this.dialogRef.close('fechar');
  }
}
