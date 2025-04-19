import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { ScrollService } from '../../service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-main-slider',
	imports: [CommonModule, NzButtonModule, RouterModule],
	templateUrl: './main-slider.component.html',
	styleUrls: ['./main-slider.component.less'],
	animations: [
		trigger('slideAnimation', [
			transition(':enter', [
				style({opacity: 0}),
				animate('700ms ease-out', style({opacity: 1}))
			]),
			transition(':leave', [
				animate('700ms ease-in', style({opacity: 0}))
			])
		])
	]
})
export class MainSliderComponent implements OnInit, AfterViewInit, OnDestroy {

	showControls = false;

	@ViewChild('progressBar') public progressBar!: HTMLElement;
	private progressInterval!: any;
	public progressBarWidth: number = 0;
	
	public sliderOpacity = 0.2;
	private opacitySubscription: Subscription | undefined;

	public recentPosts: { featureImageUrl: string, title: string, shortContent: string, publishedAt: Date, callToAction?: string }[] = [
		{
			featureImageUrl: '/assets/images/background/manifesto2.png',
			title: 'Next Level',
			shortContent: 'O novo caminho para o Dota 2',
			publishedAt: new Date(),
			callToAction: 'Conheça o projeto'
		},
		{
			featureImageUrl: '/assets/images/background/manifesto1.png',
			title: 'Iniciante no Dota?',
			shortContent: 'Confira nossa tutorial completo',
			publishedAt: new Date()
		},
		{
			featureImageUrl: '/assets/images/background/wallpaper1.png',
			title: 'Iniciante no Dota?',
			shortContent: 'Confira nossa tutorial completo',
			publishedAt: new Date()
		},
		{
			featureImageUrl: '/assets/images/background/manifesto3.png',
			title: 'Iniciante no Dota?',
			shortContent: 'Confira nossa tutorial completo',
			publishedAt: new Date()
		}
	];

	public currentIndex = 0;
	private slideInterval: any;
	
	constructor(private scrollService: ScrollService) {}

	public ngOnInit(): void {
		this.opacitySubscription = this.scrollService.sliderOpacity$.subscribe(opacity => {
			this.sliderOpacity = opacity;
		});
	}

	public ngAfterViewInit() {
		this.startSlider();
	}

	public ngOnDestroy(): void {
		if (this.slideInterval) {
			clearInterval(this.slideInterval);
		}
		
		if (this.opacitySubscription) {
			this.opacitySubscription.unsubscribe();
		}
	}

	private startSlider(): void {
		this.slideInterval = setInterval(() => {
			this.currentIndex = (this.currentIndex + 1) % this.recentPosts.length;
			clearInterval(this.progressInterval);
			this.progressBarWidth = 0;
			this.startProgressInterval();
		}, 10000);

		this.startProgressInterval();
	}

	private startProgressInterval(): void {
		const interval = 100;
		this.progressBarWidth = 0;
		const progressMaxValue = 100;
		const progressStep = 1;

		if(this.progressInterval) {
			clearInterval(this.progressInterval);
		}

		this.progressInterval = setInterval(() => {
			this.progressBarWidth += progressStep;
		}, interval);
	}
}
