import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DotaHelperService, DotaMatchService, DotaLeagueService } from '@app/service';
import { DotaMatch, DotaHero, DotaLeague } from '@app/model';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
	selector: 'app-dota-matches',
	templateUrl: './dota-matches.component.html',
	styleUrls: ['./dota-matches.component.less'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		NzTableModule,
		NzSelectModule,
		NzButtonModule,
		NzInputModule,
		NzProgressModule,
		NzIconModule,
		NzTagModule,
		NzSliderModule,
		NzToolTipModule,
		NzGridModule,
		RouterModule
	]
})
export class DotaMatchesComponent implements OnInit {
	matches: DotaMatch[] = [];
	heroes: DotaHero[] = [];
	loading = false;
	totalResults = 0;
	currentLeague: DotaLeague | null = null;
	featuredLeagues: DotaLeague[] = [];
	
	// Filter params
	matchRequest = {
		page: 1,
		status: '',
		includeHeroes: '',
		excludeHeroes: '',
		leagueId: undefined as number | undefined
	};

	includedHeroes: number[] = [];
	excludedHeroes: number[] = [];
	
	constructor(
		private dotaMatchService: DotaMatchService,
		private dotaHelperService: DotaHelperService,
		private dotaLeagueService: DotaLeagueService,
		private router: Router,
		private route: ActivatedRoute,
		private message: NzMessageService
	) {}

	ngOnInit(): void {
		this.loadHeroes();
		this.loadFeaturedLeagues();
		
		// Subscribe to query params
		this.route.queryParams.subscribe(params => {
			// Update the matchRequest with query params
			this.matchRequest.page = params['page'] ? parseInt(params['page']) : 1;
			
			if (params['leagueId']) {
				this.matchRequest.leagueId = parseInt(params['leagueId']);
				this.fetchLeagueInfo(this.matchRequest.leagueId);
			} else {
				this.currentLeague = null;
				this.matchRequest.leagueId = undefined;
			}
			
			if (params['status']) {
				this.matchRequest.status = params['status'];
			}
			
			if (params['includeHeroes']) {
				this.includedHeroes = params['includeHeroes'].split(',').map((id: string) => parseInt(id));
			} else {
				this.includedHeroes = [];
			}
			
			if (params['excludeHeroes']) {
				this.excludedHeroes = params['excludeHeroes'].split(',').map((id: string) => parseInt(id));
			} else {
				this.excludedHeroes = [];
			}
			
			// Load matches with the updated request
			this.loadMatches();
		});
	}

	loadHeroes(): void {
		this.dotaHelperService.getAllHeroes().subscribe(heroes => {
			this.heroes = heroes;
		});
	}

	loadFeaturedLeagues(): void {
		this.dotaLeagueService.getFeaturedLeagues().subscribe({
			next: (data: DotaLeague[]) => {
				this.featuredLeagues = data;
			}, 
			error: (error: any) => {
				console.error('Error loading featured leagues:', error);
			}
		});
	}

	loadMatches(): void {
		this.loading = true;
		
		// Convert hero arrays to comma-separated strings
		this.matchRequest.includeHeroes = this.includedHeroes.join(',');
		this.matchRequest.excludeHeroes = this.excludedHeroes.join(',');
		
		this.dotaMatchService.findMatches(
			this.matchRequest.page,
			10, // Fixed limit of 10
			this.matchRequest.status,
			this.matchRequest.includeHeroes,
			this.matchRequest.excludeHeroes,
			this.matchRequest.leagueId
		).subscribe({
			next: response => {
				this.matches = response.data;
				this.totalResults = response.total;
				this.loading = false;

				this.matches.forEach(match => {
					match.durationSecondsFormatted = this.formatDuration(match.durationSeconds);
					match.players.forEach(player => {
						player.dotaHero = this.dotaHelperService.getHeroData(player.heroId);
					});
				});
			},
			error: error => {
				console.error('Error loading matches:', error);
				this.loading = false;
			}
		});
	}

	onLeagueChange(leagueId: number | null): void {
		this.matchRequest.leagueId = leagueId || undefined;
		this.matchRequest.page = 1; // Reset to first page when filter changes
		if (leagueId) {
			this.fetchLeagueInfo(leagueId);
		} else {
			this.currentLeague = null;
		}
		this.updateUrlParams();
		this.loadMatches();
	}

	onIncludeHeroChange(heroIds: number[]): void {
		this.includedHeroes = heroIds || [];
		this.matchRequest.page = 1; // Reset to first page when filter changes
		this.matchRequest.includeHeroes = this.includedHeroes.join(',');
		this.updateUrlParams();
		this.loadMatches();
	}

	onExcludeHeroChange(heroIds: number[]): void {
		this.excludedHeroes = heroIds || [];
		this.matchRequest.page = 1; // Reset to first page when filter changes
		this.matchRequest.excludeHeroes = this.excludedHeroes.join(',');
		this.updateUrlParams();
		this.loadMatches();
	}

	copyMatchId(event: Event, matchId: string): void {
		event.stopPropagation(); // Prevent row click event
		navigator.clipboard.writeText(matchId).then(() => {
			this.message.success('ID da partida copiado!');
		}).catch(() => {
			this.message.error('Erro ao copiar ID da partida');
		});
	}

	changePage(params: any): void {
		this.matchRequest.page = params.pageIndex;
		this.updateUrlParams();
		this.loadMatches();
	}

	goToMatch(matchId: string): void {
		this.router.navigate(['/matches', matchId]);
	}

	clearFilters(): void {
		this.matchRequest.status = '';
		this.includedHeroes = [];
		this.excludedHeroes = [];
		this.matchRequest.includeHeroes = '';
		this.matchRequest.excludeHeroes = '';
		this.matchRequest.leagueId = undefined;
		this.currentLeague = null;
		this.matchRequest.page = 1;
		this.updateUrlParams();
		this.loadMatches();
	}

	formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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

	private updateUrlParams() {
		// Create query params object from the request
		const queryParams: any = {};
		
		if (this.matchRequest.page !== 1) {
			queryParams.page = this.matchRequest.page;
		}
		
		if (this.matchRequest.leagueId) {
			queryParams.leagueId = this.matchRequest.leagueId;
		}
		
		if (this.matchRequest.status) {
			queryParams.status = this.matchRequest.status;
		}
		
		if (this.includedHeroes.length > 0) {
			queryParams.includeHeroes = this.includedHeroes.join(',');
		}
		
		if (this.excludedHeroes.length > 0) {
			queryParams.excludeHeroes = this.excludedHeroes.join(',');
		}
		
		// Update the URL without reloading the page
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			replaceUrl: true
		});
	}

	clearLeagueFilter(): void {
		this.matchRequest.leagueId = undefined;
		this.currentLeague = null;
		this.matchRequest.page = 1;
		this.updateUrlParams();
		this.loadMatches();
	}
} 