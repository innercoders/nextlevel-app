import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MatchesComponent } from "./matches/matches.component";
import { TournamentsComponent } from "./tournaments/tournaments.component";

const routes: Routes = [
	{ path: '', component: AdminComponent, children: [
		{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
		{ path: 'dashboard', component: DashboardComponent },
		{ path: 'matches', component: MatchesComponent },
		{ path: 'tournaments', component: TournamentsComponent },
	] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }
