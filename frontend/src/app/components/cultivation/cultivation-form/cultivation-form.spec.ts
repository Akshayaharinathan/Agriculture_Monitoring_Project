import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultivationForm } from './cultivation-form';

describe('CultivationForm', () => {
  let component: CultivationForm;
  let fixture: ComponentFixture<CultivationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CultivationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CultivationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
