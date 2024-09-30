import React, { useEffect, useState, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null); // To prevent conflict on button click
  const navigate = useNavigate();

  // Fetch user profile on mount
  useEffect(() => {
    fetch('http://localhost:3500/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  // Sign out logic
  function signout() {
    fetch('http://localhost:3500/signout', {
      credentials: 'include',
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          console.log('Successfully signed out.');
          setUserInfo(null);  // Clear user info
          setSignOutVisible(false);
          navigate('/');  // Redirect to home after sign-out
        } else {
          console.error('Failed to sign out.');
        }
      })
      .catch(error => {
        console.error('Error during sign out:', error);
      });
  }

  // Toggle dropdown visibility
  const toggleSignOut = () => {
    setSignOutVisible((prevVisible) => !prevVisible);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
      setSignOutVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const username = userInfo?.username;
  const email = userInfo?.email;

  return (
    <>
      <header className="flex justify-between items-center m-4 shadow-lg border border-red-400 rounded-lg">
        <div className="p-4 text-xl">
          <span className="text-red-400 bg-gray-100 p-1">My</span>
          <span className="text-white px-2 py-1 bg-gradient-to-br from-pink-500 to-orange-400 rounded-r-lg">Blog</span>
        </div>
        <div className="flex justify-center items-center gap-7 p-4">
          <NavLink to={''} className={({ isActive }) => isActive ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white p-3 rounded' : 'text-red-400 p-3'}>
            Home
          </NavLink>
          <NavLink to={'/about'} className={({ isActive }) => isActive ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white p-3 rounded' : 'text-red-400 p-3'}>
            About
          </NavLink>
        </div>
        {username && (
          <div className="flex justify-center items-center gap-7 p-4">
            <NavLink to={'/posts'} className={({ isActive }) => isActive ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white p-3 rounded' : 'text-red-400 p-3'}>
              Posts
            </NavLink>
            <NavLink to={'/CreatePost'} className={({ isActive }) => isActive ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white p-3 rounded' : 'text-red-400 p-3'}>
              Create new post
            </NavLink>
            <button
              ref={buttonRef}
              onClick={toggleSignOut}
              className='font-black text-3xl bg-gradient-to-br from-pink-500 to-orange-400 text-white p-2 px-4 rounded-full shadow-lg'
            >
              {username.charAt(0).toUpperCase()}
            </button>
          </div>)}
        {!username && (
          <div className="flex justify-center items-center gap-7 p-4">
            <NavLink to={'/signIn'} className={({ isActive }) => isActive ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white p-3 rounded' : 'text-red-400 p-3'}>
              Sign in
            </NavLink>
            <NavLink to={'/signUp'} className='bg-gradient-to-br from-pink-500 to-orange-400 text-white p-3 rounded shadow-lg'>
              Sign up
            </NavLink>
          </div>)}
      </header>
      {signOutVisible && (
        <div
          ref={dropdownRef}
          className="z-10 w-fit rounded divide-y divide-gray-100 shadow border border-gray-200 bg-white text-gray-900"
          style={{
            position: 'absolute',
            right: '30px',
            top: '90px',
            minWidth: '150px',
          }}
        >
          <ul className="py-1">
            <div className="block py-2 px-4 text-sm text-gray-700">
              <span className="block text-sm">{username}</span>
              <span className="block truncate text-sm font-medium">{email}</span>
            </div>
            <div className="my-1 h-px bg-gray-100"></div>
            <li role="menuitem">
              <NavLink 
                to={'/UserPosts'}
                className="flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white" 
                tabIndex="-1"
              >
                Your Posts
              </NavLink>
            </li>
            <div className="my-1 h-px bg-gray-100"></div>
            <li role="menuitem">
              <button
                type="button"
                className="flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={signout}
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Header;
