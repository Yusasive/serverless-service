import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserController } from '../controllers/UserController';

export default function Logout() {
  useEffect(() => {
    const userController = UserController.getInstance();
    userController.logout();
  }, []);

  return <Navigate to="/login" replace />;
} 