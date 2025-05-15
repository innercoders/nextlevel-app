import { Component, OnInit } from '@angular/core';
import { DotaLeagueService } from 'app/service/dota-league.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DotaLeague } from '@app/model';

@Component({
	selector: 'app-tournaments',
	standalone: false,
	templateUrl: './tournaments.component.html',
	styleUrl: './tournaments.component.less'
})
export class TournamentsComponent implements OnInit {
	leagues: DotaLeague[] = [];
	loading = false;
	leagueForm!: FormGroup;
	selectedLeague: DotaLeague | null = null;
	isEditing = false;

	tierOptions = [
		{ label: 'Premium', value: 'premium' },
		{ label: 'Professional', value: 'professional' },
		{ label: 'Amateur', value: 'amateur' }
	];

	regionOptions = [
		{ label: 'North America', value: 'na' },
		{ label: 'South America', value: 'sa' },
		{ label: 'Europe', value: 'eu' },
		{ label: 'China', value: 'cn' },
		{ label: 'Southeast Asia', value: 'sea' }
	];

	constructor(
		private dotaLeagueService: DotaLeagueService,
		private fb: FormBuilder,
		private message: NzMessageService
	) {}

	ngOnInit(): void {
		this.initForm();
		this.loadLeagues();
	}

	initForm(): void {
		this.leagueForm = this.fb.group({
			id: [null],
			name: [null, [Validators.required]],
			displayName: [null, [Validators.required]],
			tier: [null],
			region: [null],
			leagueId: [null, [Validators.required]],
			imageUrl: [null]
		});
	}

	loadLeagues(): void {
		this.loading = true;
		this.dotaLeagueService.getLeagues().subscribe({
			next: (leagues) => {
				this.leagues = leagues.sort((a, b) => b.leagueId - a.leagueId);
				this.loading = false;
			},
			error: (error) => {
				console.error('Error loading leagues', error);
				this.message.error('Failed to load tournaments');
				this.loading = false;
			}
		});
	}

	selectLeague(league: DotaLeague): void {
		this.selectedLeague = league;
		this.isEditing = true;
		this.leagueForm.patchValue({
			id: league.id,
			name: league.name,
			displayName: league.displayName,
			tier: league.tier,
			region: league.region,
			leagueId: league.leagueId,
			imageUrl: league.imageUrl
		});
	}

	addNewLeague(): void {
		this.selectedLeague = null;
		this.isEditing = false;
		this.leagueForm.reset();
	}

	saveLeague(): void {
		if (this.leagueForm.invalid) {
			Object.values(this.leagueForm.controls).forEach(control => {
				if (control.invalid) {
					control.markAsDirty();
					control.updateValueAndValidity({ onlySelf: true });
				}
			});
			return;
		}

		const leagueData = this.leagueForm.value;
		this.loading = true;
		
		if (this.isEditing && this.selectedLeague) {
			// Update existing league
			this.dotaLeagueService.updateLeague(leagueData).subscribe({
				next: () => {
					this.message.success('Campeonato atualizado com sucesso');
					this.loadLeagues();
					this.addNewLeague();
					this.loading = false;
				},
				error: (error) => {
					console.error('Error updating league', error);
					this.message.error('Falha ao atualizar campeonato');
					this.loading = false;
				}
			});
		} else {
			// Create new league
			this.dotaLeagueService.createLeague(leagueData).subscribe({
				next: () => {
					this.message.success('Campeonato adicionado com sucesso');
					this.loadLeagues();
					this.addNewLeague();
					this.loading = false;
				},
				error: (error) => {
					console.error('Error creating league', error);
					this.message.error('Falha ao adicionar campeonato');
					this.loading = false;
				}
			});
		}
	}
}
