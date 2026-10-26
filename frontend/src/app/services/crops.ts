import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CropModel } from '../model/crop.model'; 
 
@Injectable({ providedIn: 'root' })
export class CropService {
   private baseUrl="http://localhost:5169/api/Crops";
 
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<CropModel[]> {
    return this.http.get<CropModel[]>(this.baseUrl);
  }
 
  getById(id: number): Observable<CropModel> {
    return this.http.get<CropModel>(`${this.baseUrl}/${id}`);
  }
 
  create(crop: CropModel): Observable<CropModel> {
    return this.http.post<CropModel>(this.baseUrl, crop);
  }
 
  update(id: number, crop: CropModel): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { ...crop, id });
  }
 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
 