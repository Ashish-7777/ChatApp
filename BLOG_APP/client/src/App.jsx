import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout'
import Home from './pages/Home';
import About from './pages/About'
import Login from './pages/Login'
import {UserContextProvider} from './components/UserContext'
import CreatePost from './components/CreatePost';
import Posts from './pages/Posts';
import PostPage from './components/OtherUser';
import EditPost from './components/EditPost';
import UserPosts from './components/UserPosts';

const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='signIn' element={<Login />} />
        <Route path='signUp' element={<Login />} />
        <Route path='CreatePost' element={<CreatePost />} />
        <Route path='posts' element={<Posts />} />
        <Route path='post/:id' element={<PostPage />} />
        <Route path='edit/:id' element={<EditPost />} />
        <Route path='UserPosts' element={<UserPosts />} />
      </Route>
  )
)

function App() {

  return (
    <UserContextProvider >
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}

export default App
