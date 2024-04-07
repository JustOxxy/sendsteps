import { Card, CardBody, CardFooter, CardHeader, Divider, Image, useDisclosure } from '@nextui-org/react';
import { IndividualPokemon } from '../types/IndividualPokemon';
import { PokemonDetailsModal } from './PokemonDetailsModal';
import { dedupArray } from '../utils/dedupArray';

interface PokemonCardProps {
  pokemon: IndividualPokemon;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { name, weight, id, sprites, abilities, types } = pokemon;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const abilitiesArray = dedupArray(abilities.map((ability) => ability.ability.name));

  return (
    <>
      <Card
        className="w-fit shrink-0 grow-0 basis-1/3 bg-gradient-to-tr from-pink-500 to-yellow-500 py-4 sm:basis-full"
        onClick={onOpen}
        isPressable
      >
        <div className="mx-4 w-72 rounded-large bg-white">
          <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
            <p className="text-tiny font-bold uppercase">ID: {id}</p>
            <h4 className="text-large font-bold">Name: {name}</h4>
            <small className="text-default-500">Weight: {weight}</small>
          </CardHeader>
          <CardBody className="items-center overflow-visible px-4 py-2">
            <Image src={sprites.front_default} className="size-24" />
          </CardBody>
          <CardFooter className="px-4">
            <div className="w-full">
              <div className="flex gap-1 text-xs">
                Abilities:
                <div className="flex flex-wrap items-center gap-2">
                  {abilitiesArray.map((ability) => (
                    <span key={ability}>{ability}</span>
                  ))}
                </div>
              </div>
              <Divider className="my-2" />
              <div className="flex gap-1 text-xs">
                Types:
                <div className="flex flex-wrap items-center gap-2">
                  {types.map((item) => (
                    <span key={item.type.name}>{item.type.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>
      <PokemonDetailsModal isOpen={isOpen} pokemon={pokemon} onOpenChange={onOpenChange} />
    </>
  );
};
