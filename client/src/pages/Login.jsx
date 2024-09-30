import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

function Login() {
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation
  const [isSignInOrSignUp, setIsSignInOrSignUp] = useState(location.pathname.split("/")[1]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserInfo } = useContext(UserContext);

  // Handle form submission
  async function post(ev) {
    ev.preventDefault();

    const body = isSignInOrSignUp === "signUp"
      ? JSON.stringify({ username, email, password })
      : JSON.stringify({ email, password });

    const res = await fetch(`http://localhost:3500${location.pathname}`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (res.ok) {
      const userInfo = await res.json();

      if (isSignInOrSignUp === "signIn") {
        setUserInfo(userInfo); // Set user info only for sign-in
        navigate('/'); // Redirect to home on sign-in
      } else {
        // If signing up, just redirect to sign-in
        setUserInfo(null); // Clear user info if signing up
        navigate('/signIn');
      }
    } else if (res.status === 400) {
      alert('Incorrect Password or Email');
    } else {
      alert('Something went wrong, please try again');
    }
  }

  // Update the state when the pathname changes
  useEffect(() => {
    setIsSignInOrSignUp(location.pathname.split("/")[1]);
    // Reset fields for each render
    setUsername('');
    setEmail('');
    setPassword('');
  }, [location]);

  return (
    <div className="mt-20 min-h-screen">
      <div className="flex p-3 max-w-3xl mx-auto gap-5 flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-4xl font-bold">
            <span className="px-2 py-1 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 enabled:hover:bg-gradient-to-bl focus:ring-pink-200 border-0 rounded-lg focus:ring-2 text-white">
              My
            </span>
            <span> Blog</span>
          </h1>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={post}>
            {isSignInOrSignUp === "signUp" && (
              <div>
                <label className="text-sm font-medium text-gray-900">Your username</label>
                <input
                  className="block w-full border bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                  type="text"
                  id="username"
                  value={username}
                  onChange={ev => setUsername(ev.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-900">Your email</label>
              <input
                className="block w-full border bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                type="email"
                id="email"
                placeholder="name123@gmail.com"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Your password</label>
              <input
                className="block w-full border bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-br from-pink-500 to-orange-400 enabled:hover:bg-gradient-to-bl focus:ring-pink-200 border-0 rounded-lg focus:ring-2"
            >
              <span className="flex items-center transition-all duration-200 rounded-md text-sm px-4 py-2">
                {isSignInOrSignUp === "signIn" ? "Sign In" : "Sign Up"}
              </span>
            </button>
          </form>
          <div className="flex gap-2 mt-5 text-sm">
            {isSignInOrSignUp === "signIn" && (
              <>
                <span>Don't have an account?</span>
                <Link to="/signUp" className="text-blue-400">Sign up</Link>
              </>
            )}
            {isSignInOrSignUp === "signUp" && (
              <>
                <span>Have an account?</span>
                <Link to="/signIn" className="text-blue-400">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
