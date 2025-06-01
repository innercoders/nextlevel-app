import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DotaHero, DotaHeroAbilities, HeroMatchupsRequest, HeroOverrallStatsRequest } from '@app/model';
import { DotaMetaService, DotaHelperService } from '@app/service';
import { DotaPlayerPositions } from '@app/shared';
import { BestHeroItemsRequest } from 'app/model/request/best-hero-items.request';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-hero-details',
  imports: [
	CommonModule,
	NzGridModule,
	NzProgressModule,
	NzIconModule,
	NzToolTipModule,
	NzCollapseModule,
	RouterModule,
	NzButtonModule,
	NzSliderModule,
	FormsModule,
	NzSpinModule,
	NzSwitchModule
  ],
  templateUrl: './hero-details.component.html',
  styleUrl: './hero-details.component.less'
})
export class HeroDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
	
	private videoEventListener: any;

	heroId: string = '';
	hero?: DotaHero;
	heroAbilities?: DotaHeroAbilities;
	videoLoaded = false;

	// New data structure for detailed hero info
	detailedHeroInfo?: any;
	bestHeroItems?: any;
	heroOverrallStats?: HeroOverrallStats[];
	heroMatchups?: any[];
	loading = false;

	selectedFacetId?: number;
	bestFacetId?: number; // The facet with most matches
	facetMatchCounts: { [facetId: number]: number } = {};

	// Minimum matches filter
	public minMatchesFilter: number = 1;
	public maxAvailableMatches: number = 100;

	// Filter parameters
	public daysAgo: number = 14;
	public onlyLeagueGames: boolean = false;

	public heroRecordsPositions: string[] = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5'];

	constructor(private route: ActivatedRoute,
		private dotaMetaService: DotaMetaService,
		private dotaHelperService: DotaHelperService
	) {
	}

	ngOnInit() {
		this.route.params.subscribe((params) => {
			this.hero = this.dotaHelperService.getHeroData(params['heroId'], true);
			this.heroAbilities = this.dotaHelperService.getHeroAbilityData(this.hero.name as string);
			this.heroId = this.hero.id.toString();

			console.log(this.hero);

			// First find the best facet (most matches), then load detailed info
			this.findBestFacetAndLoadData();
			
			// Add a document-level click handler to help with autoplay restrictions
			document.addEventListener('click', this.handleUserInteraction.bind(this), { once: true });

			if(this.heroVideo) {
				this.heroVideo.nativeElement.src = this.hero.video_webm as string;
				this.heroVideo.nativeElement.load();
			}
		});
	}

	findBestFacetAndLoadData() {
		if (!this.heroAbilities?.facets) {
			console.error('No facets available for this hero');
			return;
		}

		this.loading = true;
		
		// Get available facets (non-deprecated)
		const availableFacets = this.heroAbilities.facets
			.map((facet, index) => ({ facet, facetId: index + 1 }))
			.filter(({ facet }) => facet.deprecated !== '1' && facet.deprecated !== 'true');

		// Call simple-hero endpoint for each facet to get match counts
		const simpleRequests = availableFacets.map(({ facetId }) => 
			this.dotaMetaService.getSimpleHeroInfo(
				parseInt(this.heroId), 
				facetId, 
				this.daysAgo, 
				this.onlyLeagueGames
			)
		);

		forkJoin(simpleRequests).subscribe({
			next: (responses: any[]) => {
				// Store match counts for each facet
				responses.forEach((response, index) => {
					const facetId = availableFacets[index].facetId;
					this.facetMatchCounts[facetId] = response.totalMatches || 0;
				});

				// Find facet with most matches
				this.bestFacetId = Object.keys(this.facetMatchCounts)
					.map(id => parseInt(id))
					.reduce((bestId, currentId) => 
						this.facetMatchCounts[currentId] > this.facetMatchCounts[bestId] ? currentId : bestId
					);

				this.selectedFacetId = this.bestFacetId;
				this.maxAvailableMatches = Math.max(...Object.values(this.facetMatchCounts));

				// Load detailed info for the best facet
				this.loadDetailedHeroInfo();
			},
			error: (error) => {
				console.error('Error loading facet data:', error);
				// Fallback to first available facet
				this.selectedFacetId = availableFacets[0]?.facetId || 1;
				this.loadDetailedHeroInfo();
			}
		});
	}

	loadDetailedHeroInfo() {
		if (!this.selectedFacetId) return;

		this.loading = true;
		
		this.dotaMetaService.getDetailedHeroInfo(
			parseInt(this.heroId),
			this.selectedFacetId,
			this.daysAgo,
			this.onlyLeagueGames
		).subscribe({
			next: (response) => {
				this.detailedHeroInfo = response;
				this.processDetailedData(response);
				this.loading = false;
			},
			error: (error) => {
				console.error('Error loading detailed hero info:', error);
				this.loading = false;
			}
		});
	}

	processDetailedData(data: any) {
		// Process best items with image data
		this.bestHeroItems = {
			totalMatches: data.totalMatches,
			items: data.bestItems
				.filter((item: any) => item.totalMatches >= this.minMatchesFilter)
				.map((item: any) => ({
					...item,
					imageData: this.dotaHelperService.getItemDataById(item.itemId)
				}))
				.filter((item: any) => item.imageData) // Filter out items without image data
		};

		// Process position stats
		this.heroOverrallStats = data.positionStats.map((stat: any) => ({
			position: stat.position,
			totalMatches: stat.totalMatches,
			winRate: stat.winRate,
			avgKills: 0, // Not provided in new endpoint
			avgDeaths: 0, // Not provided in new endpoint  
			avgAssists: 0, // Not provided in new endpoint
			avgGpm: stat.avgGoldPerMinute,
			avgXpm: stat.avgExperiencePerMinute,
			avgHeroDamage: stat.avgHeroDamage,
			avgHeroHealing: 0, // Not provided in new endpoint
			avgTowerDamage: stat.avgTowerDamage
		}));

		// Process matchups grouped by position
		this.heroMatchups = this.groupMatchupsByPosition(data.heroMatchups);
	}

	groupMatchupsByPosition(matchups: any[]): any[] {
		const grouped: { [position: string]: any } = {};

		// Filter matchups by minimum matches first
		const filteredMatchups = matchups.filter(matchup => matchup.totalMatches >= this.minMatchesFilter);

		filteredMatchups.forEach(matchup => {
			if (!grouped[matchup.position]) {
				grouped[matchup.position] = {
					position: matchup.position,
					totalMatches: 0,
					matchups: []
				};
			}

			const enemyHero = this.dotaHelperService.getHeroData(matchup.againstHeroId);
			if (enemyHero) {
				grouped[matchup.position].matchups.push({
					enemyHero: enemyHero,
					winRate: matchup.winRate,
					totalMatches: matchup.totalMatches,
					avgKills: matchup.avgKills,
					avgDeaths: matchup.avgDeaths,
					avgAssists: matchup.avgAssists
				});
				grouped[matchup.position].totalMatches += matchup.totalMatches;
			}
		});

		// Sort matchups within each position by win rate descending
		Object.values(grouped).forEach((group: any) => {
			group.matchups.sort((a: any, b: any) => b.winRate - a.winRate);
		});

		return Object.values(grouped);
	}

	onMinMatchesChange(value: number) {
		this.minMatchesFilter = value;
		if (this.detailedHeroInfo) {
			this.processDetailedData(this.detailedHeroInfo);
		}
	}

	onLeagueGamesToggleChange(value: boolean) {
		this.onlyLeagueGames = value;
		// Reload data with the new filter
		this.findBestFacetAndLoadData();
	}

	selectFacet(facetId: number) {
		this.selectedFacetId = facetId;
		this.loadDetailedHeroInfo();
	}

    ngAfterViewInit() {
		if (this.hero && this.heroVideo) {
			const video = this.heroVideo.nativeElement;
			
			// Set up canplaythrough event to attempt playback when ready
			this.videoEventListener = this.handleVideoCanPlay.bind(this);
			video.addEventListener('canplaythrough', this.videoEventListener);
			
			// Force the src attribute directly to ensure proper loading
			if (this.hero.video_webm) {
				video.src = this.hero.video_webm;
				video.load();
			}
		}
	}
	
	ngOnDestroy() {
		// Clean up event listeners
		if (this.videoEventListener && this.heroVideo) {
			this.heroVideo.nativeElement.removeEventListener('canplaythrough', this.videoEventListener);
		}
		
		document.removeEventListener('click', this.handleUserInteraction.bind(this));
	}

	// Legacy methods - kept for compatibility but not used with new endpoints
	getHeroOverrallStats() {
		// This method is now replaced by loadDetailedHeroInfo
	}

	getBestHeroItems() {
		// This method is now replaced by loadDetailedHeroInfo
	}

	getHeroMatchups() {
		// This method is now replaced by loadDetailedHeroInfo
	}
	
	private handleVideoCanPlay() {
		this.videoLoaded = true;
		this.playVideo();
	}
	
	// Public so it can be called from the template
	handleUserInteraction() {
		this.playVideo();
		document.addEventListener('click', this.handleUserInteraction.bind(this), { once: true });
	}

	private playVideo() {
		if (!this.heroVideo) return;
		
		const video = this.heroVideo.nativeElement;
		
		if (video && (this.videoLoaded || video.readyState >= 3)) {
			
			// Ensure video is visible and set up properly
			video.style.display = 'block';
			video.volume = 0; // Ensure it's muted for autoplay policies
			
			// Try playing directly
			video.play()
				.then(() => {
				})
				.catch(error => {
					console.warn('Video playback failed:', error.message);
					console.log('Video status - paused:', video.paused, 'ended:', video.ended);
				});
		}
	}

	// Utils
	getPositionImage(position: string) {
		return DotaPlayerPositions.getPositionImage(position);
	}

	getPositionLabel(position: string) {
		return DotaPlayerPositions.getPositionLabel(position);
	}

	getDotaIcon(icon: string) {
		return this.dotaHelperService.getDotaIcon(icon);
	}

	getWinRateClass(winRate: number) {
		if (winRate > 50) return 'high';
		if (winRate > 40) return 'medium';
		return 'low';
	}

	getWinRateColor(winRate: number) {
		if (winRate > 50) return '#52C41A';
		if (winRate > 40) return '#FAAD14';
		return '#FF4D4F';
	}
}

interface HeroOverrallStats {
	position: string;
	totalMatches: number;
	winRate: number;
	avgKills: number;
	avgDeaths: number;
	avgAssists: number;
	avgGpm: number;
	avgXpm: number;
	avgHeroDamage: number;
	avgHeroHealing: number;
	avgTowerDamage: number;
}