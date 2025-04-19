import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotaMetaComponent } from './dota-meta.component';

describe('DotaMetaComponent', () => {
	let component: DotaMetaComponent;
	let fixture: ComponentFixture<DotaMetaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DotaMetaComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(DotaMetaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
