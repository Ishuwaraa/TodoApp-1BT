import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? <Navigate to="/" replace /> : children;
};

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/login' element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path='/signup' element={
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
