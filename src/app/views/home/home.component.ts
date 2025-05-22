import { Component, OnInit } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';

import { brRanking, DotaMatch, User } from '@app/model';
import { DotaHelperService, OmniscienceService, DotaRankService, DotaMatchService, UserService } from '@app/service';

// Extend the DotaMatch interface for UI state
interface DotaMatchWithUI extends DotaMatch {
	expanded?: boolean;
}

@Component({
	selector: 'app-home',
	imports: [
		CommonModule,
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
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit {

	public liveMatches: DotaMatchWithUI[] = [];
	public lastMatches: DotaMatchWithUI[] = [];
	public loadingDotaMeta: boolean = false;
	public loadingOnGoingMatches: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public dotaRankBrasil: any[] = brRanking.sort((a, b) => b.MMR_Value - a.MMR_Value);
	public dotaRanksAmericas: any[] = [];
	public dotaRanksEurope: any[] = [];
	public dotaRanksSeAsia: any[] = [];
	public dotaRanksChina: any[] = [];
	public selectedRankingData: any[] = [];
	public selectedRegionTab: string = 'Brasil';

	public bestHeroes: any[] = [];
	public bestHeroesPosition: null | 'POSITION_1' | 'POSITION_2' | 'POSITION_3' | 'POSITION_4' | 'POSITION_5' = null;

	public currentUser: User | null = null;

	constructor(private dotaHelperService: DotaHelperService,
				private omniscienceService: OmniscienceService,
				private dotaRankService: DotaRankService,
				private dotaMatchService: DotaMatchService,
				private message: NzMessageService,
				private userService: UserService,
				private router: Router) {}

	public ngOnInit() {

		this.userService.currentUser.subscribe(user => {
			this.currentUser = user;
		});

		if(!this.currentUser) {
			this.router.navigate(["/about-us"]);
			return;
		}

		this.getOnGoingMatches();
		this.getDotaRanks();
		// Default to showing Brazil ranking
		this.selectedRankingData = this.dotaRankBrasil;
		this.getLastMatches();
	}

	getOnGoingMatches() {
		this.loadingOnGoingMatches.next(true);
		this.omniscienceService.getOnGoingMatches().subscribe({
			next: data => {
				this.liveMatches = data;

				this.liveMatches.forEach(match => {
					match.players.forEach(player => {
						player.dotaHero = this.dotaHelperService.getHeroDataSummary(player.heroId);
					});
				});
			}, error: error => {
				console.error(error);
			}
		}).add(() => this.loadingOnGoingMatches.next(false));
	}

	getLastMatches() {
		this.dotaMatchService.getLastMatches().subscribe({
			next: data => {
				this.lastMatches = data;
				this.lastMatches.forEach(match => {
					match.players.forEach(player => {
						player.dotaHero = this.dotaHelperService.getHeroDataSummary(player.heroId);
					});
				});
			}, error: error => {
				console.error(error);
			}
		});
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

	copyMatchId(matchId: string) {
		navigator.clipboard.writeText(matchId);
		this.message.success('ID da partida copiado.');
	}

	onRegionTabChange(event: NzTabChangeEvent): void {
		// Set the selected tab name
		const tabNames = ['Brasil', 'Europa', 'Americas', 'China', 'Sudeste Asiático'];
		if (event.index !== null && event.index !== undefined) {
			this.selectedRegionTab = tabNames[event.index];
		} else {
			this.selectedRegionTab = 'Brasil';
		}
		
		// Switch table data based on selected tab index
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

	// Helper methods to safely access hero data
	getHeroImage(player: any): string {
		return player?.dotaHero?.imageUrl || '';
	}

	getHeroName(player: any): string {
		return player?.dotaHero?.localizedName || 'Unknown Hero';
	}
}
