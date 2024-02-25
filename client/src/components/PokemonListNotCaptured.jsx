import React, { useState, useEffect } from "react";
import PokemonTable from "./PokemonTable";
import SearchBar from "./SearchBar";
import axios from "axios";
import Loading from "./Loading";
import { apiUrl } from "../apiUrl.js";

const PokemonListNotCaptured = ({ authToken, onPokemonAdded }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]); // State to hold filtered pokemon
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPokemon = async () => {
      // Check if each Pokemon is captured by the user and set its 'selected' property accordingly
      const capturedPokemon = await fetchCapturedPokemon();

      try {
        let allPokemon = [];
        let offset = 0;
        let limit = 100; // Adjust the limit as needed
        let response = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/?offset=${offset}&limit=${limit}`
        );
        let data = await response.json();
        let speciesData = data.results;

        while (speciesData.length > 0) {
          const pokemonDetails = await Promise.all(
            speciesData.map(async (species) => {
              const speciesResponse = await fetch(species.url);
              const speciesData = await speciesResponse.json();
              const pokedexNumber = speciesData.id;
              const pokemonName = speciesData.name;

              let pokemonForms = [];
              if (speciesData.varieties) {
                pokemonForms = await Promise.all(
                  speciesData.varieties.map(async (form) => {
                    const formResponse = await fetch(form.pokemon.url);
                    const formData = await formResponse.json();
                    if(!capturedPokemon.hasOwnProperty(formData.name)){
                    return {
                      name: formData.name,
                      pokedexNumber: pokedexNumber,
                      sprite: formData.sprites.front_default,
                      bulbapedia: `https://bulbapedia.bulbagarden.net/wiki/${formData.name}`,
                      selected: false,
                    };} else {
                      return null;
                    }
                  })
                );
              }
              // Filter out null values
          const filteredPokemonForms = pokemonForms.filter(form => form !== null);

          return filteredPokemonForms;
              //return pokemonForms;
            })
          );

          allPokemon = allPokemon.concat(...pokemonDetails);
          offset += limit;
          response = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/?offset=${offset}&limit=${limit}`
          );
          data = await response.json();
          speciesData = data.results;
        }

        // Filter out Mega and Gigantamax forms
        allPokemon = allPokemon.filter(
          (pokemon) =>
            !pokemon.name.toLowerCase().includes("mega") &&
            !pokemon.name.toLowerCase().includes("gmax")
        );
          
        // Filter out Pokemon without a sprite image
        allPokemon = allPokemon.filter((pokemon) => pokemon.sprite);
        setPokemonList(allPokemon);
        setFilteredPokemonList(allPokemon); // Initialize filtered list with all Pokemon
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      }
    };

    fetchPokemon();
  }, []);

  // Function to fetch captured Pokemon from MongoDB
  const fetchCapturedPokemon = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/data/captured-pokemon`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching captured Pokemon:", error);
      return [];
    }
  };

  const handleCheckboxChange = async (index) => {
    const updatedPokemonList = [...pokemonList];
    updatedPokemonList[index].selected = !updatedPokemonList[index].selected;
    // If the checkbox is checked, send the Pokémon name to the backend to update the database
    if (updatedPokemonList[index].selected) {
      const pokemonName = updatedPokemonList[index].name;
      try {
        await axios.post(
          `${apiUrl}/data/add-pokemon`,
          { pokemonName },
          {
            headers: {
              "x-auth-token": authToken,
            },
          }
        );
        // Call the onPokemonAdded function to fetch updated user data
        onPokemonAdded();
      } catch (error) {
        console.error("Error adding Pokemon:", error);
      }
    } else {
      // If the checkbox is unchecked, send a DELETE request to remove the Pokémon name from the backend
      const pokemonName = updatedPokemonList[index].name; // Retrieve the Pokemon name from the updated list
      try {
        await axios.delete(
          `${apiUrl}/data/remove-pokemon/${pokemonName}`,
          {
            headers: {
              "x-auth-token": authToken,
            },
          }
        );
        // Call the onPokemonAdded function to fetch updated user data
        onPokemonAdded();
      } catch (error) {
        console.error("Error removing Pokemon:", error);
      }
    }
    setPokemonList(updatedPokemonList);
  };

  // Function to handle search input change
  const handleSearchInputChange = (searchQuery) => {
    const filteredList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPokemonList(filteredList);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {isLoading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <SearchBar onSearch={handleSearchInputChange} />
          <PokemonTable
            pokemonList={filteredPokemonList}
            handleCheckboxChange={handleCheckboxChange}
          />
        </>
      )}
    </div>
  );
};

export default PokemonListNotCaptured;
