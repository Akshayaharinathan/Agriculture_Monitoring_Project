 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { Observable } from 'rxjs';
import { SensorModel as Sensor } from '../model/sensor.model'; 
 
@Injectable({ providedIn: 'root' })
export class SensorService {
  private baseUrl = `http://localhost:5169/api/Sensors`;
 
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.baseUrl);
  }
 
  getById(id: number): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.baseUrl}/${id}`);
  }
 
  create(sensor: Sensor): Observable<Sensor> {
    return this.http.post<Sensor>(this.baseUrl, sensor);
  }
 
  update(id: number, sensor: Sensor): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { ...sensor, id });
  }
 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
 
 