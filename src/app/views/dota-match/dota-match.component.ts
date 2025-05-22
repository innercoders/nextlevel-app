import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { DotaHelperService, DotaMatchService } from '@app/service';
import { DotaMatch, DotaMatchPlayer, DotaItem } from '@app/model';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DotaHeroImageComponent } from '@app/shared';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { lineChartData, lineChartOptions } from './chart-networth-configuration';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
	selector: 'app-dota-match',
	imports: [
		CommonModule,
		RouterModule,
		NzGridModule,
		NzToolTipModule,
		DotaHeroImageComponent,
		BaseChartDirective,
		NzTableModule,
	],
	templateUrl: './dota-match.component.html',
	styleUrl: './dota-match.component.less'
})
export class DotaMatchComponent implements OnInit {
	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	matchId: string = '';
	dotaMatch: DotaMatch | null = null;

	radiantTeam: DotaMatchPlayer[] | null = null;
	direTeam: DotaMatchPlayer[] | null = null;

	lineChartData: ChartConfiguration['data'] = lineChartData;
	lineChartOptions: ChartConfiguration['options'] = lineChartOptions;

	lineChartType: ChartType = 'line';

	laneResults: { lane: 'Top' | 'Mid' | 'Bottom', players: DotaMatchPlayer[], result: string }[] = [];

	constructor(
		private dotaHelperService: DotaHelperService,
		private dotaMatchService: DotaMatchService,
		private route: ActivatedRoute) {
		this.route.params.subscribe(params => {
			this.matchId = params['matchId'];
		});
	}

	ngOnInit(): void {
		this.dotaMatchService.getMatchById(this.matchId).subscribe(match => {
			this.dotaMatch = match;

			this.dotaMatch.players.forEach(player => {
				player.dotaHero = this.dotaHelperService.getHeroData(player.heroId);
				let heroAbilities = this.dotaHelperService.getHeroAbilityData(player.dotaHero.name);

				player.dotaHero.positionImage = this.getPositionImage(player.position);
				player.dotaHero.positionLabel = this.getPositionName(player.position);

				if(heroAbilities && player.facetId) {
					player.selectedFacet = heroAbilities.facets[player.facetId - 1];
				}

				player.dotaHeroAbilities = [];

				player.abilities.forEach(ability => {
					player.dotaHeroAbilities?.push(this.dotaHelperService.getAbilityData(ability));
				});

				this.setupPlayerItems(player);
			});

			this.setupPicksBans(match);

			this.setupLaneResults(match);

			this.radiantTeam = match.players.filter(player => player.isRadiant);
			this.direTeam = match.players.filter(player => !player.isRadiant);
			
			this.setupChartData(match.radiantNetWorthLeads, match.radiantExperienceLeads);
		});
	}

	getPositionImage(position: string): string {
		return this.dotaHelperService.getPositionImage(position);
	}

	getPositionName(position: string): string {
		return this.dotaHelperService.getPositionName(position);
	}

	getItemImage(itemId: number): DotaItem | undefined {
		if(itemId == 0) {
			return undefined;
		}

		return this.dotaHelperService.getItemDataById(itemId);
	}

	laneResultClass(result: string): string {
		if(result.indexOf('RADIANT') > -1) {
			return 'radiant';
		} else if(result.indexOf('DIRE') > -1) {
			return 'dire';
		}

		return '';
	}

	laneResultText(result: string): string {
		if(result.indexOf('RADIANT') > -1) {
			return '<span class="text-success">Vitória Radiant</span>';
		} else if(result.indexOf('DIRE') > -1) {
			return '<span class="text-danger">Vitória Dire</span>';
		}

		return 'Empate';
	}

	formatDuration(seconds: number): string {
		if(seconds < 0) {
			return '00:00'
		}

		return this.dotaHelperService.formatDuration(seconds);
	}

	private setupPlayerItems(player: DotaMatchPlayer): void {
		let item0 = this.getItemImage(player.item0Id);
		let item1 = this.getItemImage(player.item1Id);
		let item2 = this.getItemImage(player.item2Id);
		let item3 = this.getItemImage(player.item3Id);
		let item4 = this.getItemImage(player.item4Id);
		let item5 = this.getItemImage(player.item5Id);
		
		player.items = [];

		if(item0) { player.items.push(item0); }
		if(item1) { player.items.push(item1); }
		if(item2) { player.items.push(item2); }
		if(item3) { player.items.push(item3); }
		if(item4) { player.items.push(item4); }
		if(item5) { player.items.push(item5); }

		player.purchasedItems = [];

		player.playerItemPurchases.forEach(purchase => {
			if(this.dotaHelperService.consumableItems.includes(purchase.itemId)) {
				return;
			}

			let item = this.getItemImage(purchase.itemId);
			if(item) { player.purchasedItems?.push({ time: purchase.time, formatedTime: this.formatDuration(purchase.time), item: item }); }
		});

		player.purchasedItems?.sort((a, b) => a.time - b.time);
	}

	private setupChartData(netWorthLeads: number[], experienceLeads: number[]): void {
		const labels = Array.from({ length: netWorthLeads.length }, (_, i) => i.toString());
		
		this.lineChartData.labels = labels;
		this.lineChartData.datasets[0].data = [...netWorthLeads];
		this.lineChartData.datasets[1].data = [...experienceLeads];
		
		if (this.chart) {
			this.chart.update();
		}
	}

	private setupPicksBans(match: DotaMatch): void {
		match.picksBans.forEach(pickBan => {
			pickBan.dotaHero = this.dotaHelperService.getHeroData(pickBan.heroId);
		});
	}

	private setupLaneResults(match: DotaMatch): void {

		let topPlayers: DotaMatchPlayer[] = [];
		let midPlayers: DotaMatchPlayer[] = [];
		let bottomPlayers: DotaMatchPlayer[] = [];

		match.players.forEach(player => {
			if(player.isRadiant) {
				if(player.position == 'POSITION_1' || player.position == 'POSITION_5') {
					bottomPlayers.push(player);
				} else if(player.position == 'POSITION_2') {
					midPlayers.push(player);
				} else if(player.position == 'POSITION_3' || player.position == 'POSITION_4') {
					topPlayers.push(player);
				}
			} else {
				if(player.position == 'POSITION_1' || player.position == 'POSITION_5') {
					topPlayers.push(player);
				} else if(player.position == 'POSITION_2') {
					midPlayers.push(player);
				} else if(player.position == 'POSITION_3' || player.position == 'POSITION_4') {
					bottomPlayers.push(player);
				}
			}
		});

		this.laneResults.push(
			{
				lane: 'Top',
				players: topPlayers,
				result: this.dotaMatch?.topLaneOutcome ?? ''
			},
			{
				lane: 'Mid',
				players: midPlayers,
				result: this.dotaMatch?.midLaneOutcome ?? ''
			},
			{
				lane: 'Bottom',
				players: bottomPlayers,
				result: this.dotaMatch?.bottomLaneOutcome ?? ''
			}
		);
	}
}
