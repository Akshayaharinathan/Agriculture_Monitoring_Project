import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CropService } from '../../../services/crops';  // ✅ ensure correct path/name
import { CropModel } from '../../../model/crop.model'; 
 
@Component({
  standalone: true,
  imports: [ReactiveFormsModule], // FormsModule not needed for reactive forms
  templateUrl: './crop-form.html',
  styleUrls: ['./crop-form.css'],
})
export class CropFormComponent implements OnInit {
  id?: number;
  title = 'Create Crop';
 
  // ✅ declare, but DO NOT initialize with this.fb in a field initializer
  form!: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cropService: CropService
  ) {
    // ✅ initialize here (or in ngOnInit)
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
       variety: ['', [Validators.required, Validators.maxLength(120)]],
      // plantingDate: [''],
      // fieldLocation: [''],
      // farmerId: [1, [Validators.required]],
    });
  }
 
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : undefined;
 
    if (this.id) {
      this.title = 'Edit Crop';
      this.cropService.getById(this.id).subscribe({
        next: (crop) => {
          this.form.patchValue({
            name: crop.name,
            // plantingDate: crop.plantingDate, // ensure your model uses string/Date consistently
            // fieldLocation: crop.fieldLocation,
            // farmerId: crop.farmerId,
            variety:crop.variety,
          });
        },
        error: () => alert('Failed to load crop'),
      });
    }
  }
 
  save(): void {
    if (this.form.invalid) return;
 
    const value = this.form.value as CropModel;
 
    if (this.id) {
      this.cropService.update(this.id, { ...value, id: this.id }).subscribe({
        next: () => this.router.navigate(['/crops']),
        error: () => alert('Update failed'),
      });
    } else {
      this.cropService.create(value).subscribe({
        next: () => this.router.navigate(['/crops']),
        error: () => alert('Create failed'),
      });
    }
  }
 
  cancel(): void {
    this.router.navigate(['/crops']);
  }
}