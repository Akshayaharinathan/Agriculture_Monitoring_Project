 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { Observable } from 'rxjs';
import { FarmerModel as Farmer } from '../model/farmer.model'; 
 
@Injectable({ providedIn: 'root' })
export class FarmerService {
  private baseUrl = `http://localhost:5169/api/Farmers`;
 
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<Farmer[]> {
    return this.http.get<Farmer[]>(this.baseUrl);
  }
 
  getById(id: number): Observable<Farmer> {
    return this.http.get<Farmer>(`${this.baseUrl}/${id}`);
  }
 
  create(farmer: Farmer): Observable<Farmer> {
    return this.http.post<Farmer>(this.baseUrl, farmer);
  }
 
  update(id: number, farmer: Farmer): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { ...farmer, id });
  }
 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
 
 