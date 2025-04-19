import { Component, OnInit } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { DotaHelperService, OmniscienceService, DotaRankService, DotaMatchService } from '@app/service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { brRanking, DotaMatch } from '@app/model';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterModule } from '@angular/router';
import { TimeFormatPipe } from '../../shared/pipes/time-format.pipe';
import { BehaviorSubject } from 'rxjs';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';

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
		TimeFormatPipe,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit {

	public liveMatches: DotaMatch[] = [];
	public lastMatches: DotaMatch[] = [];
	public loadingDotaMeta: boolean = false;
	public loadingOnGoingMatches: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public dotaRankBrasil: any[] = brRanking;
	public dotaRanksAmericas: any[] = [];
	public dotaRanksEurope: any[] = [];
	public dotaRanksSeAsia: any[] = [];
	public dotaRanksChina: any[] = [];
	public selectedRankingData: any[] = [];
	public selectedRegionTab: string = 'Brasil';

	public bestHeroes: any[] = [];
	public bestHeroesPosition: null | 'POSITION_1' | 'POSITION_2' | 'POSITION_3' | 'POSITION_4' | 'POSITION_5' = null;

	constructor(private dotaHelperService: DotaHelperService,
				private omniscienceService: OmniscienceService,
				private dotaRankService: DotaRankService,
				private dotaMatchService: DotaMatchService,
				private message: NzMessageService) {}

	public ngOnInit() {
		this.getOnGoingMatches();
		this.getDotaRanks();
		// Default to showing Brazil ranking
		this.selectedRankingData = this.dotaRanksEurope;
		// this.getLastMatches();
	}

	getOnGoingMatches() {
		this.loadingOnGoingMatches.next(true);
		this.omniscienceService.getOnGoingMatches().subscribe({
			next: data => {
				this.liveMatches = data;

				this.liveMatches.forEach(match => {
					match.players.forEach(player => {
						player.dotaHero = this.dotaHelperService.getHeroData(player.heroId);
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
						player.dotaHero = this.dotaHelperService.getHeroData(player.heroId);
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
			case 0: // Brasil
				// Using separate table for Brasil
				break;
			case 1: // Europa
				this.selectedRankingData = this.dotaRanksEurope;
				break;
			case 2: // Americas
				this.selectedRankingData = this.dotaRanksAmericas;
				break;
			case 3: // China
				this.selectedRankingData = this.dotaRanksChina;
				break;
			case 4: // Sudeste Asiático
				this.selectedRankingData = this.dotaRanksSeAsia;
				break;
			default:
				this.selectedRankingData = this.dotaRanksEurope;
		}
	}

}
