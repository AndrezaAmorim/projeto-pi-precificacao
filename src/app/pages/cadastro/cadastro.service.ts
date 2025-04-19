import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'  
})
export class CadastroService {
  private readonly apiUrl = 'https://projetopiprecificacao.onrender.com/api/produtos';

  constructor(
    private http: HttpClient
  ) { }

  cadastrarProduto(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cadastrar`, form).pipe(  
      catchError(error => {
        return of(null);  
      })
    );
  }
}