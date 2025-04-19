import { Component, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

import { SideMenuComponent } from './core/side-menu/side-menu.component';
import { MainSliderComponent } from './core/main-slider/main-slider.component';
import { UserService, ScrollService } from './service';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
	selector: 'app-root',
	imports: [
		SideMenuComponent,
		RouterOutlet,
		MainSliderComponent,
		CommonModule,
		NzIconModule
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.less',
	animations: [
		trigger('sliderAnimation', [
			transition(':enter', [
				style({
					opacity: 0,
					transform: 'translateY(-20px)'
				}),
				animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
					style({
						opacity: 1,
						transform: 'translateY(0)'
					})
				)
			]),
			transition(':leave', [
				style({
					opacity: 1,
					transform: 'translateY(0)'
				}),
				animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
					style({
						opacity: 0,
						transform: 'translateY(-20px)'
					})
				)
			])
		])
	]
})
export class AppComponent {
	@ViewChild('mainContent', { static: false }) mainContent: ElementRef | undefined;
	private showSliderSubject = new BehaviorSubject<boolean>(true);
	showSlider$ = this.showSliderSubject.asObservable();
	
	currentUser: any;

	constructor(
		private router: Router, 
		private userService: UserService,
		private renderer: Renderer2,
		private scrollService: ScrollService
	) {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe((event: any) => {
			const routesWithoutSlider = ['/login', '/admin', '/about-us'];
			const shouldShowSlider = !routesWithoutSlider.some(route => event.url.startsWith(route));
			this.showSliderSubject.next(shouldShowSlider);
		});
		
		this.userService.currentUser.subscribe((user) => {
			this.currentUser = user;
		});
	}

	@HostListener('window:scroll', ['$event'])
	onWindowScroll() {
		if (!this.mainContent) return;
		
		const scrollTop = this.mainContent.nativeElement.scrollTop;
		// Calculate opacity based on scroll position - fade out over 200px of scrolling
		const maxScrollForOpacity = 250;
		const opacity = Math.max(0.1, 0.5 - (scrollTop / maxScrollForOpacity));
		
		// Update opacity through the service
		this.scrollService.updateSliderOpacity(opacity);
	}

	logout() {
		this.userService.logout();
		this.router.navigate(['/login']);
	}
}
