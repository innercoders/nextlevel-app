import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '@app/service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { User } from '@app/model';

@Component({
	selector: 'app-side-menu',
	imports: [CommonModule, SharedModule, RouterLink, RouterLinkActive, NzToolTipModule],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.less'
})
export class SideMenuComponent implements OnInit {

	currentUser: User | null = null;

	constructor(private userService: UserService) {
		this.userService.currentUser.subscribe((user) => {
			this.currentUser = user;
		});
	}

	ngOnInit(): void {
		this.userService.currentUser.subscribe(user => {
			this.currentUser = user;
		});
	}
}
