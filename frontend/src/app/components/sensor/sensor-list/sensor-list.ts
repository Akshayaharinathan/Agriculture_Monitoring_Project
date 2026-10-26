// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { SensorService } from '../../../services/sensor';
// import { Sensor } from '../../../models/sensors.model';
 
// @Component({
//   selector: 'app-sensor-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './sensor-list.html',
//   styleUrls: ['./sensor-list.css']
// })
// export class SensorListComponent implements OnInit {
//   sensors: Sensor[] = [];
//   loading = true;
//   error?: string;
 
//   // enum mapping: 0=Inactive, 1=Active, 2=Maintenance
//   statusMap: Record<number, string> = { 0: 'Inactive', 1: 'Active', 2: 'Maintenance' };
 
//   constructor(private sensorService: SensorService, private router: Router) {}
 
//   ngOnInit(): void {
//     this.load();
//   }
 
//   load(): void {
//     this.loading = true;
//     this.sensorService.getAll().subscribe({
//       next: (data) => { this.sensors = data; this.loading = false; },
//       error: () => { this.error = 'Failed to load sensors'; this.loading = false; }
//     });
//   }
 
//   addNew(): void {
//     this.router.navigate(['/sensors/new']);
//   }
 
//   edit(id?: number): void {
//     if (id) this.router.navigate(['/sensors', id, 'edit']);
//   }
 
//   delete(id?: number): void {
//     if (!id) return;
//     if (!confirm('Delete this sensor?')) return;
//     this.sensorService.delete(id).subscribe({
//       next: () => this.load(),
//       error: () => alert('Delete failed')
//     });
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { SensorService } from '../../../services/sensor';
// import { SensorModel } from '../../../model/sensor.model';

// @Component({
//   selector: 'app-sensor-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './sensor-list.html',
//   styleUrls: ['./sensor-list.css']
// })
// export class SensorListComponent implements OnInit {
//   sensors: SensorModel[] = [];
//   loading = true;
//   error?: string;

//   constructor(private sensorService: SensorService, private router: Router) {}

//   ngOnInit(): void {
//     this.load();
//   }

//   // load(): void {
//   //   this.loading = true;
//   //   this.sensorService.getAll().subscribe({
//   //     next: (data) => { this.sensors = data; this.loading = false; },
//   //     error: () => { this.error = 'Failed to load sensors'; this.loading = false; }
//   //   });
//   // }
  
// load(): void {
//   this.loading = true;
//   this.sensorService.getAll().subscribe({
//     next: (data: any[]) => {
//       console.log('RAW sensors:', data); // 👀 check actual keys
//       this.sensors = (data ?? []).map(it => ({
//         Id: it.Id ?? it.id ?? it.ID ?? null,
//         SerialNumber: it.SerialNumber ?? it.serialNumber ?? it.code ?? it.sn ?? null,
//         Type: it.Type ?? it.type ?? null,
//         FarmerId: it.FarmerId ?? it.farmerId ?? null,
//         CropId: it.CropId ?? it.cropId ?? null,
//         InstalledOn: it.InstalledOn ?? it.installedOn ?? null,
//         IsActive: it.IsActive ?? it.isActive ?? false
//       }));
//       this.loading = false;
//     },
//     error: () => { this.error = 'Failed to load sensors'; this.loading = false; }
//   });
// }


//   addNew(): void {
//     this.router.navigate(['/sensors/new']);
//   }

//   edit(id?: number): void {
//     if (id != null) {
//       this.router.navigate(['/sensors', id, 'edit']);
//     }
//   }

//   delete(id?: number): void {
//     if (id == null) return;
//     if (!confirm('Delete this sensor?')) return;
//     this.sensorService.delete(id).subscribe({
//       next: () => this.load(),
//       error: () => alert('Delete failed')
//     });
//   }

//   // Helpers for UI display
//   activeLabel(sensor: SensorModel): string {
//     return sensor.IsActive ? 'Active' : 'Inactive';
//   }

//   activeBadgeClass(sensor: SensorModel): string {
//     return sensor.IsActive ? 'bg-success' : 'bg-secondary';
//   }
// }

 
// // src/app/services/sensor.ts

// src/app/components/sensor/sensor-list/sensor-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SensorService } from '../../../services/sensor';
import { FarmerService } from '../../../services/farmer';  // ⬅️ add
import { CropService } from '../../../services/crops';      // ⬅️ add
import { SensorModel } from '../../../model/sensor.model';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sensor-list.html',
  styleUrls: ['./sensor-list.css']
})
export class SensorListComponent implements OnInit {
  // Base data
  sensors: SensorModel[] = [];
  filteredSensors: SensorModel[] = [];

  // UI state
  loading = true;
  error?: string;

  // Filter options fetched from backend
  farmersOptions: { id: number; name: string }[] = [];
  cropsOptions: { id: number; name: string }[] = [];

  // Selected filters
  selectedFarmerId?: number;
  selectedCropId?: number;
  /** '' | 'active' | 'inactive' */
  selectedStatus: '' | 'active' | 'inactive' = '';

  constructor(
    private sensorService: SensorService,
    private farmerService: FarmerService,   // ⬅️ add
    private cropService: CropService,       // ⬅️ add
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();

    // Load farmer/crop options in parallel (for filters + name display)
    this.farmerService.getAll().subscribe({
      next: (list: any[]) => {
        this.farmersOptions = (list ?? [])
          .map(f => ({ id: f.id ?? f.Id, name: f.name ?? f.Name ?? '—' }))
          .filter(x => x.id != null);
      },
      error: () => { /* silent */ }
    });

    this.cropService.getAll().subscribe({
      next: (list: any[]) => {
        this.cropsOptions = (list ?? [])
          .map(c => ({ id: c.id ?? c.Id, name: c.name ?? c.Name ?? '—' }))
          .filter(x => x.id != null);
      },
      error: () => { /* silent */ }
    });
  }

  
// src/app/components/cultivation/cultivation-list/cultivation-list.ts

// ...rest of the class...

 


  load(): void {
    this.loading = true;
    this.error = undefined;

    this.sensorService.getAll().subscribe({
      next: (data: any[]) => {
        console.log('RAW sensors:', data); // 👀 check actual keys
        this.sensors = (data ?? []).map(it => ({
          Id:           it.Id           ?? it.id           ?? it.ID           ?? null,
          SerialNumber: it.SerialNumber ?? it.serialNumber ?? it.code         ?? it.sn ?? null,
          Type:         it.Type         ?? it.type         ?? null,
          FarmerId:     it.FarmerId     ?? it.farmerId     ?? null,
          CropId:       it.CropId       ?? it.cropId       ?? null,
          InstalledOn:  it.InstalledOn  ?? it.installedOn  ?? null,
          IsActive:     it.IsActive     ?? it.isActive     ?? false
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load sensors';
        this.loading = false;
      }
    });
  }

  // ===== Filters & handlers =====
  onFarmerFilterChange(val: string) {
    this.selectedFarmerId = val ? Number(val) : undefined;
    this.applyFilters();
  }

  onCropFilterChange(val: string) {
    this.selectedCropId = val ? Number(val) : undefined;
    this.applyFilters();
  }

  onStatusFilterChange(val: string) {
    this.selectedStatus = (val === 'active' || val === 'inactive') ? val : '';
    this.applyFilters();
  }

  clearFarmerFilter() {
    this.selectedFarmerId = undefined;
    this.applyFilters();
  }

  clearCropFilter() {
    this.selectedCropId = undefined;
    this.applyFilters();
  }

  clearStatusFilter() {
    this.selectedStatus = '';
    this.applyFilters();
  }

  /** Normalize IsActive + apply all filters */
  private applyFilters(): void {
    const base = this.sensors ?? [];

    this.filteredSensors = base.filter(s => {
      const isActive =
        s.IsActive === true ;
       

      const passFarmer = this.selectedFarmerId ? Number(s.FarmerId) === this.selectedFarmerId : true;
      const passCrop   = this.selectedCropId   ? Number(s.CropId)   === this.selectedCropId   : true;

      let passStatus = true;
      if (this.selectedStatus === 'active')   passStatus = isActive;
      if (this.selectedStatus === 'inactive') passStatus = !isActive;

      return passFarmer && passCrop && passStatus;
    });
  }

  // ===== Actions =====
  addNew(): void {
    this.router.navigate(['/sensors/new']);
  }

  edit(id?: number): void {
    if (id != null) {
      this.router.navigate(['/sensors', id, 'edit']);
    }
  }

  delete(id?: number): void {
    if (id == null) return;
    if (!confirm('Delete this sensor?')) return;
    this.sensorService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Delete failed')
    });
  }

  // ===== Helpers for UI display =====
  activeLabel(sensor: SensorModel): string {
    const isActive =
      sensor.IsActive === true ;
    return isActive ? 'Active' : 'Inactive';
  }

  activeBadgeClass(sensor: SensorModel): string {
    const isActive =
      sensor.IsActive === true ;
    return isActive ? 'bg-success' : 'bg-secondary';
  }

 /** Resolve farmer name by ID for table display */
  farmerNameById(id?: number): string | undefined {
    if (id == null) return undefined;
    return this.farmersOptions.find(f => f.id === id)?.name;
  }

  /** Resolve crop name by ID for table display */
  cropNameById(id?: number): string | undefined {
    if (id == null) return undefined;
    return this.cropsOptions.find(c => c.id === id)?.name;
  }
  
 goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}


