import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
	selector: 'app-about-us',
	imports: [
		CommonModule,
		NzGridModule,
		NzTimelineModule,
		NzIconModule,
		NzButtonModule
	],
	templateUrl: './about-us.component.html',
	styleUrl: './about-us.component.less'
})
export class AboutUsComponent {
	
}
