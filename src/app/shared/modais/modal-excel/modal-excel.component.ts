import { Component} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SHARED_IMPORTS } from '../../shared-module';
import { Subscription } from 'rxjs';
import { ModalSucessoComponent } from '../modal-sucesso/modal-sucesso.component';
import { CadastroService } from '../../../pages/cadastro/cadastro.service';
import { Router } from '@angular/router';
import { ModalFalhaComponent } from '../modal-falha/modal-falha.component';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  imports: [...SHARED_IMPORTS, LoadingComponent],
  standalone: true,
  selector: 'app-meu-modal',
  templateUrl: './modal-excel.component.html',
  styleUrls: ['./modal-excel.component.scss'], 
})
export class ModalExcelComponent {
  arquivoSelecionado: File | null = null;
  nomeArquivo: string = '';
  subscription = new Subscription();
  public loading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalExcelComponent>,
    private router: Router, 
    private dialog: MatDialog,
    private cadastroService: CadastroService
    
  ) { }

  abrirFileInput(): void {
    const input = document.getElementById('uploadExcel') as HTMLInputElement;
    input?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];
      this.nomeArquivo = this.arquivoSelecionado.name;
    }
  }

  baixarModelo(): void {
    const baseHref = document.getElementsByTagName('base')[0].getAttribute('href') || '';
    const fileUrl = `${baseHref}assets/modeloCadastro.xlsx`;

    fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
            throw new Error('Erro ao buscar o arquivo');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modeloCadastro.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Erro ao baixar o arquivo:', error);
    });
  }

  enviarArquivo(): void {
    if (!this.arquivoSelecionado) return;
      
    this.loading = true;
    this.subscription.add(this.cadastroService.cadastrarProdutoExcel(this.arquivoSelecionado)
      .subscribe({ 
        next: (data: any) => {
          this.loading = false;
          if (data) {
            this.abrirModalSucesso();
          } else {
            this.abrirModalFalha();
          }
        },
        error: () => {
          this.loading = false;
          this.abrirModalFalha();
        }
      })
    );
  }
  
  abrirModalSucesso(): void {
    this.dialogRef.close(this.arquivoSelecionado);
    const dialogRef = this.dialog.open(ModalSucessoComponent, {autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'home') {
        this.router.navigate(['/'])
      } else if (result === 'novo') {
        window.location.reload();
      }
    });
  }

  abrirModalFalha(): void {
   this.dialog.open(ModalFalhaComponent, {autoFocus: false});
  }
}
  
