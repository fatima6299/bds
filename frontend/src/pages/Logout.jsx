import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../services/apiClient';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function doLogout() {
      await Auth.logout();
      navigate('/login');
    }

    doLogout();
  }, [navigate]);

  return (
    <div className="container">
      <h2>Déconnexion...</h2>
      <p>Vous allez être redirigé vers la page de connexion.</p>
    </div>
  );
}
