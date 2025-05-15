import { Component, Input, OnInit } from '@angular/core';
import { DotaHero } from 'app/model/dota-hero';
import { DotaHelperService } from 'app/service/dota-helper.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';
import { DotaFacet } from 'app/model/dota-hero-abilities';

@Component({
	selector: 'app-dota-hero',
	imports: [
		CommonModule,
		NzToolTipModule
	],
	templateUrl: './dota-hero-image.component.html',
	styleUrl: './dota-hero-image.component.less'
})
export class DotaHeroImageComponent implements OnInit {

	
	@Input() hero?: DotaHero;
	@Input() selectedFacet?: DotaFacet;

	constructor(private dotaHelperService: DotaHelperService) {
		
	}

	ngOnInit() {
		
	}
}
