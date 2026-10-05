import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Layout;