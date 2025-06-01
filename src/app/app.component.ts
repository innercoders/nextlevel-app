import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { animate, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

import { User } from './model/user';

import { SideMenuComponent } from './core/side-menu/side-menu.component';
import { MainSliderComponent } from './core/main-slider/main-slider.component';
import { UserService, ScrollService } from './service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
	selector: 'app-root',
	imports: [
		MainSliderComponent,
		SideMenuComponent,
		RouterOutlet,
		CommonModule,
		RouterModule,
		NzIconModule,
		NzMenuModule,
		NzInputModule,
		NzAvatarModule,
		NzButtonModule,
		NzToolTipModule,
		NzGridModule,
		NzPopoverModule,
		NzBadgeModule,
		NzPopconfirmModule
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
export class AppComponent implements OnInit {
	@ViewChild('mainContent', { static: false }) mainContent: ElementRef | undefined;
	private showSliderSubject = new BehaviorSubject<boolean>(true);
	showSlider$ = this.showSliderSubject.asObservable();
	
	currentUser: User | null = null;

	constructor(
		private router: Router, 
		private userService: UserService,
		private scrollService: ScrollService
	) {
	}

	ngOnInit() {
		this.userService.currentUser.subscribe(user => {
			this.currentUser = user;
		});

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe((event: any) => {
			const routesWithoutSlider = ['/login', '/admin'];
			const shouldShowSlider = !routesWithoutSlider.some(route => event.url.startsWith(route));
			this.showSliderSubject.next(shouldShowSlider);
		});
	}

	@HostListener('window:scroll', ['$event'])
	onWindowScroll() {
		if (!this.mainContent) return;
		
		const scrollTop = this.mainContent.nativeElement.scrollTop;

		const maxScrollForOpacity = 250;
		const opacity = Math.max(0.1, 0.3 - (scrollTop / maxScrollForOpacity));
		
		this.scrollService.updateSliderOpacity(opacity);
	}

	login() {
		this.router.navigate(['/login']);
	}
	
	logout() {
		this.userService.logout();
		this.router.navigate(['/']);
	}
}
