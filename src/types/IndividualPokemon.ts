import { BaseEntry } from './BaseEntry';

interface AbilityEntry extends BaseEntry {}

interface TypeEntry extends BaseEntry {}

interface PokemonAbility {
  ability: AbilityEntry;
  is_hidden: boolean;
  slot: number;
}

interface PokemonSprite {
  back_default?: string;
  back_female?: string;
  back_shiny?: string;
  back_shiny_female?: string;
  front_default?: string;
  front_female?: string;
  front_shiny?: string;
  front_shiny_female?: string;
}

interface PokemonType {
  slot: number;
  type: TypeEntry;
}

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: BaseEntry;
}

export interface IndividualPokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  sprites: PokemonSprite;
  types: PokemonType[];
  stats: PokemonStat[];
}
