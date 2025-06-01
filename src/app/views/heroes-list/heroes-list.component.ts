import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DotaHero, DotaHeroSummary } from '@app/model';
import { DotaHelperService } from '@app/service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
	selector: 'app-heroes-list',
	imports: [
		CommonModule,
		FormsModule,
		NzGridModule,
		NzIconModule,
		NzInputModule,
		NzButtonModule,
		NzToolTipModule,
		NzSelectModule,
	],
	templateUrl: './heroes-list.component.html',
	styleUrls: ['./heroes-list.component.less']
})
export class HeroesListComponent implements OnInit {
	heroes: DotaHero[] = [];
	filteredHeroes: DotaHero[] = [];
	searchTerm: string = '';
  
	// Filter options
	selectedAttribute: string = '';
	selectedComplexity: number = 0;
	selectedAttackType: string = '';
	includedHeroes: number[] = [];

	attributes = [
		{ value: 'str', label: 'Força', icon: 'hero_strength.png' },
		{ value: 'agi', label: 'Agilidade', icon: 'hero_agility.png' },
		{ value: 'int', label: 'Inteligência', icon: 'hero_intelligence.png' },
		{ value: 'all', label: 'Universal', icon: 'hero_universal.png' }
	];

	attackTypes = [
		{ value: 'Melee', label: 'Corpo a corpo', icon: 'melee.svg' },
		{ value: 'Ranged', label: 'À distância', icon: 'ranged.svg' }
	];

	complexityLevels = [
		{ value: 1, label: 'Simples' },
		{ value: 2, label: 'Moderada' },
		{ value: 3, label: 'Complexa' }
	];

	constructor(
		private dotaHelperService: DotaHelperService,
		private router: Router
	) {}

	ngOnInit() {
		this.loadHeroes();
	}

	loadHeroes(): void {
		this.dotaHelperService.getAllHeroes().subscribe(heroes => {
			this.heroes = heroes;
			this.filteredHeroes = heroes;

			this.heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
			this.filteredHeroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));

			this.heroes.forEach(hero => {
				hero.primaryAttributeImage = this.attributes.find(attr => attr.value === hero.primary_attr)?.icon || '';
			})
		});
	}

	onHeroClick(hero: DotaHero): void {
		this.router.navigate(['/heroes', hero.sanitizedName]);
	}

	onSearch(): void {
		this.applyFilters();
	}

	onAttributeFilter(attribute: string): void {
		// Toggle functionality: if the same attribute is clicked, unselect it
		this.selectedAttribute = this.selectedAttribute === attribute ? '' : attribute;
		this.applyFilters();
	}

	onAttackTypeFilter(attackType: string): void {
		// Toggle functionality: if the same attack type is clicked, unselect it
		this.selectedAttackType = this.selectedAttackType === attackType ? '' : attackType;
		this.applyFilters();
	}

	onComplexityFilter(complexity: number): void {
		// Toggle functionality: if the same complexity is clicked, unselect it
		this.selectedComplexity = this.selectedComplexity === complexity ? 0 : complexity;
		this.applyFilters();
	}

	onIncludeHeroChange(heroIds: number[]): void {
		this.includedHeroes = heroIds;
		this.applyFilters();
	}

	clearFilters(): void {
		this.searchTerm = '';
		this.selectedAttribute = '';
		this.selectedComplexity = 0;
		this.selectedAttackType = '';
		this.includedHeroes = [];
		this.filteredHeroes = this.heroes;
	}

	private applyFilters(): void {
		let filtered = this.heroes;

		if (this.searchTerm) {
			filtered = filtered.filter(hero => 
			hero.localized_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
			hero.name.toLowerCase().includes(this.searchTerm.toLowerCase())
			);
		}

		if (this.selectedAttribute) {
			filtered = filtered.filter(hero => hero.primary_attr === this.selectedAttribute);
		}

		if (this.selectedAttackType) {
			filtered = filtered.filter(hero => hero.attack_type === this.selectedAttackType);
		}

		if (this.selectedComplexity) {
			filtered = filtered.filter(hero => hero.complexity == this.selectedComplexity);
		}

		if (this.includedHeroes.length > 0) {
			filtered = filtered.filter(hero => this.includedHeroes.includes(hero.id));
		}

		this.filteredHeroes = filtered;
	}

	getDotaIcon(icon: string): string {
		return this.dotaHelperService.getDotaIcon(icon);
	}

	getAttackTypeIcon(attackType: string): string {
		const type = this.attackTypes.find(t => t.value === attackType);
		return type ? `/assets/images/dota/type/${type.icon}` : '';
	}

	parseInt(value: string): number {
		return parseInt(value, 10);
	}
} 