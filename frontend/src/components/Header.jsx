import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Auth } from '../services/apiClient';

export default function Header() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(Auth.getCurrentUser());
  }, [location]);

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <img src="images/logo-bdsbusiness.png" alt="BDS BUSINESS Logo" className="logo-img" />
            <span className="logo-text">BDS BUSINESS</span>
          </Link>
        </div>

        <div className="search-bar">
          <input type="text" id="searchInput" placeholder="Rechercher des produits..." />
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="header-actions">
          {user ? (
            <>
              <Link to="/profile" className="account" title="Mon compte">
                <i className="fas fa-user"></i>
              </Link>
              <Link to="/orders" className="account" title="Mes commandes">
                <i className="fas fa-shopping-bag"></i>
              </Link>
              <Link to="/logout" className="account" title="Déconnexion">
                <i className="fas fa-sign-out-alt"></i>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="account" title="Se connecter">
                <i className="fas fa-sign-in-alt"></i>
              </Link>
              <Link to="/register" className="account" title="S'inscrire">
                <i className="fas fa-user-plus"></i>
              </Link>
            </>
          )}
          <Link to="/cart" className="cart" title="Panier">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
