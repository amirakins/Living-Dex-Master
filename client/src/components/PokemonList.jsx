import React, { useState, useEffect } from "react";
import PokemonTable from "./PokemonTable";
import SearchBar from "./SearchBar";
import axios from "axios";
import Loading from "./Loading";
import { apiUrl } from "../apiUrl.js";

const PokemonList = ({ authToken, onPokemonAdded }) => {
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

                    // Determine the Bulbapedia link based on the Pokémon name and its potential alternate forms
                    const basePokemonName = getBasePokemonName(formData.name);

                    return {
                      name: formData.name,
                      pokedexNumber: pokedexNumber,
                      sprite: formData.sprites.front_default,
                      bulbapedia: `https://bulbapedia.bulbagarden.net/wiki/${basePokemonName}`,
                      selected: (capturedPokemon.hasOwnProperty(formData.name)) ? true : false,
                    };
                  })
                );
              }
              return pokemonForms;
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
            !pokemon.name.toLowerCase().includes("gmax") && 
            !pokemon.name.toLowerCase().includes("primal") && 
            !pokemon.name.toLowerCase().includes("totem") && 
            !pokemon.name.toLowerCase().includes("battle-bond") &&
            !pokemon.name.toLowerCase().includes("zen") &&
            !pokemon.name.toLowerCase().includes("blade") && 
            pokemon.name.toLowerCase() != "Eiscue-noice" && 
            pokemon.name.toLowerCase() != "Wishiwashi-school" && 
            pokemon.name.toLowerCase() != "Mimikyu-busted" && 
            pokemon.name.toLowerCase() != "Palafin-hero" && 
            pokemon.name.toLowerCase() != "zygarde-50" //handle minior also zacion shieled missing? && 1017 down
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

  // Function to get the base Pokémon name without alternate forms
  const getBasePokemonName = (pokemonName) => { 
    const altForms = ["-alola", "-galar", "-hisui", "-wash", "-mow", "-heat", "-frost", "-fan", "-m", "-f", "-rock-star", "-belle", "-pop-star", "-phd", "-libre", "-cosplay", "-original-cap", "-hoenn-cap", "-sinnoh-cap", "-unova-cap", "-kalos-cap", "-alola-cap", "-partner-cap", "-paldea-combat-breed", "-paldea-blaze-breed", "-paldea-aqua-breed", "-sunny", "-rainy", "-snowy","-normal", "-attack", "-defense", "-speed", "-plant", "-sandy", "-trash", "-orgin", "-altered", "-land", "-sky", "-red-striped", "-blue-striped", "-white-striped", "-standard", "-incarnate", "-therian", "-black", "-white", "-ordinary", "-resolute", "-aria", "-pirouette", "-ash", "-eternal", "-male", "-female", "-shield", "-average", "-small", "-large", "-super", "-average", "-baile", "-pom-pom", "-pau", "-sensu", "-own-tempo","-midday","-midnight", "-dusk", "-solo", "-dusk", "-dawn", "-ultra", "-original", "-amped", "-low-key", "-full-belly", "-crowned","-eternamax","-single-strike", "-rapid-strike", "-ice", "-shadow", "-bloodmoon","family-of-three","-blue-plumage","-yellow-plumage","-white-plumage","-droopy","-stretchy","-three-segment"];
    let baseName = pokemonName;

    for (const altForm of altForms) {
      if (pokemonName.toLowerCase().endsWith(`${altForm}`)) {
        baseName = pokemonName.split(`${altForm}`)[0];
        break;
      }
    }

    return baseName;
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
export default PokemonList;
