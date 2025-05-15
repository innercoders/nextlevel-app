import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-tournaments',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: './tournaments.component.html',
	styleUrl: './tournaments.component.less'
})
export class TournamentsComponent implements OnInit {

	constructor() {}

	ngOnInit(): void {

	}
}
