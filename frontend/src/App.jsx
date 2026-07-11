import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CartPage from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Category from './pages/Category';
import Product from './pages/Product';
import Search from './pages/Search';
import Contact from './pages/Contact';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';

function App() {
  useEffect(() => {
    document.title = 'BDS BUSINESS - Votre Boutique en Ligne';
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/search" element={<Search />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
