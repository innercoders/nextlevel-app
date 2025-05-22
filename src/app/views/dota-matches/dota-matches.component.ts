import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DotaHelperService, DotaMatchService } from '@app/service';
import { DotaMatch, DotaHero } from '@app/model';
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
		NzGridModule
	]
})
export class DotaMatchesComponent implements OnInit {
	matches: DotaMatch[] = [];
	heroes: DotaHero[] = [];
	loading = false;
	totalResults = 0;
	
	// Filter params
	matchRequest = {
		page: 1,
		limit: 10,
		status: '',
		includeHeroes: '',
		excludeHeroes: ''
	};

	includedHeroes: number[] = [];
	excludedHeroes: number[] = [];
	
	constructor(
		private dotaMatchService: DotaMatchService,
		private dotaHelperService: DotaHelperService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadHeroes();
		this.loadMatches();
	}

	loadHeroes(): void {
		this.dotaHelperService.getAllHeroes().subscribe(heroes => {
			this.heroes = heroes;
		});
	}

	loadMatches(): void {
		this.loading = true;
		
		// Convert hero arrays to comma-separated strings
		this.matchRequest.includeHeroes = this.includedHeroes.join(',');
		this.matchRequest.excludeHeroes = this.excludedHeroes.join(',');
		
		this.dotaMatchService.findMatches(
			this.matchRequest.page,
			this.matchRequest.limit,
			this.matchRequest.status,
			this.matchRequest.includeHeroes,
			this.matchRequest.excludeHeroes
		).subscribe({
			next: response => {
				this.matches = response.data;
				this.totalResults = response.total;
				this.loading = false;

				this.matches.forEach(match => {
					match.durationSecondsFormatted = this.formatDuration(match.durationSeconds);
				});
			},
			error: error => {
				console.error('Error loading matches:', error);
				this.loading = false;
			}
		});
	}

	changePage(params: any): void {
		this.matchRequest.page = params.pageIndex;
		this.loadMatches();
	}

	applyFilters(): void {
		this.matchRequest.page = 1;
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
		this.applyFilters();
	}

	onIncludeHeroChange(): void {
		this.matchRequest.includeHeroes = this.includedHeroes.join(',');
	}

	onExcludeHeroChange(): void {
		this.matchRequest.excludeHeroes = this.excludedHeroes.join(',');
	}

	formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}
} 