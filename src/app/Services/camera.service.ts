import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class CameraServiceService {
  private baseUrl = environment.urlIntegration;

  constructor(private http: HttpClient) { }

  public enviarImagem(imageBase64: string | undefined): Observable<any> {
    return this.http.post<boolean>(`${this.baseUrl}/enviarImagem`, imageBase64).pipe(take(1));
  }
}
