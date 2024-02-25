import React from "react";

const PokemonTable = ({ pokemonList, handleCheckboxChange }) => {
  return (
    
    <div className="overflow-x-auto">
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-[#362d5c] text-center">
          <th className="bg-[#8984a4] border-l border-transparent px-3 py-4 text-lg font-medium text-dark lg:px-4 lg:py-7"></th>
          <th className="border-l border-transparent px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
            Pokedex #
          </th>
          <th className="border-l border-transparent px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
            Sprite
          </th>
          <th className="border-l border-transparent px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
            Name
          </th>
          <th className="border-r border-transparent px-3 py-4 text-lg font-medium text-white lg:px-4 lg:py-7">
            Bulbapedia
          </th>
        </tr>
      </thead>
      <tbody>
        {pokemonList.map((pokemon, index) => (
          <tr key={`${pokemon.name}-${index}`} className="text-center">
            <td className="border-l border-[#222224] bg-[#362d5c] px-2 py-5 text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  className="size-4 rounded border-[#222224]"
                  defaultChecked={pokemon.selected}
                  onChange={() => handleCheckboxChange(index)}
                />
              </div>
            </td>
            <td className="border-l border-[#222224] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
              {pokemon.pokedexNumber}
            </td>
            <td className="border-l border-[#222224] bg-[#8984a4] px-2 py-5 flex justify-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
              <img src={pokemon.sprite} alt={pokemon.name} className="max-w-xs mx-auto" />
            </td>
            <td className="border-l border-[#222224] bg-white px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-2 dark:text-dark-7">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </td>
            <td className="border-r border-[#222224] bg-[#8984a4] px-2 py-5 text-center text-base font-medium text-dark dark:border-dark dark:bg-dark-3 dark:text-dark-7">
              <a
                href={pokemon.bulbapedia}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default PokemonTable;
