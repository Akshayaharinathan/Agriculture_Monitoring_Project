// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css',
// })
// export class Dashboard {

// }

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css']
// })
// export class DashboardComponent {}


// src/app/components/dashboard/dashboard.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FarmerService } from '../../services/farmer';
import { CropService } from '../../services/crops';
import { SensorService } from '../../services/sensor';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  // If your services are NOT using providedIn:'root', uncomment:
  // providers: [FarmerService, CropService, SensorService]
})
export class DashboardComponent implements OnInit {
  // inject() picks up the runtime token; no constructor needed
  private farmerService = inject(FarmerService);
  private cropService   = inject(CropService);
  private sensorService = inject(SensorService);

  totalFarmers = 0;
  totalCrops   = 0;
  totalSensors = 0;

  loading = true;
  error?: string;

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    this.error = undefined;

    let fDone = false, cDone = false, sDone = false;
    const done = () => { if (fDone && cDone && sDone) this.loading = false; };

    this.farmerService.getAll().subscribe({
      next: (list: any[]) => { this.totalFarmers = (list ?? []).length; fDone = true; done(); },
      error: () => { fDone = true; done(); }
    });

    this.cropService.getAll().subscribe({
      next: (list: any[]) => { this.totalCrops = (list ?? []).length; cDone = true; done(); },
      error: () => { cDone = true; done(); }
    });

    this.sensorService.getAll().subscribe({
      next: (list: any[]) => { this.totalSensors = (list ?? []).length; sDone = true; done(); },
      error: () => { sDone = true; done(); }
    });
  }
}
