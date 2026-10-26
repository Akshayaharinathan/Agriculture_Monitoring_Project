
// // src/app/components/cultivation/cultivation-form/cultivation-form.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CultivationService } from '../../../services/cultivation';
// import { CultivationModel } from '../../../model/cultivation.model';

// @Component({
//   selector: 'app-cultivation-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './cultivation-form.html',
//   styleUrls: ['./cultivation-form.css'],
// })
// export class CultivationFormComponent implements OnInit {
//   id?: number;
//   title = 'Create Cultivation';
//   form!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private cultivationService: CultivationService
//   ) {
//     // Initialize reactive form (PascalCase keys to match your model + list template)
//     this.form = this.fb.group({
//       FarmerId: [null, [Validators.required, Validators.min(1)]],
//       CropId: [null, [Validators.required, Validators.min(1)]],
//       StartDate: [''],                   // optional ISO date string
//       AreaInAcres: [null, [Validators.min(0)]],
//       IsHarvested: [false],              // default false
//       HarvestedOn: ['']                  // optional ISO date string
//     });
//   }

//   // ngOnInit(): void {
//   //   const idParam = this.route.snapshot.paramMap.get('id');
//   //   this.id = idParam ? Number(idParam) : undefined;

//   //   if (this.id) {
//   //     this.title = 'Edit Cultivation';
//   //     this.cultivationService.getById(this.id).subscribe({
//   //       next: (c: CultivationModel) => {
//   //         // Patch values; keep keys identical to CultivationModel/form controls
//   //         this.form.patchValue({
//   //           FarmerId: c.FarmerId,
//   //           CropId: c.CropId,
//   //           StartDate: c.StartDate ?? '',
//   //           AreaInAcres: c.AreaInAcres ?? null,
//   //           IsHarvested: c.IsHarvested ?? false,
//   //           HarvestedOn: c.HarvestedOn ?? ''
//   //         });
//   //       },
//   //       error: () => alert('Failed to load cultivation'),
//   //     });
//   //   }
//   // }
  
// // src/app/components/cultivation/cultivation-form/cultivation-form.ts
// ngOnInit(): void {
//   const farmerIdParam = this.route.snapshot.paramMap.get('farmerId');
//   const cropIdParam = this.route.snapshot.paramMap.get('cropId');

//   const farmerId = farmerIdParam ? Number(farmerIdParam) : undefined;
//   const cropId = cropIdParam ? Number(cropIdParam) : undefined;

//   // If both are present, we're in edit mode
//   if (farmerId && cropId) {
//     this.title = 'Edit Cultivation';

//     // adjust your service to support composite key
//     this.cultivationService.getByKey(farmerId, cropId).subscribe({
//       next: (c: CultivationModel) => {
//         this.form.patchValue({
//           FarmerId: c.FarmerId,
//           CropId: c.CropId,
//           StartDate: c.StartDate ?? '',
//           AreaInAcres: c.AreaInAcres ?? null,
//           IsHarvested: c.IsHarvested ?? false,
//           HarvestedOn: c.HarvestedOn ?? ''
//         });
//       },
//       error: () => alert('Failed to load cultivation'),
//     });
//   }
// }


//   // save(): void {
//   //   if (this.form.invalid) return;

//   //   const value = this.form.value as CultivationModel;

//   //   // If harvested is unchecked, ensure HarvestedOn is blank for consistency
//   //   if (!value.IsHarvested) {
//   //     value.HarvestedOn = undefined;
//   //   }

//   //   if (this.id) {
//   //     this.cultivationService.update(this.id, { ...value, Id: this.id }).subscribe({
//   //       next: () => this.router.navigate(['/cultivations']),
//   //       error: () => alert('Update failed'),
//   //     });
//   //   } else {
//   //     this.cultivationService.create(value).subscribe({
//   //       next: () => this.router.navigate(['/cultivations']),
//   //       error: () => alert('Create failed'),
//   //     });
//   //   }
//   // }
  

// save(): void {
//   if (this.form.invalid) {
//     this.form.markAllAsTouched();
//     return;
//   }

//   // Include disabled controls too
//   const ui = this.form.getRawValue() as CultivationModel;

//   // Clear harvestedOn if not harvested
//   if (!ui.IsHarvested) {
//     ui.HarvestedOn = undefined;
//   }

//   // Use route params to determine edit vs create
//   const farmerIdParam = this.route.snapshot.paramMap.get('farmerId');
//   const cropIdParam = this.route.snapshot.paramMap.get('cropId');

//   if (farmerIdParam && cropIdParam) {
//     // EDIT
//     this.cultivationService.updateByKey(ui.FarmerId, ui.CropId, ui).subscribe({
//       next: () => this.router.navigate(['/cultivations']),
//       error: (err) => {
//         console.error('Update failed', err);
//         alert('Update failed');
//       },
//     });
//   } else {
//     // CREATE
//     this.cultivationService.create(ui).subscribe({
//       next: () => this.router.navigate(['/cultivations']),
//       error: (err) => {
//         console.error('Create failed', err);
//         alert('Create failed');
//       },
//     });
//   }
// }


//   cancel(): void {
//     this.router.navigate(['/cultivations']);
//   }
// }

// src/app/components/cultivation/cultivation-form/cultivation-form.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CultivationService } from '../../../services/cultivation';
// import { CultivationModel } from '../../../model/cultivation.model';

// @Component({
//   selector: 'app-cultivation-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './cultivation-form.html',
//   styleUrls: ['./cultivation-form.css'],
// })
// export class CultivationFormComponent implements OnInit {
//   id?: number; // not used for composite-key routes; retained for header logic if needed
//   title = 'Create Cultivation';
//   form!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private cultivationService: CultivationService
//   ) {
//     // Initialize reactive form (PascalCase keys to match your model + list template)
//     this.form = this.fb.group({
//       FarmerId: [null, [Validators.required, Validators.min(1)]],
//       CropId: [null, [Validators.required, Validators.min(1)]],
//       StartDate: [''],                   // optional YYYY-MM-DD (input type="date")
//       AreaInAcres: [null, [Validators.min(0)]],
//       IsHarvested: [false],              // default false
//       HarvestedOn: ['']                  // optional YYYY-MM-DD
//     });

//     // React to IsHarvested changes: toggle validators + enable/disable date field
//     const isHarvestedCtrl = this.form.get('IsHarvested');
//     const harvestedOnCtrl = this.form.get('HarvestedOn');

//     isHarvestedCtrl?.valueChanges.subscribe((checked: boolean) => {
//       if (!harvestedOnCtrl) return;

//       if (checked) {
//         harvestedOnCtrl.enable();
//         harvestedOnCtrl.addValidators([Validators.required]);

//         // If user checked harvested and no date chosen, default to today
//         if (!harvestedOnCtrl.value) {
//           const today = new Date();
//           const yyyy = today.getFullYear();
//           const mm = String(today.getMonth() + 1).padStart(2, '0');
//           const dd = String(today.getDate()).padStart(2, '0');
//           harvestedOnCtrl.setValue(`${yyyy}-${mm}-${dd}`, { emitEvent: false });
//         }
//       } else {
//         harvestedOnCtrl.clearValidators();
//         harvestedOnCtrl.setValue('', { emitEvent: false });
//         harvestedOnCtrl.disable();
//       }
//       harvestedOnCtrl.updateValueAndValidity({ emitEvent: false });
//     });

//     // Start with HarvestedOn disabled while unchecked
//     harvestedOnCtrl?.disable({ emitEvent: false });
//   }

//   ngOnInit(): void {
//     // Composite route params if editing: /cultivations/:farmerId/:cropId/edit
//     const farmerIdParam = this.route.snapshot.paramMap.get('farmerId');
//     const cropIdParam = this.route.snapshot.paramMap.get('cropId');

//     const farmerId = farmerIdParam ? Number(farmerIdParam) : undefined;
//     const cropId = cropIdParam ? Number(cropIdParam) : undefined;

//     // If both are present, we're in edit mode
//     if (farmerId && cropId) {
//       this.title = 'Edit Cultivation';

//       this.cultivationService.getByKey(farmerId, cropId).subscribe({
//         next: (c: CultivationModel) => {
//           // Patch values; keep keys identical to CultivationModel/form controls
//           this.form.patchValue({
//             FarmerId: c.FarmerId,
//             CropId: c.CropId,
//             StartDate: c.StartDate ?? '',
//             AreaInAcres: c.AreaInAcres ?? null,
//             IsHarvested: c.IsHarvested ?? false,
//             HarvestedOn: c.HarvestedOn ?? ''
//           }, { emitEvent: true }); // ensures IsHarvested valueChanges runs
//         },
//         error: () => alert('Failed to load cultivation'),
//       });
//     }
//   }

//   save(): void {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     // Include disabled controls too (e.g., HarvestedOn when unchecked)
//     const ui = this.form.getRawValue() as CultivationModel;

//     // If harvested is unchecked, ensure HarvestedOn is blank for consistency
//     if (!ui.IsHarvested) {
//       ui.HarvestedOn = undefined;
//     }

//     // Use composite route params to determine edit vs create
//     const farmerIdParam = this.route.snapshot.paramMap.get('farmerId');
//     const cropIdParam = this.route.snapshot.paramMap.get('cropId');

//     if (farmerIdParam && cropIdParam) {
//       // EDIT (PUT /api/Cultivations/{farmerId}/{cropId})
//       this.cultivationService.updateByKey(ui.FarmerId, ui.CropId, ui).subscribe({
//         next: () => this.router.navigate(['/cultivations']),
//         error: (err) => {
//           console.error('Update failed', err);
//           alert(this.humanizeError(err));
//         },
//       });
//     } else {
//       // CREATE (POST /api/Cultivations)
//       this.cultivationService.create(ui).subscribe({
//         next: () => this.router.navigate(['/cultivations']),
//         error: (err) => {
//           console.error('Create failed', err);
//           alert(this.humanizeError(err));
//         },
//       });
//     }
//   }

//   cancel(): void {
//     this.router.navigate(['/cultivations']);
//   }

//   /** Optional: turn common .NET error bodies into readable text */
//   private humanizeError(err: any): string {
//     try {
//       if (typeof err?.error === 'string') return err.error;
//       if (err?.error?.message) return err.error.message;
//       if (err?.error?.title) return err.error.title;
//       if (err?.error?.errors) {
//         const msgs = Object.values(err.error.errors).flat() as string[];
//         if (msgs?.length) return msgs.join('\n');
//       }
//     } catch {}
//     return 'Operation failed. Please check your inputs and try again.';
//   }
// }


// src/app/components/cultivation/cultivation-form/cultivation-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CultivationService } from '../../../services/cultivation';
import { FarmerService } from '../../../services/farmer';
import { CropService } from '../../../services/crops';
import { CultivationModel } from '../../../model/cultivation.model';

@Component({
  selector: 'app-cultivation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cultivation-form.html',
  styleUrls: ['./cultivation-form.css'],
})
export class CultivationFormComponent implements OnInit {
  id?: number; // still unused for composite key routes
  title = 'Create Cultivation';
  form!: FormGroup;

  // Dropdown options (id + name)
  farmersOptions: { id: number; name: string }[] = [];
  cropsOptions: { id: number; name: string }[] = [];

  // Local UI selection for names (used only for display)
  selectedFarmerNameId?: number;
  selectedCropNameId?: number;

  loadingOptions = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cultivationService: CultivationService,
    private farmerService: FarmerService,
    private cropService: CropService
  ) {
    // Initialize reactive form (keys match CultivationModel)
    this.form = this.fb.group({
      FarmerId: [null, [Validators.required, Validators.min(1)]],
      CropId: [null, [Validators.required, Validators.min(1)]],
      StartDate: [''],
      AreaInAcres: [null, [Validators.min(0)]],
      IsHarvested: [false],
      HarvestedOn: ['']
    });

    // Toggle HarvestedOn validation based on IsHarvested
    const isHarvestedCtrl = this.form.get('IsHarvested');
    const harvestedOnCtrl = this.form.get('HarvestedOn');

    isHarvestedCtrl?.valueChanges.subscribe((checked: boolean) => {
      if (!harvestedOnCtrl) return;

      if (checked) {
        harvestedOnCtrl.enable();
        harvestedOnCtrl.addValidators([Validators.required]);
        if (!harvestedOnCtrl.value) {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          harvestedOnCtrl.setValue(`${yyyy}-${mm}-${dd}`, { emitEvent: false });
        }
      } else {
        harvestedOnCtrl.clearValidators();
        harvestedOnCtrl.setValue('', { emitEvent: false });
        harvestedOnCtrl.disable();
      }
      harvestedOnCtrl.updateValueAndValidity({ emitEvent: false });
    });

    harvestedOnCtrl?.disable({ emitEvent: false });
  }

  ngOnInit(): void {
    // Load dropdown options in parallel
    this.loadOptions();

    // Composite route params for edit: /cultivations/:farmerId/:cropId/edit
    const farmerIdParam = this.route.snapshot.paramMap.get('farmerId');
    const cropIdParam = this.route.snapshot.paramMap.get('cropId');

    const farmerId = farmerIdParam ? Number(farmerIdParam) : undefined;
    const cropId = cropIdParam ? Number(cropIdParam) : undefined;

    if (farmerId && cropId) {
      this.title = 'Edit Cultivation';

      this.cultivationService.getByKey(farmerId, cropId).subscribe({
        next: (c: CultivationModel) => {
          // Patch model values
          this.form.patchValue({
            FarmerId: c.FarmerId,
            CropId: c.CropId,
            StartDate: c.StartDate ?? '',
            AreaInAcres: c.AreaInAcres ?? null,
            IsHarvested: c.IsHarvested ?? false,
            HarvestedOn: c.HarvestedOn ?? ''
          }, { emitEvent: true });

          // Once options are loaded, reflect name selections
          // (If options not yet loaded, we’ll set selection in loadOptions too)
          this.selectedFarmerNameId = c.FarmerId;
          this.selectedCropNameId = c.CropId;
        },
        error: () => alert('Failed to load cultivation'),
      });
    }
  }

  private loadOptions(): void {
    this.loadingOptions = true;

    // Fetch farmers
    this.farmerService.getAll().subscribe({
      next: (list: any[]) => {
        this.farmersOptions = (list ?? [])
          .map(f => ({ id: f.id ?? f.Id, name: f.name ?? f.Name ?? '—' }))
          .filter(x => x.id != null);

        // If form already has FarmerId, set dropdown to match
        const fid = this.form.get('FarmerId')?.value;
        if (fid) this.selectedFarmerNameId = Number(fid);
      },
      error: () => { /* silent */ }
    });

    // Fetch crops
    this.cropService.getAll().subscribe({
      next: (list: any[]) => {
        this.cropsOptions = (list ?? [])
          .map(c => ({ id: c.id ?? c.Id, name: c.name ?? c.Name ?? '—' }))
          .filter(x => x.id != null);

        // If form already has CropId, set dropdown to match
        const cid = this.form.get('CropId')?.value;
        if (cid) this.selectedCropNameId = Number(cid);
      },
      error: () => { /* silent */ }
    });

    // Minor UI flag clean-up (optional if you show a skeleton/loader for selects)
    this.loadingOptions = false;
  }

  /** When user picks a farmer by name, set FarmerId (backend field) */
  onFarmerNameChange(val: string) {
    const id = val ? Number(val) : undefined;
    this.selectedFarmerNameId = id;
    this.form.get('FarmerId')?.setValue(id ?? null);
    this.form.get('FarmerId')?.markAsTouched();
    this.form.get('FarmerId')?.updateValueAndValidity();
  }

  /** When user picks a crop by name, set CropId (backend field) */
  onCropNameChange(val: string) {
    const id = val ? Number(val) : undefined;
    this.selectedCropNameId = id;
    this.form.get('CropId')?.setValue(id ?? null);
    this.form.get('CropId')?.markAsTouched();
    this.form.get('CropId')?.updateValueAndValidity();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const ui = this.form.getRawValue() as CultivationModel;

    if (!ui.IsHarvested) {
      ui.HarvestedOn = undefined; // Keep payload consistent
    }

    const farmerIdParam = this.route.snapshot.paramMap.get('farmerId');
    const cropIdParam = this.route.snapshot.paramMap.get('cropId');

    if (farmerIdParam && cropIdParam) {
      this.cultivationService.updateByKey(ui.FarmerId, ui.CropId, ui).subscribe({
        next: () => this.router.navigate(['/cultivations']),
        error: (err) => {
          console.error('Update failed', err);
          alert(this.humanizeError(err));
        },
      });
    } else {
      this.cultivationService.create(ui).subscribe({
        next: () => this.router.navigate(['/cultivations']),
        error: (err) => {
          console.error('Create failed', err);
          alert(this.humanizeError(err));
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/cultivations']);
  }

  private humanizeError(err: any): string {
    try {
      if (typeof err?.error === 'string') return err.error;
      if (err?.error?.message) return err.error.message;
      if (err?.error?.title) return err.error.title;
      if (err?.error?.errors) {
        const msgs = Object.values(err.error.errors).flat() as string[];
        if (msgs?.length) return msgs.join('\n');
      }
    } catch {}
    return 'Operation failed. Please check your inputs and try again.';
  }
}
