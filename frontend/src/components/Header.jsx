import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Auth, Cart } from '../services/apiClient';
import logo from '../../images/logo-bdsbusiness.png';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(Auth.getCurrentUser());
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    async function refreshCartCount() {
      if (!Auth.isAuthenticated()) {
        setCartCount(0);
        return;
      }
      try {
        const data = await Cart.get();
        setCartCount(data.count || 0);
      } catch (err) {
        setCartCount(0);
      }
    }

    refreshCartCount();
    window.addEventListener('cart:update', refreshCartCount);
    return () => window.removeEventListener('cart:update', refreshCartCount);
  }, [user]);

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="BDS BUSINESS Logo" className="logo-img" />
            <span className="logo-text">BDS BUSINESS</span>
          </Link>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/category/abayas">Abayas</Link></li>
            <li><Link to="/category/vetements-homme">Vêtements Homme</Link></li>
            <li><Link to="/category/ordinateurs">Ordinateurs</Link></li>
            <li><Link to="/category/montres">Montres</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <form
          className="search-bar"
          onSubmit={(event) => {
            event.preventDefault();
            const query = searchQuery.trim();
            if (query) {
              navigate(`/search?q=${encodeURIComponent(query)}`);
            }
          }}
        >
          <input
            type="text"
            id="searchInput"
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <div className="header-actions">
          {user ? (
            <>
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <>
                  <a href="/admin-products.html" className="account" title="Gérer les produits">
                    <i className="fas fa-plus-circle"></i>
                  </a>
                  <a href="/admin-orders.html" className="account" title="Gérer les commandes">
                    <i className="fas fa-receipt"></i>
                  </a>
                  <a href="/admin-users.html" className="account" title="Gérer les utilisateurs">
                    <i className="fas fa-users-cog"></i>
                  </a>
                </>
              )}
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
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
