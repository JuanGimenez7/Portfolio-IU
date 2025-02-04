// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  generatePdf(profileData: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/downloadPdf`, profileData, {
      responseType: 'blob',
    });
  }

  savePdf(profileData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/savePdf`, profileData);
  }

  saveProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveProfile`, profileData);
  }
}
