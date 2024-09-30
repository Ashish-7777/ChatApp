import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error('Error during submission:', error);
    }
  }

  return (
    <div className="relative h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full border border-gray-200">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                value={username}
                onChange={ev => setUsername(ev.target.value)}
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <input
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
            </button>
            <div className="text-center mt-6">
              {isLoginOrRegister === 'register' ? (
                <div>
                  Already a member?{' '}
                  <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => setIsLoginOrRegister('login')}
                  >
                    Login here
                  </button>
                </div>
              ) : (
                <div>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => setIsLoginOrRegister('register')}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
