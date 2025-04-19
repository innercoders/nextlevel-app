import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DotaHero } from '@app/model';
import { DotaMetaService, DotaHelperService } from '@app/service';
import { DotaPlayerPositions } from '@app/shared';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-heroes',
  imports: [
	CommonModule,
	NzGridModule,
	NzProgressModule,
	NzIconModule,
	NzToolTipModule,
	NzCollapseModule,
	RouterModule
  ],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.less'
})
export class HeroesComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
	
	private videoEventListener: any;

	heroId: string = '';
	hero?: DotaHero;
	videoLoaded = false;

	bestHeroItems?: any;
	heroOverrallStats?: HeroOverrallStats[];
	heroMatchups?: any[];

	public heroRecordsPositions: string[] = ['POSITION_1', 'POSITION_2', 'POSITION_3', 'POSITION_4', 'POSITION_5'];

	constructor(private route: ActivatedRoute,
		private dotaMetaService: DotaMetaService,
		private dotaHelperService: DotaHelperService
	) {
	}

	ngOnInit() {
		this.route.params.subscribe((params) => {
			console.log('params', params['heroId']);
			this.hero = this.dotaHelperService.getHeroData(params['heroId']);
			this.heroId = this.hero.id.toString();

			this.getHeroOverrallStats();
			this.getBestHeroItems();
			this.getHeroMatchups();
			
			// Add a document-level click handler to help with autoplay restrictions
			document.addEventListener('click', this.handleUserInteraction.bind(this), { once: true });

			if(this.heroVideo) {
				this.heroVideo.nativeElement.src = this.hero.video;
				this.heroVideo.nativeElement.load();
			}
		});
	}

    ngAfterViewInit() {
		if (this.hero && this.heroVideo) {
			const video = this.heroVideo.nativeElement;
			
			// Set up canplaythrough event to attempt playback when ready
			this.videoEventListener = this.handleVideoCanPlay.bind(this);
			video.addEventListener('canplaythrough', this.videoEventListener);
			
			// Force the src attribute directly to ensure proper loading
			if (this.hero.video) {
				video.src = this.hero.video;
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

	getHeroOverrallStats() {
		this.dotaMetaService.getHeroOverrallStats({ heroId: this.heroId }).subscribe((data) => {
			this.heroOverrallStats = data.overallStats;
		});
	}

	getBestHeroItems() {
		this.dotaMetaService.getBestHeroItems({ heroId: this.heroId }).subscribe((data) => {
			data.items = data.items.map((item: any) => {
				return {
					...item,
					imageData: this.dotaHelperService.getItemDataById(item.itemId)
				}
			});

			this.bestHeroItems = data;
		});
	}

	getHeroMatchups() {
		this.dotaMetaService.getHeroMatchups({ heroId: this.heroId }).subscribe((data) => {
			let finalData = Object.keys(data.matchupsByPosition).map((key) => {
				return {
					position: key,
					matchups: data.matchupsByPosition[key],
					totalMatches: 0
				}
			});

			finalData.sort((a, b) => {
				return a.position.localeCompare(b.position);
			});

			finalData.forEach((item) => {

				item.matchups.forEach((matchup: any) => {
					matchup.enemyHero = this.dotaHelperService.getHeroData(matchup.enemyHeroId);
					item.totalMatches += matchup.totalMatches;
				});
			});

			this.heroMatchups = finalData;

			console.log(finalData);
		});
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