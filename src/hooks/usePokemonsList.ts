import { useEffect, useMemo, useState } from 'react';

import { IndividualPokemon } from '../types/IndividualPokemon';
import { BaseEntry } from '../types/BaseEntry';

import { useQuery } from './useQuery';
import { cachedFetch } from '../utils/cachedFetch';

interface Params {
  searchTerm: string;
  typeFilter: 'all' | string;
  pageLimit: number;
}

export const usePokemonsList = ({ searchTerm, typeFilter, pageLimit }: Params) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [page, setPage] = useState(0);

  const [pokemonsList, setPokemonsList] = useState<IndividualPokemon[]>([]);

  const [filteredPokemonsData, setFilteredPokemonsData] = useState<{ pokemon: BaseEntry }[]>([]);

  const paginationData = useMemo(
    () => ({
      limit: pageLimit,
      offset: pageLimit * page,
    }),
    [pageLimit, page],
  );

  const { data: pokemonTypes } = useQuery<{ count: number; results: BaseEntry[] | undefined }>('type');

  /* Fetching base pokemon data by given `typeFilter` (every pokemon with fitting type) */
  useEffect(() => {
    const fetchPokemonsByType = async () => {
      setIsLoading(true);

      const typeUrl = pokemonTypes?.results?.find((item) => item.name === typeFilter)?.url;

      if (typeUrl) {
        const typeInfo = await cachedFetch<{ pokemon: { pokemon: BaseEntry }[] }>(typeUrl);
        setFilteredPokemonsData(typeInfo.pokemon);
      }
    };

    if (typeFilter === 'all') return;

    fetchPokemonsByType();
  }, [typeFilter, pokemonTypes]);

  const {
    data: allPokemonsData,
    isLoading: allPokemonsLoading,
    isError: allPokemonsError,
  } = useQuery<{ count: number; results: BaseEntry[] }>(
    'pokemon',
    paginationData,
    typeFilter !== 'all' || searchTerm !== '',
  );

  /* Get entire pokemons list or filtered by `typeFilter` list */
  useEffect(() => {
    const fetchPokemons = async () => {
      if (typeFilter === 'all') {
        if (!allPokemonsData) return;

        const promises = allPokemonsData.results.map((p) => cachedFetch(p.url));

        try {
          const pokemonsData = (await Promise.all(promises)) as IndividualPokemon[];
          setPokemonsList(pokemonsData);
          setIsLoading(false);
          setIsError(false);
        } catch {
          setIsError(true);
        }
      } else {
        if (!filteredPokemonsData || filteredPokemonsData.length === 0) return;

        const start = page * pageLimit;

        const promises = filteredPokemonsData
          .slice(start, start + pageLimit)
          .map((p) => cachedFetch<IndividualPokemon>(p.pokemon.url));

        try {
          const pokemonsData = await Promise.all(promises);

          setPokemonsList(pokemonsData);
          setIsLoading(false);
          setIsError(false);
        } catch {
          setIsError(true);
        }
      }
    };

    if (searchTerm !== '') return;

    setIsLoading(true);
    fetchPokemons();
  }, [allPokemonsData, filteredPokemonsData, typeFilter, searchTerm, pageLimit, page, isLoading]);

  /* Search pokemon by `searchTerm` only */
  const {
    data: searchedPokemon,
    isLoading: isSearchedPokemonLoading,
    isError: isSearchedPokemonError,
  } = useQuery<IndividualPokemon>(`pokemon/${searchTerm}`, undefined, typeFilter !== 'all' || !searchTerm);

  useEffect(() => {
    if (searchedPokemon) {
      setPokemonsList([searchedPokemon]);
    }
  }, [searchedPokemon]);

  // when both `searchTerm` and `typeFilter` provided
  useEffect(() => {
    if (searchTerm && typeFilter !== 'all') {
      const item = filteredPokemonsData.find((data) => {
        const foundByName = data.pokemon.name === searchTerm;
        const id = data.pokemon.url.split('pokemon/')[1]?.split('/')[0];
        const foundById = id === searchTerm;

        return foundById || foundByName;
      });

      if (item) {
        const fetchPokemon = async () => {
          const pokemonData = await fetch(item.pokemon.url).then((response) => response.json());
          setPokemonsList([pokemonData]);
          setIsLoading(false);
          setIsError(false);
        };

        fetchPokemon();
      } else {
        setPokemonsList([]);
        setIsLoading(false);
      }
    }
  }, [searchTerm, typeFilter, filteredPokemonsData]);

  const paginationTotal = useMemo(() => {
    if (searchTerm) {
      return Math.ceil(pokemonsList.length / pageLimit);
    }

    if (typeFilter !== 'all') {
      return Math.ceil(filteredPokemonsData.length / pageLimit);
    }

    if (allPokemonsData) {
      return Math.ceil(allPokemonsData.count / pageLimit);
    }

    return 0;
  }, [pokemonsList, searchTerm, typeFilter, allPokemonsData, filteredPokemonsData, pageLimit]);

  return {
    isLoading: isLoading || allPokemonsLoading || isSearchedPokemonLoading,
    isError: isError || allPokemonsError || isSearchedPokemonError,
    pokemons: pokemonsList,
    paginationTotal,
    page,
    setPage,
  };
};
