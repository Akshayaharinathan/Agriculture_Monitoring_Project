// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { FarmerService } from '../../../services/farmer';
// import { FarmerModel } from '../../../model/farmer.model'; 
// @Component({
//   selector: 'app-farmer-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './farmer-list.html',
//   styleUrls: ['./farmer-list.css']
// })
// export class FarmerListComponent implements OnInit {
//   farmers: FarmerModel[] = [];
//   loading = true;
//   error?: string;
 
//   constructor(private farmerService: FarmerService, private router: Router) {}
 
//   ngOnInit(): void {
//     this.load();
//   }
 
//   load(): void {
//     this.loading = true;
//     this.farmerService.getAll().subscribe({
//       next: (data) => { this.farmers = data; this.loading = false; },
//       error: () => { this.error = 'Failed to load farmers'; this.loading = false; }
//     });
//   }
 
//   addNew(): void {
//     this.router.navigate(['/farmers/new']);
//   }
 
//   edit(id?: number): void {
//     if (id) this.router.navigate(['/farmers', id, 'edit']);
//   }
 
//   delete(id?: number): void {
//     if (!id) return;
//     if (!confirm('Delete this farmer?')) return;
//     this.farmerService.delete(id).subscribe({
//       next: () => this.load(),
//       error: () => alert('Delete failed')
//     });
//   }
  
//  goToDashboard(): void {
//     this.router.navigate(['/dashboard']);
//   }
// }


// src/app/components/farmer/farmer-list/farmer-list.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { FarmerService } from '../../../services/farmer';
// import { CultivationService } from '../../../services/cultivation';  // ⬅️ add
// import { SensorService } from '../../../services/sensor';            // ⬅️ add
// import { FarmerModel } from '../../../model/farmer.model';

// @Component({
//   selector: 'app-farmer-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './farmer-list.html',
//   styleUrls: ['./farmer-list.css']
// })
// export class FarmerListComponent implements OnInit {
//   farmers: FarmerModel[] = [];
//   loading = true;
//   error?: string;

//   // Lookup maps for counts
//   cropCountByFarmer = new Map<number, number>();
//   sensorCountByFarmer = new Map<number, number>();

//   constructor(
//     private farmerService: FarmerService,
//     private cultivationService: CultivationService,  // ⬅️ add
//     private sensorService: SensorService,            // ⬅️ add
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.load();
//   }

//   /** Load farmers + related data and compute counts */
//   load(): void {
//     this.loading = true;
//     this.error = undefined;

//     // Step 1: Load farmers
//     this.farmerService.getAll().subscribe({
//       next: (farmers: any[]) => {
//         // Normalize id/name defensively
//         this.farmers = (farmers ?? []).map(f => ({
//           id: Number(f.id ?? f.Id),                   // coerce to number
//           name: (f.name ?? f.Name ?? '—').toString()
//         })).filter(f => !Number.isNaN(f.id));

//         // Step 2: In parallel, load cultivations + sensors and compute counts
//         this.loadCultivationsAndSensors();
//       },
//       error: () => {
//         this.error = 'Failed to load farmers';
//         this.loading = false;
//       }
//     });
//   }

//   /** Load cultivations + sensors and build count maps */
//   private loadCultivationsAndSensors(): void {
//     let cultivationsLoaded = false;
//     let sensorsLoaded = false;

//     // Reset maps
//     this.cropCountByFarmer.clear();
//     this.sensorCountByFarmer.clear();

//     // Cultivations → distinct CropId per FarmerId
//     this.cultivationService.getAll().subscribe({
//       next: (data: any[]) => {
//         const byFarmerDistinctCrops = new Map<number, Set<number>>();

//         (data ?? []).forEach(c => {
//           const farmerId = Number(c.FarmerId ?? c.farmerId);
//           const cropId   = Number(c.CropId   ?? c.cropId);
//           if (Number.isNaN(farmerId) || Number.isNaN(cropId)) return;

//           if (!byFarmerDistinctCrops.has(farmerId)) {
//             byFarmerDistinctCrops.set(farmerId, new Set<number>());
//           }
//           byFarmerDistinctCrops.get(farmerId)!.add(cropId);
//         });

//         // Convert Set sizes to counts
//         for (const [fid, set] of byFarmerDistinctCrops.entries()) {
//           this.cropCountByFarmer.set(fid, set.size);
//         }

//         cultivationsLoaded = true;
//         this.finishIfAllLoaded(cultivationsLoaded, sensorsLoaded);
//       },
//       error: () => {
//         // Even if cultivations fail, show farmers; counts default to 0
//         cultivationsLoaded = true;
//         this.finishIfAllLoaded(cultivationsLoaded, sensorsLoaded);
//       }
//     });

//     // Sensors → count per FarmerId
//     this.sensorService.getAll().subscribe({
//       next: (data: any[]) => {
//         const counts = new Map<number, number>();
//         (data ?? []).forEach(s => {
//           const farmerId = Number(s.FarmerId ?? s.farmerId);
//           if (Number.isNaN(farmerId)) return;
//           counts.set(farmerId, (counts.get(farmerId) ?? 0) + 1);
//         });

//         // Assign to map
//         this.sensorCountByFarmer = counts;

//         sensorsLoaded = true;
//         this.finishIfAllLoaded(cultivationsLoaded, sensorsLoaded);
//       },
//       error: () => {
//         // Default 0 on error
//         sensorsLoaded = true;
//         this.finishIfAllLoaded(cultivationsLoaded, sensorsLoaded);
//       }
//     });
//   }

//   /** Mark the page done when both related datasets are attempted */
//   private finishIfAllLoaded(cultivationsLoaded: boolean, sensorsLoaded: boolean): void {
//     if (cultivationsLoaded && sensorsLoaded) {
//       this.loading = false;
//     }
//   }

//   // Helpers to read counts safely
//   cropsCountForFarmer(id?: number): number {
//     if (id == null) return 0;
//     return this.cropCountByFarmer.get(Number(id)) ?? 0;
//   }
//   sensorsCountForFarmer(id?: number): number {
//     if (id == null) return 0;
//     return this.sensorCountByFarmer.get(Number(id)) ?? 0;
//   }

//   // Actions
//   addNew(): void { this.router.navigate(['/farmers/new']); }
//   edit(id?: number): void { if (id) this.router.navigate(['/farmers', id, 'edit']); }
//   delete(id?: number): void {
//     if (!id) return;
//     if (!confirm('Delete this farmer?')) return;
//     this.farmerService.delete(id).subscribe({
//       next: () => this.load(),
//       error: () => alert('Delete failed')
//     });
//   }

//   // Back to dashboard
//   goToDashboard(): void { this.router.navigate(['/dashboard']); }
// }

// src/app/components/farmer/farmer-list/farmer-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FarmerService } from '../../../services/farmer';
import { CultivationService } from '../../../services/cultivation';
import { SensorService } from '../../../services/sensor';
import { FarmerModel } from '../../../model/farmer.model';

@Component({
  selector: 'app-farmer-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './farmer-list.html',
  styleUrls: ['./farmer-list.css']
})
export class FarmerListComponent implements OnInit {
  farmers: FarmerModel[] = [];
  loading = true;
  error?: string;

  // Lookup maps for counts
  cropCountByFarmer = new Map<number, number>();
  sensorCountByFarmer = new Map<number, number>();

  // --- Pagination state ---
  pageSize = 3;        // show 5 per page
  currentPage = 1;     // start at page 1

  constructor(
    private farmerService: FarmerService,
    private cultivationService: CultivationService,
    private sensorService: SensorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  /** Load farmers + related data and compute counts */
  load(): void {
    this.loading = true;
    this.error = undefined;

    this.farmerService.getAll().subscribe({
      next: (farmers: any[]) => {
        // Normalize id/name defensively
        this.farmers = (farmers ?? [])
          .map(f => ({
            id: Number(f.id ?? f.Id),                   // coerce to number
            name: (f.name ?? f.Name ?? '—').toString()
          }))
          .filter(f => !Number.isNaN(f.id));

        // Reset page to 1 (or clamp if needed)
        this.clampCurrentPage();

        // In parallel, load cultivations + sensors
        this.loadCultivationsAndSensors();
      },
      error: () => {
        this.error = 'Failed to load farmers';
        this.loading = false;
      }
    });
  }

  /** Load cultivations + sensors and build count maps */
  private loadCultivationsAndSensors(): void {
    let cultivationsLoaded = false;
    let sensorsLoaded = false;

    this.cropCountByFarmer.clear();
    this.sensorCountByFarmer.clear();

    // Cultivations → distinct CropId per FarmerId
    this.cultivationService.getAll().subscribe({
      next: (data: any[]) => {
        const byFarmerDistinctCrops = new Map<number, Set<number>>();

        (data ?? []).forEach(c => {
          const farmerId = Number(c.FarmerId ?? c.farmerId);
          const cropId   = Number(c.CropId   ?? c.cropId);
          if (Number.isNaN(farmerId) || Number.isNaN(cropId)) return;

          if (!byFarmerDistinctCrops.has(farmerId)) {
            byFarmerDistinctCrops.set(farmerId, new Set<number>());
          }
          byFarmerDistinctCrops.get(farmerId)!.add(cropId);
        });

        for (const [fid, set] of byFarmerDistinctCrops.entries()) {
          this.cropCountByFarmer.set(fid, set.size);
        }

        cultivationsLoaded = true;
        this.finishIfAllLoaded(cultivationsLoaded, sensorsLoaded);
      },
      error: () => {
        cultivationsLoaded = true;
        this.finishIfAllLoaded(cultivationsLoaded, sensorsLoaded);
      }
    });

    // Sensors → count per FarmerId
    this.sensorService.getAll().subscribe({
      next: (data: any[]) => {
        const counts = new Map<number, number>();
        (data ?? []).forEach(s => {
          const farmerId = Number(s.FarmerId ?? s.farmerId);
          if (Number.isNaN(farmerId)) return;
          counts.set(farmerId, (counts.get(farmerId) ?? 0) + 1);
        });

        this.sensorCountByFarmer = counts;

        sensorsLoaded = true;
        this.finishIfAllLoaded(cultivationsLoaded, sensorsLoaded);
      },
      error: () => {
        sensorsLoaded = true;
        this.finishIfAllLoaded(cultivationsLoaded, sensorsLoaded);
      }
    });
  }

  /** Mark the page done when both related datasets are attempted */
  private finishIfAllLoaded(cultivationsLoaded: boolean, sensorsLoaded: boolean): void {
    if (cultivationsLoaded && sensorsLoaded) {
      this.loading = false;
    }
  }

  // --- Pagination derived values & actions ---

  /** Total pages based on current list size */
  get totalPages(): number {
    const total = this.farmers?.length ?? 0;
    return Math.max(1, Math.ceil(total / this.pageSize));
  }

  /** Current slice to render in the table */
  get paginatedFarmers(): FarmerModel[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return (this.farmers ?? []).slice(start, start + this.pageSize);
  }

  /** Ensure currentPage stays within [1, totalPages] */
  private clampCurrentPage(): void {
    const tp = this.totalPages;
    if (this.currentPage > tp) this.currentPage = tp;
    if (this.currentPage < 1) this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (!Number.isFinite(page)) return;
    this.currentPage = Math.min(Math.max(1, page), this.totalPages);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  // Helpers to read counts safely
  cropsCountForFarmer(id?: number): number {
    if (id == null) return 0;
    return this.cropCountByFarmer.get(Number(id)) ?? 0;
    }
  sensorsCountForFarmer(id?: number): number {
    if (id == null) return 0;
    return this.sensorCountByFarmer.get(Number(id)) ?? 0;
  }

  // Actions
  addNew(): void { this.router.navigate(['/farmers/new']); }
  edit(id?: number): void { if (id) this.router.navigate(['/farmers', id, 'edit']); }

  delete(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this farmer?')) return;
    this.farmerService.delete(id).subscribe({
      next: () => {
        this.load();
        // After reload, ensure page is valid (e.g., last page might shrink)
        this.clampCurrentPage();
      },
      error: () => alert('Delete failed')
    });
  }

  // Back to dashboard
  goToDashboard(): void { this.router.navigate(['/dashboard']); }
}
