import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotaRankItemComponent } from './dota-rank-item.component';

describe('DotaRankItemComponent', () => {
  let component: DotaRankItemComponent;
  let fixture: ComponentFixture<DotaRankItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotaRankItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotaRankItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
