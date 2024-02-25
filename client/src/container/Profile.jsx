import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavBar from '../components/NavBar'
import dProfile from '../assets/dProfile.png';
import { apiUrl } from "../apiUrl.js";

const Profile = ({ authToken, onLogout }) => {
  const [userData, setUserData] = useState(null);

  // Fetch user-specific data using authToken
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/data`, {
        headers: {
          'x-auth-token': authToken,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authToken]);

  return (
    <>
      <NavBar authToken={authToken} onLogout={onLogout}/>
      <div className='px-4 '>
  <div className="px-4 sm:px-0">
    <h3 className="text-base font-semibold leading-7 text-gray-900">Profile</h3>
    <img
                      className="h-10 w-10 rounded-full"
                      src={dProfile}
                      alt=""
                    />
  </div>
  <div className="mt-6 border-t border-gray-100">
    <dl className="divide-y divide-gray-100">
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Captured Pokemon</dt>
        {userData && (<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{Object.keys(userData.capturedPokemon).length}</dd>)}
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Username</dt>
        {userData && (<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userData.username}</dd>)}
      </div>
      
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
        {userData && (<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userData.email}</dd>)}
      </div>
    </dl>
  </div>
</div>
    </>
  )
}

export default Profile
