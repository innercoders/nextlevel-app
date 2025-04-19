import { Injectable } from '@angular/core';
import heroesData from './dotaconst/heroes.json';
import heroesAliases from './dotaconst/heroes_aliases.json';
import itemsData from './dotaconst/items.json';
import itemIdsData from './dotaconst/item_ids.json';
import { DotaHero, DotaItem } from '@app/model';

@Injectable({
	providedIn: 'root'
})
export class DotaHelperService {

	private heroes: any = heroesData;
	private items: any = itemsData;
	private itemIds: any = itemIdsData;

	private heroRoles: any[] = [
		{ label: 'Carregador', value: 'Carry', count: 0 },
		{ label: 'Suporte', value: 'Support', count: 0 },
		{ label: 'Bombardeador', value: 'Nuker', count: 0 },
		{ label: 'Desativador', value: 'Disabler', count: 0 },
		{ label: 'Caçador', value: 'Jungler', count: 0 },
		{ label: 'Resistente', value: 'Durable', count: 0 },
		{ label: 'Escapista', value: 'Escape', count: 0 },
		{ label: 'Empurrador', value: 'Pusher', count: 0 },
		{ label: 'Iniciador', value: 'Initiator', count: 0 },
	];

	constructor() {
	}

	public getHeroData(heroId: string | number): DotaHero {
		let hero = this.heroes[heroId];

		if(!hero) {
			console.log('heroId', heroId);
			let alias = Object.keys(heroesAliases).find((key: string) => {
				return heroesAliases[key as keyof typeof heroesAliases].includes(heroId.toString());
			});

			if(alias) {
				hero = this.heroes[alias];
			}
		}

		hero.formatted_roles = [];
		let i = 0;

		this.heroRoles.forEach((role: any) => {

			let count = 0;

			hero.roles.some((r: string, index: number) => {
				if(r == role.value) {
					count = hero.roleLevels[index];
					return true;
				}
				return false;
			});

			hero.formatted_roles.push({
				label: role.label,
				role: role.value,
				count: count / 3 * 100
			});
			i ++;
		});

		if(hero.similarHeroes) {
			hero.similarHeroesData = hero.similarHeroes.map((heroId: string) => {
				let heroData = this.heroes[heroId];

				heroData.sanitized_name = heroData.name.replace('npc_dota_hero_', '').replace(/_/g, '-');

				return heroData;
			});
		}

		return hero;
	}

	public getItemDataById(itemId: any): DotaItem {
		return this.items[this.itemIds[itemId]];
	}

	public getItemDataByCode(itemCode: string): DotaItem {
		return this.items[itemCode];
	}

	public getPositionImage(position: string): string {
		switch(position) {
			case 'carry':
			case 'POSITION_1':
				return 'assets/images/roles/carry.png';
			case 'mid':
			case 'POSITION_2':
				return 'assets/images/roles/mid.png';
			case 'off':
			case 'POSITION_3':
				return 'assets/images/roles/off.png';
			case 'sup4':
			case 'POSITION_4':
				return 'assets/images/roles/support4.png';
			case 'sup5':
			case 'POSITION_5':
				return 'assets/images/roles/support5.png';
			default:
				return 'assets/images/roles/carry.png';
		}
	}

	public getPositionName(position: string): string {
		switch(position) {
			case 'carry':
			case 'POSITION_1':
				return 'Carry';
			case 'mid':
			case 'POSITION_2':
				return 'Mid';
			case 'off':
			case 'POSITION_3':
				return 'Off';
			case 'sup4':
			case 'POSITION_4':
				return 'Suporte 4';
			case 'sup5':
			case 'POSITION_5':
				return 'Suporte 5';
			default:
				return 'Carry';
		}
	}

	public getHeroesData(): void {

	}
}
