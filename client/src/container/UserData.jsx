import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PokemonList from '../components/PokemonList';
import NavBar from '../components/NavBar';
import { apiUrl } from "../apiUrl.js";

const UserData = ({ authToken, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();


  // Fetch user-specific data using authToken
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/data`, {
        headers: {
          'x-auth-token': `${authToken}`
        }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  /*useEffect(() => {
    fetchData();
  }, [authToken]);*/

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [authToken, navigate]);

  // Function to update user data with the newly added Pokémon
  const handlePokemonAdded = async () => {
    // Fetch user data again when a Pokémon is added
    fetchData();
  };

  return (
    <div>
      <NavBar authToken={authToken} onLogout={onLogout}/>
      <PokemonList authToken={authToken} onPokemonAdded={handlePokemonAdded}/>
    </div>
  );
};

export default UserData;
