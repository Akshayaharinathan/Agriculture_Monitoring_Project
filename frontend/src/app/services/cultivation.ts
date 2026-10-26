
// src/app/services/cultivation.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CultivationModel } from '../model/cultivation.model'; // ✅ ensure correct path

@Injectable({ providedIn: 'root' })
export class CultivationService {
  private baseUrl = "http://localhost:5169/api/Cultivations" ; // <-- change to your real endpoint

  constructor(private http: HttpClient) {}

  getAll(): Observable<CultivationModel[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items => (items ?? []).map(this.toCultivationModel))
    );
  }

  getById(id: number): Observable<CultivationModel> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(this.toCultivationModel)
    );
  }

  create(cultivation: CultivationModel) {
    const payload = this.fromCultivationModel(cultivation);
    return this.http.post(this.baseUrl, payload);
  }

  update(id: number, cultivation: CultivationModel) {
    const payload = this.fromCultivationModel({ ...cultivation, Id: id });
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  delete(farmerId:number,cropId:number) {
    return this.http.delete(`${this.baseUrl}/${farmerId}/${cropId}`);
  }
  

  // GET by composite key
  getByKey(farmerId: number, cropId: number) {
    return this.http.get<CultivationModel>(`${this.baseUrl}/${farmerId}/${cropId}`);
  }

  // PUT by composite key
  updateByKey(farmerId: number, cropId: number, payload: CultivationModel) {
    return this.http.put<void>(`${this.baseUrl}/${farmerId}/${cropId}`, payload);
  }

  // POST create


  /** Map backend object to PascalCase CultivationModel (handles common casings/aliases) */
  private toCultivationModel = (it: any): CultivationModel => ({
    Id: it.Id ?? it.id ?? it.ID ?? null,

    FarmerId: it.FarmerId ?? it.farmerId ?? it.farmerID ?? null,
    CropId: it.CropId ?? it.cropId ?? it.cropID ?? null,

    StartDate: it.StartDate ?? it.startDate ?? it.start_on ?? null,
    AreaInAcres: it.AreaInAcres ?? it.areaInAcres ?? it.area ?? null,

    IsHarvested: it.IsHarvested ?? it.isHarvested ?? false,
    HarvestedOn: it.HarvestedOn ?? it.harvestedOn ?? null
  });

  /** Map PascalCase model to backend’s expected (camelCase) payload */
  private fromCultivationModel = (c: CultivationModel): any => ({
    id: c.Id,
    farmerId: c.FarmerId,
    cropId: c.CropId,
    startDate: c.StartDate,
    areaInAcres: c.AreaInAcres,
    isHarvested: c.IsHarvested,
    harvestedOn: c.HarvestedOn
  });
  
}

