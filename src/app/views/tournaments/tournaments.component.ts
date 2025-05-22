import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotaLeagueService } from '@app/service';
import { DotaLeague } from '@app/model';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-tournaments',
	standalone: true,
	imports: [
		CommonModule,
		NzGridModule,
		NzCardModule,
		NzTagModule,
		NzIconModule,
		NzToolTipModule,
		NzButtonModule,
		RouterModule
	],
	templateUrl: './tournaments.component.html',
	styleUrl: './tournaments.component.less'
})
export class TournamentsComponent implements OnInit {
	leagues: DotaLeague[] = [];
	nextLevelLeague: DotaLeague | null = null;
	otherLeagues: DotaLeague[] = [];
	loading: boolean = true;

	constructor(private dotaLeagueService: DotaLeagueService) {}

	ngOnInit(): void {
		this.dotaLeagueService.getFeaturedLeagues().subscribe({
			next: (leagues) => {
				this.leagues = leagues;
				
				// Find NextLevel league or create it if it doesn't exist
				this.nextLevelLeague = leagues.find(league => league.leagueId === 18138) || null;
				if (this.nextLevelLeague) {
					this.nextLevelLeague.imageUrl = '/assets/images/background/nextlevel/nextlevel-icon.png';
				}
				
				// Filter other leagues (excluding NextLevel)
				this.otherLeagues = leagues.filter(league => league.leagueId !== 18138);
				
				this.loading = false;
			},
			error: (error) => {
				console.error('Erro ao carregar campeonatos:', error);
				this.loading = false;
			}
		});
	}

	getTierColor(tier: string | null): string {
		if (!tier) return '';
		
		switch(tier.toLowerCase()) {
			case 'premium': return 'gold';
			case 'professional': return 'blue';
			case 'major': return 'magenta';
			case 'minor': return 'purple';
			default: return 'green';
		}
	}

	getRegionName(region: string | null): string {
		if (!region) return 'Global';
		
		switch(region.toLowerCase()) {
			case 'na': return 'América do Norte';
			case 'sa': return 'América do Sul';
			case 'eu': return 'Europa';
			case 'cis': return 'CEI';
			case 'cn': return 'China';
			case 'sea': return 'Sudeste Asiático';
			case 'global': return 'Global';
			default: return region;
		}
	}
}
