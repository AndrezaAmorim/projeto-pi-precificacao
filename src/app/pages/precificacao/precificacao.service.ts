import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'  
})
export class PrecificacaoService {
  private readonly apiUrl = 'https://projeto-pi-precificacao-api.onrender.com/api/Precificacao';

  constructor(
    private http: HttpClient
  ) { }

  salvar(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Salvar`, form).pipe(  
      catchError(error => {
        return of(null);  
      })
    );
  }

  calcularPreco(form: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CalcularPreco`, form).pipe(  
      catchError(error => {
        return of(null);  
      })
    );
  }
}