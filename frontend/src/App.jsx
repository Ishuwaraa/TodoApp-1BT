import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';

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
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
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
        <Route path='/forgot-password' element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
          } />
        <Route path='/reset-password' element={
          <AuthRoute>
            <ResetPassword />
          </AuthRoute>
        } />
        <Route path="*" element={<NotFound />}/>
      </Routes>

      <Toaster position='top-right'/>
    </BrowserRouter>
  )
}

export default App
