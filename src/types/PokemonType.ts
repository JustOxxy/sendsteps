import { BaseEntry } from './BaseEntry';

export interface Pokemon {
  slot: number;
  pokemon: BaseEntry;
}

export interface PokemonType {
  id: number;
  name: string;
  pokemon: Pokemon[];
}
