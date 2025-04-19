import { NgModule } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { TimeFormatPipe } from './pipes/time-format.pipe';


@NgModule({
	declarations: [],
	imports: [
		NzIconModule,
		NzButtonModule,
		NzToolTipModule,
		NzButtonModule,
		NzGridModule,
		TimeFormatPipe
	],
	exports: [
		NzIconModule,
		NzButtonModule,
		NzToolTipModule,
		NzButtonModule,
		NzGridModule,
		TimeFormatPipe
	]
})
export class SharedModule {}
