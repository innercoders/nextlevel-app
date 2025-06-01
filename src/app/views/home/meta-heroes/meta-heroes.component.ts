import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { HeroStatsRequest, DotaLeague, DotaHero } from '@app/model';
import { DotaHelperService, DotaMetaService, DotaLeagueService } from '@app/service';
import { DotaHeroImageComponent, DotaPlayerPositions } from '@app/shared';

@Component({
	selector: 'app-meta-heroes',
	imports: [
		CommonModule,
		FormsModule,
		NzGridModule,
		NzTableModule,
		NzToolTipModule,
		NzTabsModule,
		NzSelectModule,
		NzSliderModule,
		NzProgressModule,
		NzIconModule,
		DotaHeroImageComponent,
	],
	templateUrl: './meta-heroes.component.html',
	styleUrls: ['./meta-heroes.component.less']
})
export class MetaHeroesComponent implements OnInit {

	// Meta properties
	private originalMetaHeroes: any[] = [];
	public metaHeroes: any[] = [];
	public loadingMeta: boolean = false;
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

	// Meta table sorting configuration
	public metaTableColumns = [
		{
			title: 'Herói',
			compare: null,
			priority: false,
			width: '110px'
		},
		{
			title: 'Ranqueadas',
			compare: (a: any, b: any) => a.winRate - b.winRate,
			priority: 2,
			tooltip: 'Partidas raqueadas de 7.5K a 8.5K de MMR'
		},
		{
			title: 'Profissionais',
			compare: (a: any, b: any) => a.tournamentWinRate - b.tournamentWinRate,
			priority: 1
		},
		{
			title: 'Contestado',
			compare: (a: any, b: any) => a.tournamentContest - b.tournamentContest,
			priority: 3,
			tooltip: 'Presença do herói nos picks ou bans'
		}
	];

	constructor(
		private dotaMetaService: DotaMetaService,
		private dotaLeagueService: DotaLeagueService,
		private dotaHelperService: DotaHelperService
	) {}

	public ngOnInit() {
		this.loadFeaturedLeagues();
		this.loadHeroes();
	}

	loadFeaturedLeagues() {
		this.dotaLeagueService.getFeaturedLeagues().subscribe({
			next: (data: DotaLeague[]) => {
				this.featuredLeagues = data;
				this.heroStatsRequest.leagueId = data[0].leagueId;
				this.selectedLeague = data[0];
				this.loadMetaHeroes();
			}, error: (error: any) => {
				console.error(error);
			}
		});
	}

	loadMetaHeroes() {
		this.loadingMeta = true;
		this.dotaMetaService.getHeroStats(this.heroStatsRequest).subscribe({
			next: (data: any) => {
				console.log(data);

				this.totalLeagueMatches = data.totalLeagueMatches;

				this.metaHeroes = data.data.map((hero: any) => {
					return {
						heroId: hero.heroId,
						winRate: hero.winRate,
						avgKills: hero.avgKills,
						avgDeaths: hero.avgDeaths,
						avgAssists: hero.avgAssists,
						totalMatches: hero.totalMatches,
						tournamentWinRate: hero.tournamentWinRate,
						tournamentMatches: hero.tournamentMatches,
						tournamentContest: hero.tournamentContest,
						dotaHero: this.dotaHelperService.getHeroDataSummary(hero.heroId),
						contestRateClass: this.getWinRateClass(hero.tournamentContest / this.totalLeagueMatches * 100),
						contestRateColor: this.getWinRateColor(hero.tournamentContest / this.totalLeagueMatches * 100)
					}
				});
				this.originalMetaHeroes = [...this.metaHeroes];

				this.onMinMatchesChange(this.minMatchesFilter);
			}, error: (error: any) => {
				console.error(error);
			}
		}).add(() => this.loadingMeta = false);
	}

	onLeagueChange(leagueId: number | null) {
		this.heroStatsRequest.leagueId = leagueId || undefined;
		this.selectedLeague = leagueId ? this.featuredLeagues.find(l => l.leagueId === leagueId) || null : null;
		this.loadMetaHeroes();
	}

	onPositionTabChange(index: number) {
		this.selectedPosition = this.positions[index].value;
		this.heroStatsRequest.position = this.selectedPosition || undefined;
		this.loadMetaHeroes();
	}

	clearLeagueFilter() {
		this.heroStatsRequest.leagueId = undefined;
		this.selectedLeague = null;
		this.loadMetaHeroes();
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

	loadHeroes() {
		this.dotaHelperService.getAllHeroes().subscribe(heroes => {
			this.heroes = heroes;
			this.heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
		});
	}

	getWinRateColor(winRate: number) {
		if (winRate > 50) return '#52C41A';
		if (winRate > 40) return '#FAAD14';
		return '#FF4D4F';
	}

	getWinRateClass(winRate: number) {
		if (winRate > 50) return 'high';
		if (winRate > 40) return 'medium';
		return 'low';
	}
} 