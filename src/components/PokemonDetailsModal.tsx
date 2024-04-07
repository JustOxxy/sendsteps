import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Image } from '@nextui-org/react';
import { IndividualPokemon } from '../types/IndividualPokemon';

interface PokemonDetailsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  pokemon: IndividualPokemon;
}

export const PokemonDetailsModal: React.FC<PokemonDetailsModalProps> = ({ isOpen, onOpenChange, pokemon }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ header: 'border-b border-[#e4e6ed]', footer: 'border-t border-[#e4e6ed]' }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Details of {pokemon?.name}</ModalHeader>
            <ModalBody>
              <div className="flex gap-3">
                <div className="flex flex-col justify-center">
                  <Image src={pokemon.sprites.back_default} className="size-24" />
                  <Image src={pokemon.sprites.front_default} className="size-24" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <p>Height: {pokemon.height}</p>
                    <p>Weight: {pokemon.weight}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Stats:</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {pokemon.stats.map((stat) => (
                        <div key={stat.stat.name} className="text-xs">
                          <div>
                            <span className="text-foreground-500">Name: </span>
                            <span>{stat.stat.name}</span>
                          </div>
                          <div>
                            <span className="text-foreground-500">Base stat: </span>
                            <span>{stat.base_stat}</span>
                          </div>
                          <div>
                            <span className="text-foreground-500">Effort: </span>
                            <span>{stat.effort}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="warning" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
