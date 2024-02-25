import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import logo from "../assets/living-dex-master.png";
import dProfile from "../assets/dProfile.png";
import { apiUrl } from "../apiUrl.js";

const NavBar = ({ authToken, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      await axios.post(`${apiUrl}/auth/logout`);
      onLogout(); // Call the onLogout function passed as a prop
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Fetch user-specific data using authToken
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/data`, {
        headers: {
          "x-auth-token": authToken,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authToken]);

  return (
    <>
      <div className="min-h-full">
        <nav className="bg-[#362d5c]">
          {/* Your navigation content */}
          {/* Your navigation content */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <NavLink to="/home">
                    <img className="h-8 w-8" src={logo} alt="Your Company" />
                  </NavLink>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <NavLink
                      to="/home"
                      className={`${
                        location.pathname === "/home"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } rounded-md px-3 py-2 text-sm font-medium`}
                      aria-current={
                        location.pathname === "/home" ? "page" : undefined
                      }
                    >
                      Full Dex
                    </NavLink>
                    <NavLink
                      to="/home/captured"
                      className={`${
                        location.pathname === "/home/captured"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } rounded-md px-3 py-2 text-sm font-medium`}
                      aria-current={
                        location.pathname === "/home/captured"
                          ? "page"
                          : undefined
                      }
                    >
                      Captured
                    </NavLink>
                    <NavLink
                      to="/home/not-captured"
                      className={`${
                        location.pathname === "/home/not-captured"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } rounded-md px-3 py-2 text-sm font-medium`}
                      aria-current={
                        location.pathname === "/home/not-captured"
                          ? "page"
                          : undefined
                      }
                    >
                      Not Captured
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}
                  <div className="relative ml-3">
                    <div>
                      <button
                        type="button"
                        className="relative flex max-w-xs items-center rounded-full bg-[#362d5c] text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        onClick={toggleDropdown}
                        id="user-menu-button"
                        aria-expanded={dropdownOpen}
                        aria-haspopup="true"
                      >
                        <span className="absolute -inset-1.5"></span>
                        <span className="sr-only">Open user menu</span>
                        <a href="/home">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={dProfile}
                            alt=""
                          />
                        </a>
                      </button>
                    </div>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                      <div
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        tabIndex="-1"
                      >
                        <NavLink to="/profile">
                          <div
                            className="block px-4 py-2 text-sm text-gray-700"
                            role="menuitem"
                            tabIndex="-1"
                            id="user-menu-item-0"
                          >
                            Profile
                          </div>
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700"
                          role="menuitem"
                          tabIndex="-1"
                          id="user-menu-item-2"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-md bg-[#362d5c] p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={toggleMobileMenu}
                  aria-controls="mobile-menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <span className="absolute -inset-0.5"></span>
                  <span className="sr-only">Open main menu</span>
                  {/* Menu open: "hidden", Menu closed: "block" */}
                  <svg
                    className={`block h-6 w-6 ${
                      mobileMenuOpen ? "hidden" : "block"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                  {/* Menu open: "block", Menu closed: "hidden" */}
                  <svg
                    className={`h-6 w-6 ${mobileMenuOpen ? "block" : "hidden"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden" id="mobile-menu">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                <NavLink
                  to="/home"
                  className={`${
                    location.pathname === "/home"
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block rounded-md px-3 py-2 text-base font-medium`}
                >
                  Full Dex
                </NavLink>
                <NavLink
                  to="/home/captured"
                  className={`${
                    location.pathname === "/home/captured"
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block rounded-md px-3 py-2 text-base font-medium`}
                >
                  Captured
                </NavLink>
                <NavLink
                  to="/home/not-captured"
                  className={`${
                    location.pathname === "/home/not-captured"
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block rounded-md px-3 py-2 text-base font-medium`}
                >
                  Not Captured
                </NavLink>
              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={dProfile}
                      alt=""
                    />
                  </div>
                  {userData && (
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {userData.username}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {userData.email}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <NavLink to="/profile">
                    <div className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                      Profile
                    </div>
                  </NavLink>
                  <a
                    onClick={handleLogout}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default NavBar;
