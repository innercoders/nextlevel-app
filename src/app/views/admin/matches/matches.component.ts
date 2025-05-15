import { Component, OnInit } from '@angular/core';
import { DotaMatch } from 'app/model';
import { DotaMatchService } from 'app/service/dota-match.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface StatusOption {
	label: string;
	value: string;
}

interface MatchesResponse {
	data: DotaMatch[];
	total: number;
}

interface ParseBatchResponse {
	success: boolean;
	message: string;
	results: any[];
}

@Component({
	selector: 'app-matches',
	standalone: false,
	templateUrl: './matches.component.html',
	styleUrl: './matches.component.less'
})
export class MatchesComponent implements OnInit {
	// Data
	matches: DotaMatch[] = [];
	selectedMatches: DotaMatch[] = [];
	loading = false;
	totalResults = 0;
	pageSize = 10;
	currentPage = 1;
	
	// Status filter
	selectedStatus: string = 'FAILED';
	statusOptions: StatusOption[] = [
		{ label: 'Em Andamento', value: 'MATCH_ON_GOING' },
		{ label: 'Na fila', value: 'QUEUED' },
		{ label: 'Completo', value: 'COMPLETED' },
		{ label: 'Falhou', value: 'FAILED' }
	];
	
	// Modal
	isReparseModalVisible = false;
	isAllChecked = false;
	isIndeterminate = false;

	constructor(
		private dotaMatchService: DotaMatchService,
		private message: NzMessageService
	) {}

	ngOnInit(): void {
		// this.loadMatches();
	}

	loadMatches(): void {
		this.loading = true;
		this.dotaMatchService.getMatchesByStatus(
			this.selectedStatus, 
			this.currentPage, 
			this.pageSize
		).subscribe({
			next: (response: MatchesResponse) => {
				this.matches = response.data;
				this.totalResults = response.total;
				this.loading = false;
				this.refreshCheckedStatus();
			},
			error: (error: any) => {
				console.error('Error loading matches:', error);
				this.message.error('Erro ao carregar partidas');
				this.loading = false;
			}
		});
	}

	changeStatus(status: string): void {
		this.selectedStatus = status;
		this.currentPage = 1;
		this.selectedMatches = [];
		this.loadMatches();
	}

	changePage(params: NzTableQueryParams): void {
		this.currentPage = params.pageIndex;
		this.pageSize = params.pageSize;
		this.loadMatches();
	}

	getStatusColor(status: string): string {
		switch (status) {
			case 'COMPLETED':
				return 'success';
			case 'MATCH_ON_GOING':
				return 'processing';
			case 'FAILED':
				return 'error';
			default:
				return 'default';
		}
	}

	formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}

	// Checkbox handling
	checkAll(checked: boolean): void {
		this.matches.forEach(match => this.updateCheckedSet(match, checked));
		this.refreshCheckedStatus();
	}

	checkMatch(checked: boolean, match: DotaMatch): void {
		this.updateCheckedSet(match, checked);
		this.refreshCheckedStatus();
	}

	updateCheckedSet(match: DotaMatch, checked: boolean): void {
		if (checked) {
			if (!this.isChecked(match)) {
				this.selectedMatches.push(match);
			}
		} else {
			this.selectedMatches = this.selectedMatches.filter(m => m.matchId !== match.matchId);
		}
	}

	refreshCheckedStatus(): void {
		if (!this.matches || this.matches.length === 0) {
			this.isAllChecked = false;
			this.isIndeterminate = false;
			return;
		}
		
		const allChecked = this.matches.every(match => this.isChecked(match));
		const allUnchecked = this.matches.every(match => !this.isChecked(match));
		
		this.isAllChecked = allChecked;
		this.isIndeterminate = !allChecked && !allUnchecked;
	}

	isChecked(match: DotaMatch): boolean {
		return this.selectedMatches.some(m => m.matchId === match.matchId);
	}

	// Reparse functions
	reparseSelectedMatches(): void {
		if (this.selectedMatches.length === 0) {
			this.message.warning('Nenhuma partida selecionada');
			return;
		}
		this.isReparseModalVisible = true;
	}

	handleReparseCancel(): void {
		this.isReparseModalVisible = false;
	}

	confirmReparse(): void {
		const matchIds = this.selectedMatches.map(match => match.matchId);
		
		this.loading = true;
		this.dotaMatchService.parseBatchMatches(matchIds).subscribe({
			next: (response: ParseBatchResponse) => {
				this.message.success(response.message);
				this.isReparseModalVisible = false;
				this.selectedMatches = [];
				this.loadMatches();
			},
			error: (error: any) => {
				console.error('Error reparsing matches:', error);
				this.message.error('Erro ao reprocessar partidas');
				this.loading = false;
				this.isReparseModalVisible = false;
			}
		});
	}
}
