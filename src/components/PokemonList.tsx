import { Card, CardBody, CardHeader, Pagination, Spinner } from '@nextui-org/react';

import { usePokemonsList } from '../hooks/usePokemonsList';

import { ErrorComponent } from './Error';
import { PokemonCard } from './PokemonCard';

interface PokemonListProps {
  search: string;
  selectedPokemonType: string | 'all';
}

const ITEMS_PER_PAGE = 9;

export const PokemonList: React.FC<PokemonListProps> = ({ selectedPokemonType, search }) => {
  const { pokemons, isLoading, isError, paginationTotal, page, setPage } = usePokemonsList({
    searchTerm: search,
    typeFilter: selectedPokemonType,
    pageLimit: ITEMS_PER_PAGE,
  });

  if (isError) {
    return <ErrorComponent />;
  }

  if (isLoading) {
    return (
      <div className="mt-24 flex justify-center">
        <Spinner color="warning" />
      </div>
    );
  }

  if (!isError && !isLoading && pokemons?.length === 0) {
    return (
      <Card className="m-8">
        <CardHeader>
          <h5 className="text-lg">Noting found</h5>
        </CardHeader>
        <CardBody>We could not find any pokemons :(</CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="m-8 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-8">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {pokemons?.length > 1 && (
        <Pagination
          color="warning"
          showControls
          total={paginationTotal}
          page={page + 1}
          onChange={(page) => setPage(page - 1)}
        />
      )}
    </div>
  );
};
