import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';

import { brRanking } from '@app/model';
import { DotaRankService } from '@app/service';

@Component({
	selector: 'app-ranking-table',
	imports: [
		CommonModule,
		NzGridModule,
		NzTableModule,
		NzTabsModule,
	],
	templateUrl: './ranking-table.component.html',
	styleUrl: './ranking-table.component.less'
})
export class RankingTableComponent implements OnInit {

	public dotaRankBrasil: any[] = brRanking.sort((a, b) => b.MMR_Value - a.MMR_Value);
	public dotaRanksAmericas: any[] = [];
	public dotaRanksEurope: any[] = [];
	public dotaRanksSeAsia: any[] = [];
	public dotaRanksChina: any[] = [];
	public selectedRankingData: any[] = [];
	public selectedRegionTab: string = 'Brasil';

	constructor(private dotaRankService: DotaRankService) {}

	public ngOnInit() {
		this.getDotaRanks();
		this.selectedRankingData = this.dotaRankBrasil;
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
				this.selectedRankingData = this.dotaRankBrasil;
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
				this.selectedRankingData = this.dotaRankBrasil;
		}
	}
} 