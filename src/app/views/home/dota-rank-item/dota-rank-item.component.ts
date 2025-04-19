import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';

@Component({
  selector: 'app-dota-rank-item',
  imports: [
	CommonModule,
	SharedModule
  ],
  templateUrl: './dota-rank-item.component.html',
  styleUrl: './dota-rank-item.component.less'
})
export class DotaRankItemComponent {

	@Input() rank: any;
	@Input() isFeatured: boolean = false;

}
