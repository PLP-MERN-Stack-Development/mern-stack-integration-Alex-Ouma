import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import PostList from './pages/PostList';
import SinglePost from './pages/SinglePost';
import PostForm from './pages/PostForm';
import Login from './pages/Login';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/edit/:id" element={<PostForm />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;