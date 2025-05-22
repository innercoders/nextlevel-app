import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		component: AppComponent,
		children: [
			{
				path: '',
				redirectTo: '',
				pathMatch: 'full'
			},
			{
				path: '',
				loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent)
			},
			{
				path: 'matches/:matchId',
				loadComponent: () => import('./views/dota-match/dota-match.component').then(m => m.DotaMatchComponent)
			},
			{
				path: 'dota-matches',
				loadComponent: () => import('./views/dota-matches/dota-matches.component').then(m => m.DotaMatchesComponent)
			},
			{
				path: 'dota-meta',
				loadComponent: () => import('./views/dota-meta/dota-meta.component').then(m => m.DotaMetaComponent)
			},
			{
				path: 'dota-meta/heroes/:heroId',
				loadComponent: () => import('./views/dota-meta/heroes/heroes.component').then(m => m.HeroesComponent)
			},
			{
				path: 'admin',
				loadChildren: () => import('./views/admin/admin.module').then(m => m.AdminModule),
				canActivate: [AuthGuard]
			},
			{
				path: 'about-us',
				loadComponent: () => import('./views/about-us/about-us.component').then(m => m.AboutUsComponent)
			},
			{
				path: 'tournaments',
				loadComponent: () => import('./views/tournaments/tournaments.component').then(m => m.TournamentsComponent)
			},
			{
				path: 'login',
				loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent)
			},
			{
				path: '**',
				redirectTo: ''
			}
		]
	}
];
