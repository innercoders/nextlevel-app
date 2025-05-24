import { DotaItem } from "./dota-item";

export interface DotaHero {
	id: number;
	name: string;
	sanitizedName: string;
	primary_attr: string;
	attack_type: string;
	roles: string[];
	roleLevels: string[];
	primaryAttributeImage: string;
	img: string;
	icon: string;
	video: string;
	video_webm: string;
	base_health: number;
	base_health_regen: number;
	base_mana: number;
	base_mana_regen: number;
	base_armor: number;
	base_mr: number;
	base_attack_min: number;
	base_attack_max: number;
	base_str: number;
	base_agi: number;
	base_int: number;
	str_gain: number;
	agi_gain: number;
	int_gain: number;
	attack_range: number;
	projectile_speed: number;
	attack_rate: number;
	base_attack_time: number;
	attack_point: number;
	move_speed: number;
	turn_rate: number;
	cm_enabled: boolean;
	legs: number;
	day_vision: number;
	night_vision: number;
	localized_name: string;
	formatted_roles: any[];
	complexity: number;
	botHeroType: string;
	similarHeroes: number[];
	similarHeroesData: DotaHero[];
	facets: any;
	heroAlias: any;

	positionImage?: string;
	positionLabel?: string;

	previousHero?: DotaHero;
	nextHero?: DotaHero;
}

// Define a more memory-efficient subset of DotaHero for listings
export type DotaHeroSummary = Pick<DotaHero, 
  'id' | 
  'name' | 
  'icon' | 
  'img' | 
  'localized_name' | 
  'roles' | 
  'roleLevels' | 
  'sanitizedName' |
  'positionImage' |
  'positionLabel'
>;