import { Component, OnDestroy, OnInit } from '@angular/core';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PrecificacaoService } from './precificacao.service';
import { Router } from '@angular/router';
import { ModalFalhaComponent } from '../../shared/modais/modal-falha/modal-falha.component';
import { ModalSucessoComponent } from '../../shared/modais/modal-sucesso/modal-sucesso.component';
import { CadastroService } from '../cadastro/cadastro.service';
import { ModalNaoEncontradoComponent } from '../../shared/modais/modal-nao-encontrado/modal-nao-encontrado';

@Component({
  standalone: true,
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  selector: 'app-precificacao',
  templateUrl: './precificacao.component.html',
  styleUrl: './precificacao.component.scss'
})
export class PrecificacaoComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public precificacaoForm!: FormGroup;
  public loading = false;
  public currentYear = new Date().getFullYear();
  public botoesHabilitados: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private precificacaoService: PrecificacaoService,
    private cadastroService: CadastroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.iniciarFormulario();
    this.precificacaoForm.get('sku')?.valueChanges.pipe(
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
          Object.keys(this.precificacaoForm.controls).forEach(controlName => {
            if (controlName == 'precoVenda' || controlName == 'desconto') {
              this.precificacaoForm.get(controlName)?.enable();
            }
          });
          this.precificacaoForm.get('sku')?.disable();
          this.botoesHabilitados = true;
        } else {
          this.abrirModalNaoEncontrado();
        }
      },
      error: () => {
        this.loading = false;
        this.abrirModalFalha();
      }
    });
  }

  abrirModalFalha(): void {
    this.dialog.open(ModalFalhaComponent, {autoFocus: false});
  }

  abrirModalNaoEncontrado(): void {
    this.dialog.open(ModalNaoEncontradoComponent, {autoFocus: false});
  }

  abrirModalSucesso(): void {
    const dialogRef = this.dialog.open(ModalSucessoComponent, {autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'home') {
        this.router.navigate(['/'])
      } else if (result === 'novo') {
        this.precificacaoForm.reset();
        this.botoesHabilitados = false;
      }
    });
  }
  
  iniciarFormulario(): void {
    this.precificacaoForm = this.fb.group({
      idProduto: [null],
      idPrecoProduto: [null],
      sku: ['', Validators.required],
      nomeProduto: [{ value: '', disabled: true }],
      precoSugeridoSTSP: [{ value: null, disabled: true }],
      precoVenda: [{ value: null, disabled: true }, [Validators.min(0)]],
      desconto: [{ value: null, disabled: true }, [Validators.min(0)]],
      precoDesconto: [{ value: null, disabled: true }],
      magemLiquida: [{ value: null, disabled: true }],
      margemBruta: [{ value: null, disabled: true }],
      lucro: [{ value: null, disabled: true }],
      dataAlteracaoPreco: [{ value: '', disabled: true }],
    });
  }

  isCampoInvalido(campo: string): boolean {
    const control = this.precificacaoForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.precificacaoForm.valid) {
      this.loading = true;
      const form = this.precificacaoForm.getRawValue();
      this.subscription.add(this.precificacaoService.salvar(form)
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
      this.precificacaoForm.markAllAsTouched();
    }
  }

  calcularPreco() {
    if (this.precificacaoForm.valid) {
      this.loading = true;
      const form = this.precificacaoForm.getRawValue();
      this.subscription.add(this.precificacaoService.calcularPreco(form)
      .subscribe({ 
        next: (produto) => {
          this.loading = false;
          if (produto) {
            this.preencherFormulario(produto);
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
      this.precificacaoForm.markAllAsTouched();
    }
  }

  preencherFormulario(produto: any): void {
    this.precificacaoForm.patchValue({
      idProduto: produto.IdProduto,
      idPrecoProduto: produto.IdPrecoProduto,
      sku: produto.SKU,
      nomeProduto: produto.NomeProduto,
      precoSugeridoSTSP: produto.PrecoSugerido,
      precoVenda: produto.PrecoVenda,
      desconto: produto.Desconto,
      precoDesconto: produto.PrecoDesconto,
      magemLiquida: produto.MargemLiquida,
      margemBruta: produto.MargemBruta,
      lucro: produto.Lucro,
      dataAlteracaoPreco: produto.DataAlteracaoPreco.split('T')[0]
    });
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}
