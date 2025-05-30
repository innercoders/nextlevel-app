import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSliderModule } from 'ng-zorro-antd/slider';

import { brRanking, User, HeroStatsRequest, DotaLeague, DotaHero } from '@app/model';
import { DotaHelperService, DotaRankService, UserService, DotaMetaService, DotaLeagueService } from '@app/service';
import { DotaHeroImageComponent, DotaPlayerPositions } from '@app/shared';


@Component({
	selector: 'app-home',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NzGridModule,
		NzCarouselModule,
		NzButtonModule,
		NzIconModule,
		NzTableModule,
		NzDividerModule,
		NzToolTipModule,
		NzTabsModule,
		NzTableModule,
		RouterModule,
		NzSelectModule,
		NzTagModule,
		NzInputModule,
		NzSliderModule,
		DotaHeroImageComponent,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit {

	public loadingDotaMeta: boolean = false;

	public dotaRankBrasil: any[] = brRanking.sort((a, b) => b.MMR_Value - a.MMR_Value);
	public dotaRanksAmericas: any[] = [];
	public dotaRanksEurope: any[] = [];
	public dotaRanksSeAsia: any[] = [];
	public dotaRanksChina: any[] = [];
	public selectedRankingData: any[] = [];
	public selectedRegionTab: string = 'Brasil';

	public currentUser: User | null = null;

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
	public minMatchesFilter: number = 0;

	constructor(private dotaRankService: DotaRankService,
				private userService: UserService,
				private router: Router,
				private dotaMetaService: DotaMetaService,
				private dotaLeagueService: DotaLeagueService,
				private dotaHelperService: DotaHelperService) {}

	public ngOnInit() {

		this.userService.currentUser.subscribe(user => {
			this.currentUser = user;
		});

		if(!this.currentUser) {
			this.router.navigate(["/about-us"]);
			return;
		}

		this.getDotaRanks();
		this.selectedRankingData = this.dotaRankBrasil;
		this.loadFeaturedLeagues();
		this.loadMetaHeroes();
		this.loadHeroes();
	}

	getDotaRanks() {
		this.dotaRankService.getDotaRanksAmericas().subscribe({
			next: data => {
				this.dotaRanksAmericas = data;
			}, error: error => {
				console.error(error);
			}
		});

		this.dotaRankService.getDotaRanksEurope().subscribe({
			next: data => {
				this.dotaRanksEurope = data;
			}, error: error => {
				console.error(error);
			}
		});

		this.dotaRankService.getDotaRanksSeAsia().subscribe({
			next: data => {
				this.dotaRanksSeAsia = data;
			}, error: error => {
				console.error(error);
			}
		});

		this.dotaRankService.getDotaRanksChina().subscribe({
			next: data => {
				this.dotaRanksChina = data;
			}, error: error => {
				console.error(error);
			}
		});
	}

	onRegionTabChange(event: NzTabChangeEvent): void {
		const tabNames = ['Brasil', 'Europa', 'Americas', 'China', 'Sudeste Asiático'];
		if (event.index !== null && event.index !== undefined) {
			this.selectedRegionTab = tabNames[event.index];
		} else {
			this.selectedRegionTab = 'Brasil';
		}
		
		switch (event.index) {
			case 0:
				
				break;
			case 1:
				this.selectedRankingData = this.dotaRanksEurope;
				break;
			case 2:
				this.selectedRankingData = this.dotaRanksAmericas;
				break;
			case 3:
				this.selectedRankingData = this.dotaRanksChina;
				break;
			case 4:
				this.selectedRankingData = this.dotaRanksSeAsia;
				break;
			default:
				this.selectedRankingData = this.dotaRanksEurope;
		}
	}

	getHeroImage(player: any): string {
		return player?.dotaHero?.imageUrl || '';
	}

	getHeroName(player: any): string {
		return player?.dotaHero?.localizedName || 'Unknown Hero';
	}

	loadFeaturedLeagues() {
		this.dotaLeagueService.getFeaturedLeagues().subscribe({
			next: (data: DotaLeague[]) => {
				this.featuredLeagues = data;
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
						dotaHero: this.dotaHelperService.getHeroDataSummary(hero.heroId)
					}
				});
				this.originalMetaHeroes = [...this.metaHeroes];

				this.onMinMatchesChange(this.minMatchesFilter);
			}, error: (error: any) => {
				console.error(error);
			}
		}).add(() => this.loadingMeta = false);
	}

	processHeroStatsRecords(data: any): any[] {
		// Process the HeroStatsRecordsResponse format
		if (!data.records) return [];
		
		const heroMap = new Map();
		
		// Combine all stats for each hero
		Object.keys(data.records).forEach(statType => {
			const record = data.records[statType];
			if (record.heroId) {
				if (!heroMap.has(record.heroId)) {
					heroMap.set(record.heroId, {
						heroId: record.heroId,
						position: record.position,
						totalMatches: record.matches
					});
				}
				
				const hero = heroMap.get(record.heroId);
				switch (statType) {
					case 'winRate':
						hero.winRate = record.value;
						break;
					case 'kills':
						hero.avgKills = record.value;
						break;
					case 'deaths':
						hero.avgDeaths = record.value;
						break;
					case 'assists':
						hero.avgAssists = record.value;
						break;
					case 'gpm':
						hero.avgGpm = record.value;
						break;
					case 'xpm':
						hero.avgXpm = record.value;
						break;
					case 'heroDamage':
						hero.avgHeroDamage = record.value;
						break;
					case 'towerDamage':
						hero.avgTowerDamage = record.value;
						break;
				}
			}
		});
		
		return Array.from(heroMap.values()).map(hero => {
			hero.dotaHero = this.dotaHelperService.getHeroDataSummary(hero.heroId);
			return hero;
		});
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
}
