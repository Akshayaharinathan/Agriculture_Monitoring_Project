import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultivationList } from './cultivation-list';

describe('CultivationList', () => {
  let component: CultivationList;
  let fixture: ComponentFixture<CultivationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CultivationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CultivationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
