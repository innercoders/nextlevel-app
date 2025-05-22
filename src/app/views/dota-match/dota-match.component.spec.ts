import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotaMatchComponent } from './dota-match.component';

describe('DotaMatchComponent', () => {
  let component: DotaMatchComponent;
  let fixture: ComponentFixture<DotaMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotaMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotaMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
