import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalSucessoComponent } from '../../shared/modais/modal-sucesso/modal-sucesso.component';
import { ModalfalhaComponent } from '../../shared/modais/modal-falha/modal-falha.component';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/shared-module';
import { Subscription } from 'rxjs';
import { CadastroService } from './cadastro.service';

@Component({
  standalone: true,
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'], 
  imports: [...SHARED_IMPORTS, SHARED_COMPONENTS ],
})
export class CadastroComponent implements OnInit, OnDestroy{
  private subscription = new Subscription();
  cadastroForm!: FormGroup;
  loading: boolean = false;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private dialog: MatDialog,
    private cadastroService: CadastroService
  ) { }

  ngOnInit(): void {
    this.iniciarFormulario();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  iniciarFormulario() {
    this.cadastroForm = this.fb.group({
      sku: ['', Validators.required],
      nomeProduto: ['', Validators.required],
      fornecedor: [''],
      peso: [null, Validators.min(0)],
      altura: [null, Validators.min(0)],
      largura: [null, Validators.min(0)],
      kit: [false, Validators.required],
      dataCompra: ['', Validators.required],
      tipoCompra: [''],
      precoUnitario: [null, [Validators.required, Validators.min(0)]],
      custosExtras: [null, [Validators.required, Validators.min(0)]],
      icms: [null, [Validators.required, Validators.min(0)]],
      ipi: [null, [Validators.required, Validators.min(0)]],
      pisCofins: [null, [Validators.required, Validators.min(0)]],
      mvaAjustado: [null, [Validators.required, Validators.min(0)]],
      icmsRetido: [null, [Validators.required, Validators.min(0)]],
      icmsProprio: [null, [Validators.required, Validators.min(0)]],
    });
  }
  
  onSubmit() {
    if (this.cadastroForm.valid) {
      this.loading = true;
      const form = this.cadastroForm.getRawValue();
      this.subscription.add(this.cadastroService.cadastrarProduto(form)
      .subscribe({ 
        next: (data) => {
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
      }));
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }
  
  abrirModalSucesso() {
    const dialogRef = this.dialog.open(ModalSucessoComponent, {autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'home') {
        this.router.navigate(['/'])
      } else if (result === 'novo') {
        this.cadastroForm.reset();
      }
    });
  }

  abrirModalFalha() {
   this.dialog.open(ModalfalhaComponent, {autoFocus: false});
  }

  isCampoInvalido(campo: string): boolean {
    const control = this.cadastroForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  cancelar() {
    this.router.navigate(['/']);
  }
}
