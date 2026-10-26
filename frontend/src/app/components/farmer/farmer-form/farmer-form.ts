import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FarmerService } from '../../../services/farmer';  // ✅ ensure correct path
import { FarmerModel } from '../../../model/farmer.model';
 
@Component({
  selector: 'app-farmer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ FormsModule not needed for reactive forms
  templateUrl: './farmer-form.html',
  styleUrls: ['./farmer-form.css'],
})
export class FarmerFormComponent implements OnInit {
  id?: number;
  title = 'Create Farmer';
 
  // ✅ Declare without initializing here
  form!: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private farmerService: FarmerService
  ) {
    // ✅ Initialize in constructor (or in ngOnInit)
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.email]],
      phone: [''],
    });
  }
 
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : undefined;
 
    if (this.id) {
      this.title = 'Edit Farmer';
      this.farmerService.getById(this.id).subscribe({
        next: (farmer) => {
          this.form.patchValue({
            name: farmer.name,
            // email: farmer.email,
            // phone: farmer.phone,
          });
        },
        error: () => alert('Failed to load farmer'),
      });
    }
  }
 
  save(): void {
    if (this.form.invalid) return;
 
    const value = this.form.value as FarmerModel;
 
    if (this.id) {
      this.farmerService.update(this.id, { ...value, id: this.id }).subscribe({
        next: () => this.router.navigate(['/farmers']),
        error: () => alert('Update failed'),
      });
    } else {
      this.farmerService.create(value).subscribe({
        next: () => this.router.navigate(['/farmers']),
        error: () => alert('Create failed'),
      });
    }
  }
 
  cancel(): void {
    this.router.navigate(['/farmers']);
  }
}
``