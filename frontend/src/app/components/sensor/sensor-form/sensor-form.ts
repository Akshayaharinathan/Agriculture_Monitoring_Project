 
// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { ActivatedRoute, Router } from '@angular/router';
// // import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { SensorService } from '../../../services/sensor';  // ✅ ensure correct path
// // import { SensorModel } from '../../../model/sensor.model';
// // @Component({
// //   selector: 'app-sensor-form',
// //   standalone: true,
// //   imports: [CommonModule, ReactiveFormsModule],
// //   templateUrl: './sensor-form.html',
// //   styleUrls: ['./sensor-form.css'],
// // })
// // export class SensorFormComponent implements OnInit {
// //   id?: number;
// //   title = 'Create Sensor';
 
// //   statusOptions = [
// //     { value: 0, label: 'Inactive' },
// //     { value: 1, label: 'Active' },
// //     { value: 2, label: 'Maintenance' },
// //   ];
 
// //   // ❌ don't initialize with this.fb here
// //   // ✅ declare the type
// //   form!: FormGroup;
 
// //   constructor(
// //     private fb: FormBuilder,
// //     private route: ActivatedRoute,
// //     private router: Router,
// //     private sensorService: SensorService
// //   ) {
// //     // ✅ initialize in the constructor (or ngOnInit)
// //     this.form = this.fb.group({
// //       code: ['', [Validators.required, Validators.maxLength(80)]],
// //       type: ['SoilMoisture', [Validators.required, Validators.maxLength(100)]],
// //       location: [''],
// //       status: [1, [Validators.required]], // default Active
// //     });
// //   }
 
// //   ngOnInit(): void {
// //     const idParam = this.route.snapshot.paramMap.get('id');
// //     this.id = idParam ? Number(idParam) : undefined;
 
// //     if (this.id) {
// //       this.title = 'Edit Sensor';
// //       this.sensorService.getById(this.id).subscribe({
// //         next: (sensor) => {
// //           this.form.patchValue({
// //             code: sensor.code,
// //             type: sensor.type,
// //             location: sensor.location,
// //             status: sensor.status,
// //           });
// //         },
// //         error: () => alert('Failed to load sensor'),
// //       });
// //     }
// //   }
 
// //   save(): void {
// //     if (this.form.invalid) return;
 
// //     const value = this.form.value as SensorModel;
 
// //     if (this.id) {
// //       this.sensorService.update(this.id, { ...value, id: this.id }).subscribe({
// //         next: () => this.router.navigate(['/sensors']),
// //         error: () => alert('Update failed'),
// //       });
// //     } else {
// //       this.sensorService.create(value).subscribe({
// //         next: () => this.router.navigate(['/sensors']),
// //         error: () => alert('Create failed'),
// //       });
// //     }
// //   }
 
// //   cancel(): void {
// //     this.router.navigate(['/sensors']);
// //   }
// // }


// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { SensorService } from '../../../services/sensor';    // ✅ ensure correct path
// import { SensorModel } from '../../../model/sensor.model';

// @Component({
//   selector: 'app-sensor-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './sensor-form.html',
//   styleUrls: ['./sensor-form.css'],
// })
// export class SensorFormComponent implements OnInit {
//   id?: number;
//   title = 'Create Sensor';

//   form!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private sensorService: SensorService
//   ) {
//     this.form = this.fb.group({
//       SerialNumber: ['', [Validators.required, Validators.maxLength(120)]],
//       Type: ['', [Validators.required, Validators.maxLength(50)]],
//       FarmerId: [null, [Validators.required, Validators.min(1)]],
//       CropId: [null, [Validators.required, Validators.min(1)]],
//       InstalledOn: [''], // string (ISO date) — optional
//       IsActive: [true],  // default active
//     });
//   }

//   ngOnInit(): void {
//     const idParam = this.route.snapshot.paramMap.get('id');
//     this.id = idParam ? Number(idParam) : undefined;

//     if (this.id) {
//       this.title = 'Edit Sensor';
//       this.sensorService.getById(this.id).subscribe({
//         next: (sensor: SensorModel) => {
//           // Patch form values. Keep keys identical to SensorModel
//           this.form.patchValue({
//             SerialNumber: sensor.SerialNumber,
//             Type: sensor.Type,
//             FarmerId: sensor.FarmerId,
//             CropId: sensor.CropId,
//             InstalledOn: sensor.InstalledOn ?? '',
//             IsActive: sensor.IsActive ?? true,
//           });
//         },
//         error: () => alert('Failed to load sensor'),
//       });
//     }
//   }

//   save(): void {
//     if (this.form.invalid) return;

//     const value = this.form.value as SensorModel;

//     if (this.id) {
//       // Ensure Id is included on update payload
//       this.sensorService.update(this.id, { ...value, Id: this.id }).subscribe({
//         next: () => this.router.navigate(['/sensors']),
//         error: () => alert('Update failed'),
//       });
//     } else {
//       this.sensorService.create(value).subscribe({
//         next: () => this.router.navigate(['/sensors']),
//         error: () => alert('Create failed'),
//       });
//     }
//   }

//   cancel(): void {
//     this.router.navigate(['/sensors']);
//   }
// }


// src/app/components/sensor/sensor-form/sensor-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SensorService } from '../../../services/sensor';
import { FarmerService } from '../../../services/farmer';   // ⬅️ add
import { CropService } from '../../../services/crops';      // ⬅️ add
import { SensorModel } from '../../../model/sensor.model';

@Component({
  selector: 'app-sensor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sensor-form.html',
  styleUrls: ['./sensor-form.css'],
})
export class SensorFormComponent implements OnInit {
  id?: number;
  title = 'Create Sensor';

  form!: FormGroup;

  // Dropdown options (name + id from backend)
  farmersOptions: { id: number; name: string }[] = [];
  cropsOptions: { id: number; name: string }[] = [];

  // For displaying preselected values in dropdown
  selectedFarmerNameId?: number;
  selectedCropNameId?: number;

  loadingOptions = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sensorService: SensorService,
    private farmerService: FarmerService,   // ⬅️ add
    private cropService: CropService        // ⬅️ add
  ) {
    // Reactive form (payload fields remain IDs)
    this.form = this.fb.group({
      SerialNumber: ['', [Validators.required, Validators.maxLength(120)]],
      Type: ['', [Validators.required, Validators.maxLength(50)]],
      FarmerId: [null, [Validators.required, Validators.min(1)]],
      CropId: [null, [Validators.required, Validators.min(1)]],
      InstalledOn: [''], // optional ISO date
      IsActive: [true],  // default active
    });
  }

  ngOnInit(): void {
    // Load dropdown options first (or in parallel)
    this.loadOptions();

    // Route param for edit
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : undefined;

    if (this.id) {
      this.title = 'Edit Sensor';
      this.sensorService.getById(this.id).subscribe({
        next: (sensor: SensorModel) => {
          // Patch form values (IDs included)
          this.form.patchValue({
            SerialNumber: sensor.SerialNumber,
            Type: sensor.Type,
            FarmerId: sensor.FarmerId,
            CropId: sensor.CropId,
            InstalledOn: sensor.InstalledOn ?? '',
            IsActive: sensor.IsActive ?? true,
          });

          // Preselect name dropdowns based on existing IDs
          this.selectedFarmerNameId = sensor.FarmerId;
          this.selectedCropNameId = sensor.CropId;
        },
        error: () => alert('Failed to load sensor'),
      });
    }
  }

  /** Fetch Farmer/Crop lists from backend */
  private loadOptions(): void {
    this.loadingOptions = true;

    this.farmerService.getAll().subscribe({
      next: (list: any[]) => {
        this.farmersOptions = (list ?? [])
          .map(f => ({ id: f.id ?? f.Id, name: f.name ?? f.Name ?? '—' }))
          .filter(x => x.id != null);

        // Sync dropdown with form's FarmerId if already present
        const fid = this.form.get('FarmerId')?.value;
        if (fid) this.selectedFarmerNameId = Number(fid);
      },
      error: () => { /* silent */ }
    });

    this.cropService.getAll().subscribe({
      next: (list: any[]) => {
        this.cropsOptions = (list ?? [])
          .map(c => ({ id: c.id ?? c.Id, name: c.name ?? c.Name ?? '—' }))
          .filter(x => x.id != null);

        // Sync dropdown with form's CropId if already present
        const cid = this.form.get('CropId')?.value;
        if (cid) this.selectedCropNameId = Number(cid);
      },
      error: () => { /* silent */ }
    });

    this.loadingOptions = false;
  }

  /** When user selects a farmer by name, set FarmerId (payload field) */
  onFarmerNameChange(val: string) {
    const id = val ? Number(val) : undefined;
    this.selectedFarmerNameId = id;
    this.form.get('FarmerId')?.setValue(id ?? null);
    this.form.get('FarmerId')?.markAsTouched();
    this.form.get('FarmerId')?.updateValueAndValidity();
  }

  /** When user selects a crop by name, set CropId (payload field) */
  onCropNameChange(val: string) {
    const id = val ? Number(val) : undefined;
    this.selectedCropNameId = id;
    this.form.get('CropId')?.setValue(id ?? null);
    this.form.get('CropId')?.markAsTouched();
    this.form.get('CropId')?.updateValueAndValidity();
  }

  save(): void {
    if (this.form.invalid) return;

    // Payload remains the model with IDs
    const value = this.form.getRawValue() as SensorModel;

    if (this.id) {
      this.sensorService.update(this.id, { ...value, Id: this.id }).subscribe({
        next: () => this.router.navigate(['/sensors']),
        error: () => alert('Update failed'),
      });
    } else {
      this.sensorService.create(value).subscribe({
        next: () => this.router.navigate(['/sensors']),
        error: () => alert('Create failed'),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/sensors']);
  }
}

 
 