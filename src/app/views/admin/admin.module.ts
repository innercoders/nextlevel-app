import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { RouterModule } from '@angular/router';
import { MatchesComponent } from './matches/matches.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { NzCardModule } from 'ng-zorro-antd/card';
@NgModule({
	declarations: [
		AdminComponent,
		DashboardComponent,
		MatchesComponent,
		TournamentsComponent
	],
	imports: [
		CommonModule,
		AdminRoutingModule,
		NzMenuModule,
		NzIconModule,
		NzGridModule,
		NzSelectModule,
		NzTableModule,
		NzButtonModule,
		NzInputModule,
		NzDatePickerModule,
		NzCheckboxModule,
		NzPaginationModule,
		NzTagModule,
		NzModalModule,
		NzCardModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
	]
})
export class AdminModule { }
