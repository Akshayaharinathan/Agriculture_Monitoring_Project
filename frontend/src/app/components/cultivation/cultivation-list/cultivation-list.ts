
// src/app/components/cultivation/cultivation-list/cultivation-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CultivationService } from '../../../services/cultivation';
import { FarmerService } from '../../../services/farmer';
import { CropService } from '../../../services/crops';
import { CultivationModel } from '../../../model/cultivation.model';

@Component({
  selector: 'app-cultivation-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cultivation-list.html',
  styleUrls: ['./cultivation-list.css']
})
export class CultivationListComponent implements OnInit {
  cultivations: CultivationModel[] = [];
  filteredCultivations: CultivationModel[] = [];

  loading = true;
  error?: string;

  farmersOptions: { id: number; name: string }[] = [];
  cropsOptions: { id: number; name: string }[] = [];

  /** Fast lookup maps to resolve name by id in O(1) */
  private farmerNameByIdMap = new Map<number, string>();
  private cropNameByIdMap = new Map<number, string>();

  selectedStatus: '' | 'harvested' | 'inprogress' = '';
  selectedFarmerId?: number;
  selectedCropId?: number;

  constructor(
    private cultivationService: CultivationService,
    private farmerService: FarmerService,
    private cropService: CropService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();

    // Load farmers
    this.farmerService.getAll().subscribe({
      next: (list: any[]) => {
        this.farmersOptions = (list ?? [])
          .map(f => ({
            id: Number(f.id ?? f.Id),                      // ⬅️ coerce to number
            name: (f.name ?? f.Name ?? '—').toString()
          }))
          .filter(x => !Number.isNaN(x.id));
        // Build lookup map
        this.farmerNameByIdMap.clear();
        for (const f of this.farmersOptions) this.farmerNameByIdMap.set(f.id, f.name);
      },
      error: () => { /* silent */ }
    });

    // Load crops
    this.cropService.getAll().subscribe({
      next: (list: any[]) => {
        this.cropsOptions = (list ?? [])
          .map(c => ({
            id: Number(c.id ?? c.Id),                      // ⬅️ coerce to number
            name: (c.name ?? c.Name ?? '—').toString()
          }))
          .filter(x => !Number.isNaN(x.id));
        // Build lookup map
        this.cropNameByIdMap.clear();
        for (const c of this.cropsOptions) this.cropNameByIdMap.set(c.id, c.name);
      },
      error: () => { /* silent */ }
    });
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    this.cultivationService.getAll().subscribe({
      next: (data) => {
        // Optionally: coerce ids to numbers here too (defensive)
        this.cultivations = (data ?? []).map(c => ({
          ...c,
          FarmerId: c.FarmerId != null ? Number(c.FarmerId) : c.FarmerId,
          CropId:   c.CropId   != null ? Number(c.CropId)   : c.CropId,
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load cultivations';
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
    this.selectedStatus = (val === 'harvested' || val === 'inprogress') ? val : '';
    this.applyFilters();
  }
  clearFarmerFilter() { this.selectedFarmerId = undefined; this.applyFilters(); }
  clearCropFilter()   { this.selectedCropId   = undefined; this.applyFilters(); }
  clearStatusFilter() { this.selectedStatus   = '';        this.applyFilters(); }

  private applyFilters(): void {
    const base = this.cultivations ?? [];
    this.filteredCultivations = base.filter(c =>
      (this.selectedFarmerId ? Number(c.FarmerId) === this.selectedFarmerId : true) &&
      (this.selectedCropId   ? Number(c.CropId)   === this.selectedCropId   : true) &&
      (
        this.selectedStatus === ''
          ? true
          : this.selectedStatus === 'harvested'
            ? !!c.IsHarvested
            : !c.IsHarvested
      )
    );
  }

  // ===== Actions =====
  addNew(): void { this.router.navigate(['/cultivations/new']); }
  edit(farmerId: number, cropId: number): void {
    if (farmerId && cropId) this.router.navigate(['/cultivations', farmerId, cropId, 'edit']);
  }
  delete(farmerId: number, cropId: number): void {
    if (farmerId == null || cropId == null) return;
    if (!confirm('Delete this cultivation?')) return;
    this.cultivationService.delete(farmerId, cropId).subscribe({
      next: () => this.load(),
      error: () => alert('Delete failed')
    });
  }

  // ===== Display helpers (use lookup maps) =====
  farmerNameById(id?: number): string {
    if (id == null) return '—';
    return this.farmerNameByIdMap.get(Number(id)) ?? '—';
  }
  cropNameById(id?: number): string {
    if (id == null) return '—';
    return this.cropNameByIdMap.get(Number(id)) ?? '—';
  }

  harvestedLabel(c: CultivationModel): string {
    return c.IsHarvested ? 'Harvested' : 'In Progress';
  }
  harvestedBadgeClass(c: CultivationModel): string {
    return c.IsHarvested ? 'bg-success' : 'bg-warning';
  }
}
