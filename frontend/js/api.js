// Configuration de l'API
const API_BASE_URL = 'http://localhost:3000/api';

// Fonction utilitaire pour les appels API
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('bds_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur API');
    }
    
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

// Fonctions d'authentification
const Auth = {
  async register(userData) {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return data;
  }, 

  async login(identifier, password) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    localStorage.setItem('bds_token', data.token);
    localStorage.setItem('bds_user', JSON.stringify(data.user));
    return data;
  },

  async logout() {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('bds_token');
      localStorage.removeItem('bds_user');
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem('bds_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('bds_token');
  }
};




// Fonctions produits
const Products = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await apiCall(`/products${params ? '?' + params : ''}`);
  },

  async getById(id) {
    return await apiCall(`/products/${id}`);
  }
};

// Fonctions panier
const Cart = {
  async get() {
    return await apiCall('/cart');
  },

  async add(productId, quantity = 1) {
    return await apiCall('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  async update(productId, quantity) {
    return await apiCall(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  async remove(productId) {
    return await apiCall(`/cart/${productId}`, { method: 'DELETE' });
  }
};

// Fonctions commandes
const Orders = {
  async create(paymentStatus = 'pending') {
    return await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify({ payment_status: paymentStatus }),
    });
  },

  async getMy() {
    return await apiCall('/orders/myorders');
  }
};
window.Auth = Auth;
window.Products = Products;
window.Cart = Cart;
window.Orders = Orders;

console.log('✅ API Services chargés:', {
  Auth: !!window.Auth,
  Products: !!window.Products,
  Cart: !!window.Cart,
  Orders: !!window.Orders
});