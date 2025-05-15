import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DotaHelperService, DotaMetaService } from '@app/service';
import { DotaPlayerPositions, DotaHeroImageComponent } from '@app/shared';
import { BestHeroesRequest } from '@app/model';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
	selector: 'app-dota-meta',
	imports: [
		CommonModule,
		NzTabsModule,
		NzCardModule,
		NzTableModule,
		NzToolTipModule,
		NzProgressModule,
		NzGridModule,
		DotaHeroImageComponent
	],
	templateUrl: './dota-meta.component.html',
	styleUrl: './dota-meta.component.less'
})
export class DotaMetaComponent implements OnInit {
	public totalBestHeroes: number = 0;
	public bestHeroes: any[] = [];
	public loading: boolean = false;

	public selectedPosition: string | null = null;
	public positions = DotaPlayerPositions.positions;

	public bestHeroesRequest: BestHeroesRequest = {
		days: 14,
		minMatches: 10,
		page: 1,
		limit: 10
	};

	public totalResults: number = 0;

	public highestMatches: number = 0;

	constructor(
		private dotaMetaService: DotaMetaService,
		private dotaHelperService: DotaHelperService,
		private router: Router
	) {}

	ngOnInit() {
	}


	public changePosition(position: string | null = null) {
		this.selectedPosition = position;
		this.bestHeroesRequest.position = position as any;
		this.bestHeroesRequest.page = 1;
		this.getBestHeroes(this.bestHeroesRequest);
	}

	public changePage(params: NzTableQueryParams) {
		this.bestHeroesRequest.page = params.pageIndex;
		this.getBestHeroes(this.bestHeroesRequest);
	}

	private getBestHeroes(bestHeroesRequest: BestHeroesRequest) {
		this.loading = true;
		this.dotaMetaService.getBestHeroes(bestHeroesRequest).subscribe({
			next: (data) => {
				data.data.forEach((hero: any) => {
					hero.dotaHero = this.dotaHelperService.getHeroData(hero.heroId);
					let heroAbilities = this.dotaHelperService.getHeroAbilityData(hero.dotaHero.name);

					if(heroAbilities && hero.facetId) {
						hero.selectedFacet = heroAbilities.facets[hero.facetId - 1];
					}

					if (hero.totalMatches > this.highestMatches) {
						this.highestMatches = hero.totalMatches;
					}
				});
				this.bestHeroes = data.data;
				this.totalResults = data.total;
				this.loading = false;
			},
			error: (error) => {
				console.error(error);
				this.loading = false;
			}
		});
	}

	getPositionImage(position: string) {
		return DotaPlayerPositions.getPositionImage(position);
	}

	getPositionLabel(position: string) {
		return DotaPlayerPositions.getPositionLabel(position);
	}

	goToHero(hero: string) {
		this.router.navigate(['/dota-meta/heroes', hero]);
	}
}
