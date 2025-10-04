import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'  
})
export class CadastroService {
  private readonly apiUrl = 'https://projeto-pi-precificacao-api.onrender.com/api/Produto';

  constructor(
    private http: HttpClient
  ) { }

  cadastrarProduto(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Cadastrar`, form).pipe(  
      catchError(error => {
        return of(null);  
      })
    );
  }

  buscarProdutoPorSku(sku: string): Observable<any> {
    const params = new HttpParams().set('SKU', sku); 
    return this.http.get<any>(`${this.apiUrl}/BuscarProdutoPorSku`, { params }).pipe(  
      catchError(error => {
        return of(null);  
      })
    );
  }

  cadastrarProdutoExcel(arquivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('arquivo', arquivo); 
    return this.http.post(`${this.apiUrl}/CadastrarProdutoExcel`, formData);
  }
}