import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'  
})
export class PrecificacaoService {
  private readonly apiUrl = 'https://projetopiprecificacao.onrender.com/api/precificacao';

  constructor(
    private http: HttpClient
  ) { }

  salvar(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/salvar`, form).pipe(  
      catchError(error => {
        return of(null);  
      })
    );
  }

  calcularPreco(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/calcularPreco`, form).pipe(  
      catchError(error => {
        return of(null);  
      })
    );
  }
}