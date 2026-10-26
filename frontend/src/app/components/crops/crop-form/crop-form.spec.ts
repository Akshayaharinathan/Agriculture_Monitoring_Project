import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropForm } from './crop-form';

describe('CropForm', () => {
  let component: CropForm;
  let fixture: ComponentFixture<CropForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
