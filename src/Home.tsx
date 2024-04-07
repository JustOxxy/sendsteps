import { Input, Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { PokemonList } from './components/PokemonList';
import { useQuery } from './hooks/useQuery';
import { BaseEntry } from './types/BaseEntry';

export const Home = () => {
  const [value, setValue] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState('all');
  const { data, isLoading } = useQuery<{ count: number; results: BaseEntry[] | undefined }>('type');

  return (
    <main>
      <div className="flex w-full items-center justify-center gap-3 bg-gradient-to-tr from-pink-500 to-yellow-500 px-8 py-8 text-white shadow-lg">
        <Input
          value={value}
          onValueChange={setValue}
          label="Search"
          radius="lg"
          className="min-w-32"
          classNames={{
            label: 'text-black/50 dark:text-white/90',
            input: [
              'bg-transparent',
              'text-black/90 dark:text-white/90',
              'placeholder:text-default-700/50 dark:placeholder:text-white/60',
            ],
            innerWrapper: 'bg-transparent',
            inputWrapper: [
              'shadow-xl',
              'bg-default-200/50',
              'dark:bg-default/60',
              'backdrop-blur-xl',
              'backdrop-saturate-200',
              'hover:bg-default-200/70',
              'dark:hover:bg-default/70',
              'group-data-[focused=true]:bg-default-200/50',
              'dark:group-data-[focused=true]:bg-default/60',
              '!cursor-text',
            ],
          }}
          placeholder="Type to search Pokemon by ID or name..."
          startContent={<FaSearch color="#555555" />}
        />

        <Select
          label="Filter by type"
          className="min-w-32 max-w-36"
          color="warning"
          isLoading={isLoading}
          items={data?.results ? [{ name: 'all' }, ...data.results] : [{ name: 'all' }]}
          selectedKeys={[selectedFilterType]}
          onChange={(e) => setSelectedFilterType(e.target.value)}
        >
          {(item) => <SelectItem key={item.name}>{item.name}</SelectItem>}
        </Select>
      </div>

      <PokemonList search={value} selectedPokemonType={selectedFilterType} />
    </main>
  );
};
