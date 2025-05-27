import { Injectable } from '@angular/core';
import { DotaHero, DotaItem, DotaHeroAbilities, DotaHeroSummary } from '@app/model';
import { Observable, of } from 'rxjs';

import heroesData from './dotaconst/heroes.json';
import heroesAliases from './dotaconst/heroes_aliases.json';
import itemsData from './dotaconst/items.json';
import itemIdsData from './dotaconst/item_ids.json';
import heroAbilitiesData from './dotaconst/hero_abilities.json';
import abilityIdsData from './dotaconst/ability_ids.json';
import abilitiesData from './dotaconst/abilities.json';

@Injectable({
	providedIn: 'root'
})
export class DotaHelperService {

	private heroes: any = heroesData;
	private heroesNameOrdered: any[] = [];
	private items: any = itemsData;
	private itemIds: any = itemIdsData;
	private heroAbilities: any = heroAbilitiesData;
	private abilities: any = abilitiesData;
	private abilityIds: any = abilityIdsData;

	consumableItems: number[] = [38, 39, 40, 42, 43, 44, 46, 65, 188, 218, 237, 1123];

	private heroRoles: { label: string, value: string, count: number }[] = [
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
		// create a new object with complete values and order the heroes by localized_name
		this.heroesNameOrdered = Object.keys(this.heroes).map((key) => {
			return {
				...this.heroes[key]
			};
		}).sort((a, b) => a.localized_name.localeCompare(b.localized_name));

		console.log(this.heroesNameOrdered);
	}

	public getAllHeroes(): Observable<DotaHero[]> {
		const heroArray: DotaHero[] = [];
		
		Object.keys(this.heroes).forEach(id => {
			try {
				const hero = this.getHeroData(id);
				heroArray.push(hero);
			} catch (e) {
				// Skip heroes that can't be parsed
			}
		});
		
		return of(heroArray);
	}

	public getAllHeroesSummary(): Observable<DotaHeroSummary[]> {
		const heroArray: DotaHeroSummary[] = [];
		
		Object.keys(this.heroes).forEach(id => {
			try {
				const hero = this.getHeroDataSummary(id);
				heroArray.push(hero);
			} catch (e) {
				// Skip heroes that can't be parsed
			}
		});
		
		return of(heroArray);
	}

	formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
	}

	public getHeroDataSummary(heroId: string | number): DotaHeroSummary {
		let hero = this.heroes[heroId];

		if(!hero) {
			let alias = this.heroAliasToId(heroId.toString());

			if(alias) {
				hero = this.heroes[alias];
			}

			if(!hero) {
				throw new Error('Hero not found');
			}
		}

		const sanitizedName = hero.name ? hero.name.replace('npc_dota_hero_', '').replace(/_/g, '-') : '';

		return {
			id: hero.id,
			name: hero.name,
			icon: hero.icon,
			img: hero.img,
			localized_name: hero.localized_name,
			roles: hero.roles,
			roleLevels: hero.roleLevels,
			sanitizedName
		};
	}

	public getHeroData(heroId: string | number, getPreviousNext: boolean = false): DotaHero {
		let hero = this.heroes[heroId];

		if(!hero) {
			let alias = this.heroAliasToId(heroId.toString());

			if(alias) {
				hero = this.heroes[alias];
			}

			if(!hero) {
				throw new Error('Hero not found');
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

		if(getPreviousNext) {
			hero.previousHero = this.findPreviousHero(hero.localized_name);
			hero.nextHero = this.findNextHero(hero.localized_name);

			hero.dotaHeroAbilities = [];

			if(hero.abilities) {
				hero.abilities.forEach((ability: any) => {
					let abilityData = this.getAbilityDataById(ability.id);
					hero.dotaHeroAbilities.push(abilityData);
				});
			};
		}

		return hero;
	}

	private findPreviousHero(localizedName: string): DotaHero {
		let index = this.heroesNameOrdered.findIndex((hero) => hero.localized_name == localizedName);

		let previousHero = this.heroesNameOrdered[index - 1];

		while(!previousHero) {
			index --;
			previousHero = this.heroesNameOrdered[index];
		}

		return previousHero;
	}

	private findNextHero(localizedName: string): DotaHero {
		let index = this.heroesNameOrdered.findIndex((hero) => hero.localized_name == localizedName);

		let nextHero = this.heroesNameOrdered[index + 1];

		while(!nextHero) {
			index ++;
			nextHero = this.heroesNameOrdered[index];
		}

		return nextHero;
	}

	public getItemDataById(itemId: any): DotaItem {
		return this.items[this.itemIds[itemId]];
	}

	public getItemDataByCode(itemCode: string): DotaItem {
		return this.items[itemCode];
	}

	public getAbilityData(abilityKey: string): any {
		return this.abilities[abilityKey];
	}

	public getAbilityDataById(abilityId: string): any {
		return this.abilities[this.abilityIds[abilityId]];
	}

	public getHeroAbilityData(heroName: string): DotaHeroAbilities | undefined {
		let heroAbilities = this.heroAbilities[heroName];
		let hero = this.getHeroData(heroName);

		if(!heroAbilities) {
			return undefined;
		}

		heroAbilities.facets.forEach((facet: any) => {
			let heroFacet = hero.facets[facet.name];
			facet.icon = heroFacet.Icon;
			facet.color = heroFacet.Color;

			facet.shortDescription = facet.description.split(' ').slice(0, 12).join(' ');
		});

		return heroAbilities;
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

	public getDotaIcon(icon: string): string {
		return '/assets/images/dota/icons/' + icon + '.png';
	}

	private heroAliasToId(alias: string): string | undefined {
		let heroId: string | undefined = Object.keys(heroesAliases).find((key: string) => {
			return heroesAliases[key as keyof typeof heroesAliases].includes(alias);
		});

		if(!heroId) {
			heroId = Object.keys(heroesData).find((key: string) => {
				return heroesData[key as keyof typeof heroesData].name == alias;
			});
		}

		return heroId;
	}

	private heroIdToAlias(heroId: string): string | undefined {
		let alias = this.heroes[heroId].name;

		return alias;
	}


}
