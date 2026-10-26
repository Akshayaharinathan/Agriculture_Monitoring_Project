
// src/app/model/cultivation.model.ts
export interface CultivationModel {
  Id?: number;

  FarmerId: number;
  CropId: number;

  // Extra per-farmer-per-crop details
  StartDate?: string;     // ISO date string (e.g., '2025-12-22')
  AreaInAcres?: number;

  IsHarvested: boolean;   // default false
  HarvestedOn?: string;   // ISO date string
}
