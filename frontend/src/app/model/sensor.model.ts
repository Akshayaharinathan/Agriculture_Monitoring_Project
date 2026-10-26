export interface SensorModel {

    Id ?:number;
SerialNumber:string;
 Type :string;// e.g., "SoilMoisture", "pH"

 // FK to the specific Cultivation (farmer-crop)
 FarmerId :number;
  CropId :number;
 

 // Optional live state/metadata
InstalledOn :string;
IsActive :boolean;
}
