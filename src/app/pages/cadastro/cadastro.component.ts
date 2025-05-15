import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalSucessoComponent } from '../../shared/modais/modal-sucesso/modal-sucesso.component';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/shared-module';
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { CadastroService } from './cadastro.service';
import { ModalFalhaComponent } from '../../shared/modais/modal-falha/modal-falha.component';

@Component({
  standalone: true,
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'], 
  imports: [...SHARED_IMPORTS, SHARED_COMPONENTS ],
})
export class CadastroComponent implements OnInit, OnDestroy{
  private subscription = new Subscription();
  public cadastroForm!: FormGroup;
  public loading: boolean = false;
  public currentYear = new Date().getFullYear();
  public botoesHabilitados: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private dialog: MatDialog,
    private cadastroService: CadastroService
  ) { }

  ngOnInit(): void {
    this.iniciarFormulario();
    this.cadastroForm.get('sku')?.valueChanges.pipe(
      debounceTime(1000), 
      distinctUntilChanged(), 
      filter(value => !!value && value.length >= 3) 
    ).subscribe(sku => {
      this.buscarProdutoPorSku(sku);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  buscarProdutoPorSku(sku: string): void {
    this.loading = true;
    this.cadastroService.buscarProdutoPorSku(sku).subscribe({
      next: (produto) => {
        this.loading = false;
        if (produto) {
          this.preencherFormulario(produto);
          Object.keys(this.cadastroForm.controls).forEach(controlName => {
            if (controlName !== 'sku') {
              this.cadastroForm.get(controlName)?.enable();
            }
          });
          this.cadastroForm.get('sku')?.disable();
          this.botoesHabilitados = true;
        } else {
          Object.keys(this.cadastroForm.controls).forEach(controlName => {
            this.cadastroForm.get(controlName)?.enable();
          });
          this.botoesHabilitados = true;
        }
      },
      error: () => {
        this.loading = false;
        this.abrirModalFalha();
      }
    });
  }

  preencherFormulario(produto: any): void {
    this.cadastroForm.patchValue({
      idProduto: produto.idProduto,
      idCustoProduto: produto.idCustoProduto,
      sku: produto.sku,
      nomeProduto: produto.nomeProduto,
      fornecedor: produto.fornecedor,
      peso: produto.peso,
      altura: produto.altura,
      largura: produto.largura,
      kit: produto.kit,
      dataCompra: produto.dataCompra?.split('T')[0],
      tipoCompra: produto.tipoCompra,
      precoUnitario: produto.precoUnitario,
      custosExtras: produto.custosExtras,
      icms: produto.icms,
      ipi: produto.ipi,
      pisCofins: produto.pisCofins,
      mvaAjustado: produto.mvaAjustado,
      icmsRetido: produto.icmsRetido,
      icmsProprio: produto.icmsProprio,
    });
  }

  iniciarFormulario() {
    this.cadastroForm = this.fb.group({
      idProduto: [{ value: null, disabled: true }],
      idCustoProduto: [{ value: null, disabled: true }],
      sku: ['', Validators.required],
      nomeProduto: [{ value: '', disabled: true }, Validators.required],
      fornecedor: [{ value: '', disabled: true }],
      peso: [{ value: null, disabled: true }, Validators.min(0)],
      altura: [{ value: null, disabled: true }, Validators.min(0)],
      largura: [{ value: null, disabled: true }, Validators.min(0)],
      kit: [{ value: false, disabled: true }],
      dataCompra: [{ value: '', disabled: true }, Validators.required],
      tipoCompra: [{ value: '', disabled: true }],
      precoUnitario: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      custosExtras: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      icms: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      ipi: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      pisCofins: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      mvaAjustado: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      icmsRetido: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      icmsProprio: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
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
  
  abrirModalSucesso(): void {
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

  isCampoInvalido(campo: string): boolean {
    const control = this.cadastroForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  cancelar() {
    this.router.navigate(['/']);
  }
}
