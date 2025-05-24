import { Component, Input, OnInit } from '@angular/core';
import { DotaHero, DotaHeroSummary } from 'app/model/dota-hero';
import { DotaHelperService } from 'app/service/dota-helper.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';
import { DotaFacet } from 'app/model/dota-hero-abilities';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-dota-hero',
	imports: [
		CommonModule,
		RouterModule,
		NzToolTipModule
	],
	templateUrl: './dota-hero-image.component.html',
	styleUrl: './dota-hero-image.component.less'
})
export class DotaHeroImageComponent implements OnInit {

	@Input() hero?: DotaHero | DotaHeroSummary;
	@Input() selectedFacet?: DotaFacet;
	@Input() full?: boolean = false;

	constructor(private dotaHelperService: DotaHelperService) {
		
	}

	ngOnInit() {
		
	}
}
