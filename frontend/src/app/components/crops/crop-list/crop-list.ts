
// src/app/components/crop/crop-list/crop-list.ts
import { Component, OnInit } from '@angular/core';
import { CropService } from '../../../services/crops';
import { SensorService } from '../../../services/sensor';
import { CropModel } from '../../../model/crop.model';
import { Router } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './crop-list.html',
  styleUrls: ['./crop-list.css']
})
export class CropListComponent implements OnInit {
  crops: (CropModel & { variety?: string })[] = [];   // ⬅️ include variety for view
  loading = true;
  error?: string;

  /** Map cropId -> sensor count */
  sensorCountByCrop = new Map<number, number>();

  constructor(
    private cropService: CropService,
    private sensorService: SensorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    // Load crops
    this.cropService.getAll().subscribe({
      next: (data: any[]) => {
        // Normalize crop list defensively (id/name + variety)
        this.crops = (data ?? [])
          .map(c => ({
            id: Number(c.id ?? c.Id),
            name: (c.name ?? c.Name ?? '—').toString(),
            variety: (c.variety ?? c.Variety ?? '').toString() || undefined  // ⬅️ add variety
          }))
          .filter(c => !Number.isNaN(c.id));

        // After crops load, load sensors to compute counts
        this.loadSensorsForCounts();
      },
      error: () => {
        this.error = 'Failed to load crops';
        this.loading = false;
      }
    });
  }

  /** Load sensors and compute count per CropId */
  private loadSensorsForCounts(): void {
    this.sensorCountByCrop.clear();

    this.sensorService.getAll().subscribe({
      next: (data: any[]) => {
        const counts = new Map<number, number>();
        (data ?? []).forEach(s => {
          const cropId = Number(s.CropId ?? s.cropId);
          if (Number.isNaN(cropId)) return;
          counts.set(cropId, (counts.get(cropId) ?? 0) + 1);
        });
        this.sensorCountByCrop = counts;
        this.loading = false;
      },
      error: () => {
        // If sensors failed, show crops anyway, counts default to 0
        this.loading = false;
      }
    });
  }

  /** Helper to read sensor count safely */
  sensorsCountForCrop(id?: number): number {
    if (id == null) return 0;
    return this.sensorCountByCrop.get(Number(id)) ?? 0;
  }

  addNew(): void {
    this.router.navigate(['/crops/new']);
  }

  edit(id?: number): void {
    if (id) this.router.navigate(['/crops', id, 'edit']);
  }

  delete(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this crop?')) return;
    this.cropService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Delete failed')
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
