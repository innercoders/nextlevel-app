export interface DotaMetaResponse {
	heroId: number;
	position: string;
	gamesPlayed: number;
	winRate: number;
	avgKda: number;
	avgGpm: number;
	avgXpm: number;

	positionImage?: string;
	positionName?: string;

	heroImage?: string;
	heroName: string;
}
