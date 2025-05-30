import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { DotaHelperService, DotaMetaService, DotaLeagueService } from '@app/service';
import { DotaPlayerPositions, DotaHeroImageComponent } from '@app/shared';
import { BestHeroesRequest, DotaLeague } from '@app/model';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzSliderModule } from 'ng-zorro-antd/slider';

@Component({
	selector: 'app-dota-meta',
	imports: [
		CommonModule,
		FormsModule,
		NzTabsModule,
		NzCardModule,
		NzTableModule,
		NzToolTipModule,
		NzProgressModule,
		NzGridModule,
		NzSelectModule,
		NzInputModule,
		NzButtonModule,
		NzTagModule,
		NzIconModule,
		DotaHeroImageComponent,
		NzSliderModule
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
	public currentLeague: DotaLeague | null = null;

	constructor(
		private dotaMetaService: DotaMetaService,
		private dotaHelperService: DotaHelperService,
		private dotaLeagueService: DotaLeagueService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		// Subscribe to query params
		this.route.queryParams.subscribe(params => {
			// Update the bestHeroesRequest with query params
			this.bestHeroesRequest.days = params['days'] ? parseInt(params['days']) : 14;
			this.bestHeroesRequest.minMatches = params['minMatches'] ? parseInt(params['minMatches']) : 10;
			this.bestHeroesRequest.page = params['page'] ? parseInt(params['page']) : 1;
			this.bestHeroesRequest.limit = params['limit'] ? parseInt(params['limit']) : 10;
			
			if (params['leagueId']) {
				this.bestHeroesRequest.leagueId = parseInt(params['leagueId']);
				this.fetchLeagueInfo(this.bestHeroesRequest.leagueId);
			} else {
				this.currentLeague = null;
			}
			
			if (params['position']) {
				this.selectedPosition = params['position'];
				this.bestHeroesRequest.position = params['position'];
				
				// Find the position index to select the correct tab
				const positionIndex = this.positions.findIndex(p => p.value === this.selectedPosition);
				if (positionIndex >= 0) {
					setTimeout(() => {
						this.changePositionTab(positionIndex);
					});
				}
			}
			
			// Get best heroes with the updated request
			this.getBestHeroes(this.bestHeroesRequest);
		});
	}

	private fetchLeagueInfo(leagueId: number) {
		this.dotaLeagueService.getLeagueInfo(leagueId).subscribe({
			next: (league: DotaLeague | null) => {
				this.currentLeague = league;
			},
			error: (error: any) => {
				console.error('Error fetching league info:', error);
				this.currentLeague = {
					id: leagueId.toString(),
					leagueId: leagueId,
					name: 'Torneio',
					displayName: `Torneio ID ${leagueId}`,
					tier: null,
					region: null
				};
			}
		});
	}

	// Method to change position from tab index
	public changePositionTab(index: number) {
		this.changePosition(this.positions[index].value);
	}

	public changePosition(position: string | null = null) {
		this.selectedPosition = position;
		this.bestHeroesRequest.position = position as any;
		this.bestHeroesRequest.page = 1;
		this.updateUrlParams();
		this.getBestHeroes(this.bestHeroesRequest);
	}

	public changePage(params: NzTableQueryParams) {
		this.bestHeroesRequest.page = params.pageIndex;
		this.updateUrlParams();
		this.getBestHeroes(this.bestHeroesRequest);
	}

	public applyFilters() {
		this.bestHeroesRequest.page = 1;
		this.updateUrlParams();
		this.getBestHeroes(this.bestHeroesRequest);
	}

	private updateUrlParams() {
		// Create query params object from the request
		const queryParams: any = {};
		
		if (this.bestHeroesRequest.days !== 14) {
			queryParams.days = this.bestHeroesRequest.days;
		}
		
		if (this.bestHeroesRequest.minMatches !== 10) {
			queryParams.minMatches = this.bestHeroesRequest.minMatches;
		}
		
		if (this.bestHeroesRequest.leagueId) {
			queryParams.leagueId = this.bestHeroesRequest.leagueId;
		}
		
		if (this.bestHeroesRequest.position) {
			queryParams.position = this.bestHeroesRequest.position;
		}
		
		if (this.bestHeroesRequest.page !== 1) {
			queryParams.page = this.bestHeroesRequest.page;
		}
		
		if (this.bestHeroesRequest.limit !== 10) {
			queryParams.limit = this.bestHeroesRequest.limit;
		}
		
		// Update the URL without reloading the page
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			replaceUrl: true
		});
	}

	private getBestHeroes(bestHeroesRequest: BestHeroesRequest) {
		this.loading = true;
		// this.dotaMetaService.getBestHeroes(bestHeroesRequest).subscribe({
		// 	next: (data) => {
		// 		data.data.forEach((hero: any) => {
		// 			// First get the summary data which is lighter
		// 			hero.dotaHero = this.dotaHelperService.getHeroDataSummary(hero.heroId);
					
		// 			// Only load full hero data if we need facet information
		// 			if (hero.facetId) {
		// 				let heroAbilities = this.dotaHelperService.getHeroAbilityData(hero.dotaHero.name);
		// 				if (heroAbilities) {
		// 					hero.selectedFacet = heroAbilities.facets[hero.facetId - 1];
		// 				}
		// 			}

		// 			hero.dotaHero.positionImage = this.getPositionImage(hero.position);
		// 			hero.dotaHero.positionLabel = this.getPositionLabel(hero.position);

		// 			if (hero.totalMatches > this.highestMatches) {
		// 				this.highestMatches = hero.totalMatches;
		// 			}
		// 		});
		// 		this.bestHeroes = data.data;
		// 		this.totalResults = data.total;
		// 		this.loading = false;
		// 	},
		// 	error: (error) => {
		// 		console.error(error);
		// 		this.loading = false;
		// 	}
		// });
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

	clearLeagueFilter() {
		delete this.bestHeroesRequest.leagueId;
		this.currentLeague = null;
		this.applyFilters();
	}
}
