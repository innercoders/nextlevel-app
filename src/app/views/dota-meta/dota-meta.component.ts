import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { DotaHelperService, DotaMetaService, DotaLeagueService } from '@app/service';
import { DotaPlayerPositions, DotaHeroImageComponent } from '@app/shared';
import { HeroStatsRequest, DotaLeague, DotaHero } from '@app/model';

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
import { NzSwitchModule } from 'ng-zorro-antd/switch';

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
		NzSliderModule,
		NzSwitchModule
	],
	templateUrl: './dota-meta.component.html',
	styleUrl: './dota-meta.component.less'
})
export class DotaMetaComponent implements OnInit {
	// Meta properties
	private originalMetaHeroes: any[] = [];
	public metaHeroes: any[] = [];
	public loading: boolean = false;
	public selectedPosition: string | null = null;
	public positions = DotaPlayerPositions.positions;
	public featuredLeagues: DotaLeague[] = [];
	public selectedLeague: DotaLeague | null = null;
	public heroStatsRequest: HeroStatsRequest = {
		limit: 150,
		page: 1,
		period: 90
	};

	public heroes: DotaHero[] = [];
	public selectedHeroes: number[] = [];
	public minMatchesFilter: number = 5;
	public totalLeagueMatches: number = 0;
	public useFacet: boolean = false;

	// Meta table sorting configuration
	public metaTableColumns = [
		{
			title: 'Herói',
			compare: null,
			priority: false,
		},
		{
			title: 'Ranqueadas',
			compare: (a: any, b: any) => a.winRate - b.winRate,
			priority: 2,
			tooltip: 'Partidas ranqueadas de 7.5K a 8.5K de MMR',
			width: '150px'
		},
		{
			title: 'Profissionais',
			compare: (a: any, b: any) => a.tournamentWinRate - b.tournamentWinRate,
			priority: 1,
			width: '150px'
		},
		{
			title: 'Contestado',
			compare: (a: any, b: any) => a.tournamentContest - b.tournamentContest,
			priority: 3,
			tooltip: 'Presença do herói nos picks ou bans',
			// width: '200px'
		},
		{
			title: 'Itens',
			compare: null,
			priority: false,
			tooltip: 'Itens mais usados',
			// width: '260px'
		},
		{
			title: 'GPM',
			compare: (a: any, b: any) => a.avgGpm - b.avgGpm,
			priority: false,
			tooltip: 'Ouro por minuto',
			width: '100px'
		},
		{
			title: 'XPM',
			compare: (a: any, b: any) => a.avgXpm - b.avgXpm,
			priority: false,
			tooltip: 'Experiência por minuto',
			width: '100px'
		}
	];

	constructor(
		private dotaMetaService: DotaMetaService,
		private dotaHelperService: DotaHelperService,
		private dotaLeagueService: DotaLeagueService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		// Subscribe to query params for compatibility
		this.route.queryParams.subscribe(params => {
			if (params['leagueId']) {
				this.heroStatsRequest.leagueId = parseInt(params['leagueId']);
				this.fetchLeagueInfo(this.heroStatsRequest.leagueId);
			}
			
			if (params['position']) {
				this.selectedPosition = params['position'];
				this.heroStatsRequest.position = params['position'];
			}
		});

		this.loadFeaturedLeagues();
	}

	loadFeaturedLeagues() {
		this.dotaLeagueService.getFeaturedLeagues().subscribe({
			next: (data: DotaLeague[]) => {
				this.featuredLeagues = data;
				this.heroStatsRequest.leagueId = this.featuredLeagues[0].leagueId;
				this.selectedLeague = this.featuredLeagues[0];
				this.loadMetaHeroes();
			}, error: (error: any) => {
				console.error(error);
				this.loadMetaHeroes(); // Load without league
			}
		});
	}

	loadHeroes() {
		this.dotaHelperService.getAllHeroes().subscribe(heroes => {
			this.heroes = heroes;
		});
	}

	loadMetaHeroes() {
		this.loading = true;
		
		// Add useFacet to the request
		const requestWithFacet = {
			...this.heroStatsRequest,
			useFacet: this.useFacet
		};
		
		this.dotaMetaService.getCompleteMeta(requestWithFacet).subscribe({
			next: (data: any) => {
				console.log(data);

				this.totalLeagueMatches = data.totalLeagueMatches || 0;

				this.metaHeroes = data.data.map((hero: any) => {
					const dotaHero = this.dotaHelperService.getHeroDataSummary(hero.heroId);
					
					// Add facet information if available and enabled
					let selectedFacet = null;
					if (this.useFacet && hero.facetId && dotaHero) {
						let heroAbilities = this.dotaHelperService.getHeroAbilityData(dotaHero.name);
						if (heroAbilities) {
							selectedFacet = heroAbilities.facets[hero.facetId - 1];
						}
					}

					return {
						heroId: hero.heroId,
						facetId: hero.facetId,
						winRate: hero.winRate,
						avgKills: hero.avgKills,
						avgDeaths: hero.avgDeaths,
						avgAssists: hero.avgAssists,
						avgTowerDamage: hero.avgTowerDamage,
						avgHeroDamage: hero.avgHeroDamage,
						avgGoldPerMinute: (hero.avgGoldPerMinute || 0), // Add GPM if available in response
						avgExperiencePerMinute: (hero.avgExperiencePerMinute || 0), // Add XPM if available in response
						totalMatches: hero.totalMatches,
						tournamentWinRate: hero.tournamentWinRate,
						tournamentMatches: hero.tournamentMatches,
						tournamentContest: hero.tournamentContest,
						tournamentAvgKDA: hero.tournamentAvgKDA,
						tournamentAvgTowerDamage: hero.tournamentAvgTowerDamage,
						tournamentAvgHeroDamage: hero.tournamentAvgHeroDamage,
						tournamentKills: parseFloat(hero.tournamentKills || '0'),
						tournamentDeaths: parseFloat(hero.tournamentDeaths || '0'),
						tournamentAssists: parseFloat(hero.tournamentAssists || '0'),
						mostPresentItems: hero.mostPresentItems,
						tournamentAvgGoldPerMinute: hero.tournamentAvgGoldPerMinute,
						tournamentAvgExperiencePerMinute: hero.tournamentAvgExperiencePerMinute,
						tournamentMostPresentItems: hero.tournamentMostPresentItems,
						processedRankedItems: this.processItems(hero.mostPresentItems),
						processedTournamentItems: this.processItems(hero.tournamentMostPresentItems),
						dotaHero: dotaHero,
						selectedFacet: selectedFacet,
						contestRateClass: this.getWinRateClass(hero.tournamentContest / (this.totalLeagueMatches || 1) * 100),
						contestRateColor: this.getWinRateColor(hero.tournamentContest / (this.totalLeagueMatches || 1) * 100)
					}
				});
				this.originalMetaHeroes = [...this.metaHeroes];

				this.onMinMatchesChange(this.minMatchesFilter);
			}, error: (error: any) => {
				console.error(error);
			}
		}).add(() => this.loading = false);
	}

	onLeagueChange(leagueId: number | null) {
		this.heroStatsRequest.leagueId = leagueId || undefined;
		this.selectedLeague = leagueId ? this.featuredLeagues.find(l => l.leagueId === leagueId) || null : null;
		this.updateUrlParams();
		this.loadMetaHeroes();
	}

	onPositionTabChange(index: number) {
		this.selectedPosition = this.positions[index].value;
		this.heroStatsRequest.position = this.selectedPosition || undefined;
		this.updateUrlParams();
		this.loadMetaHeroes();
	}

	// Method to change position from tab index (for compatibility)
	public changePositionTab(index: number) {
		this.onPositionTabChange(index);
	}

	clearLeagueFilter() {
		this.heroStatsRequest.leagueId = undefined;
		this.selectedLeague = null;
		this.updateUrlParams();
		this.loadMetaHeroes();
	}

	private fetchLeagueInfo(leagueId: number) {
		this.dotaLeagueService.getLeagueInfo(leagueId).subscribe({
			next: (league: DotaLeague | null) => {
				this.selectedLeague = league;
			},
			error: (error: any) => {
				console.error('Error fetching league info:', error);
				this.selectedLeague = {
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

	getPositionImage(position: string) {
		return DotaPlayerPositions.getPositionImage(position);
	}

	getPositionLabel(position: string) {
		return DotaPlayerPositions.getPositionLabel(position);
	}

	onHeroFilterChange(event: any) {
		this.applyAllFilters();
	}

	onMinMatchesChange(event: any) {
		this.minMatchesFilter = event;
		this.applyAllFilters();
	}

	onFacetToggleChange(event: boolean) {
		this.useFacet = event;
		this.loadMetaHeroes();
	}

	applyAllFilters() {
		let filteredHeroes = [...this.originalMetaHeroes];

		// Apply hero filter first
		if (this.selectedHeroes.length > 0) {
			filteredHeroes = filteredHeroes.filter((hero: any) => {
				return this.selectedHeroes.includes(hero.heroId);
			});
		}

		// Apply min matches filter second
		if (this.minMatchesFilter > 0) {
			filteredHeroes = filteredHeroes.filter((hero: any) => {
				if (this.selectedLeague) {
					return hero.tournamentMatches >= this.minMatchesFilter;
				} else {
					return hero.totalMatches >= this.minMatchesFilter;
				}
			});
		}

		this.metaHeroes = filteredHeroes;
		console.log('Applied filters - Heroes:', this.selectedHeroes.length, 'MinMatches:', this.minMatchesFilter, 'Results:', this.metaHeroes.length);
	}

	getWinRateColor(winRate: number) {
		if (winRate >= 15) return '#52c41a';
		if (winRate >= 10) return '#faad14';
		return '#ff4d4f';
	}

	getWinRateClass(winRate: number) {
		if (winRate >= 15) return 'high-contest';
		if (winRate >= 10) return 'medium-contest';
		return 'low-contest';
	}

	private updateUrlParams() {
		const queryParams: any = {};
		
		if (this.heroStatsRequest.leagueId) {
			queryParams.leagueId = this.heroStatsRequest.leagueId;
		}
		
		if (this.heroStatsRequest.position) {
			queryParams.position = this.heroStatsRequest.position;
		}
		
		// Update the URL without reloading the page
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			replaceUrl: true
		});
	}

	goToHero(hero: string) {
		this.router.navigate(['/heroes', hero]);
	}

	getItemImage(itemId: number): any {
		if(itemId == 0) {
			return undefined;
		}
		return this.dotaHelperService.getItemDataById(itemId);
	}

	processItems(itemsObject: any): any[] {
		if (!itemsObject) return [];
		
		const items = [];
		for (let i = 0; i <= 5; i++) {
			const itemId = itemsObject[`item${i}`];
			if (itemId && itemId !== 0) {
				const item = this.getItemImage(itemId);
				if (item) {
					items.push(item);
				}
			}
		}
		return items;
	}
}
