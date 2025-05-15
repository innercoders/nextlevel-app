export interface DotaHeroAbilities {
    abilities: string[];
    facets: DotaFacet[];
    talents: DotaTalent[];
    allFacets: DotaFacet[];
}

export interface DotaTalent {
    name: string;
    level: number;
}

export interface DotaFacet {
    id: number;
    name: string;
    icon: string;
    color: string;
    gradient_id: number;
    title: string;
    description: string;
    shortDescription: string;
    abilities: string[];
    deprecated: any;
}