import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/saveProfile';

  constructor(private http: HttpClient) {}

  saveProfile(profileData: any): Observable<any> {
    return this.http.post(this.apiUrl, profileData);
  }
}
