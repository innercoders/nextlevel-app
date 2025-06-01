import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { User } from '@app/model';
import { UserService } from '@app/service';

import { MetaHeroesComponent } from './meta-heroes/meta-heroes.component';
import { RankingTableComponent } from './ranking-table/ranking-table.component';

@Component({
	selector: 'app-home',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NzGridModule,
		NzCarouselModule,
		NzButtonModule,
		NzIconModule,
		RouterModule,
		MetaHeroesComponent,
		RankingTableComponent,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit {

	public currentUser: User | null = null;

	constructor(
		private userService: UserService,
		private router: Router
	) {}

	public ngOnInit() {
		this.userService.currentUser.subscribe(user => {
			this.currentUser = user;
		});
	}
}
