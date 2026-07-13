/**
 * BDS E-commerce API Client
 * Version: 1.0.0
 * Description: Client JavaScript pour l'intégration avec le backend BDS
 */

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  return !payload || !payload.exp || payload.exp * 1000 < Date.now();
}

// Pas de build ES module (fichier chargé tel quel) : impossible de lire
// import.meta.env.VITE_API_BASE_URL directement. On lit plutôt window.__API_BASE_URL__,
// généré à partir de la même variable par le plugin Vite (voir vite.config.js) dans
// js/config.js, chargé avant ce fichier. Si config.js est absent (page ouverte sans
// build), on retombe sur le port 3000 du même hôte (cas du développement local).
const DEFAULT_API_BASE_URL = window.__API_BASE_URL__
  || `${window.location.protocol}//${window.location.hostname}:3000/api`;

class BDSApiClient {
  constructor(baseURL = DEFAULT_API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('bds_token');
    this.user = JSON.parse(localStorage.getItem('bds_user') || 'null');

    if (this.token && isTokenExpired(this.token)) {
      this.clearAuth();
    }
  }

  // ==================== UTILITAIRES ====================
  
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Session expirée/invalide (et pas juste "mauvais identifiants" au login)
        if (response.status === 401 && this.token && endpoint !== '/auth/login') {
          this.clearAuth();
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
        }
        throw new Error(data.message || `Erreur HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur API:', error.message);
      throw error;
    }
  }

  saveAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('bds_token', token);
    localStorage.setItem('bds_user', JSON.stringify(user));
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('bds_token');
    localStorage.removeItem('bds_user');
  }

  // ==================== AUTHENTIFICATION ====================
  
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  async login(identifier, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    
    if (response.success && response.token) {
      this.saveAuth(response.token, response.user);
    }
    
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(updates) {
    const response = await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (response.success && response.user) {
      this.user = response.user;
      localStorage.setItem('bds_user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  async requestPasswordReset(email) {
    return this.request('/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(resetToken, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        reset_token: resetToken,
        new_password: newPassword,
      }),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearAuth();
    }
  }

  isAuthenticated() {
    if (!this.token) return false;
    if (isTokenExpired(this.token)) {
      this.clearAuth();
      return false;
    }
    return true;
  }

  isAdmin() {
    return this.user && (this.user.role === 'admin' || this.user.role === 'superadmin');
  }

  getCurrentUser() {
    return this.user;
  }

  // ==================== PRODUITS ====================
  
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return this.request(endpoint);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload/image`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erreur HTTP ${response.status}`);
    }

    return data;
  }

  async updateProduct(id, updates) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== PANIER ====================
  
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // ==================== COMMANDES ====================
  
  async createOrder(paymentStatus = 'pending') {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ payment_status: paymentStatus }),
    });
  }

  async getMyOrders() {
    return this.request('/orders/myorders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  async getAllOrders() {
    return this.request('/orders');
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ payment_status: status }),
    });
  }

  // ==================== UTILISATEURS (Admin) ====================
  
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, updates) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdmins() {
    return this.request('/users/admins');
  }
}

// ==================== HELPERS ====================

function handleApiError(error, elementId = 'error-message') {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = error.message;
    errorElement.style.display = 'block';
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
}

function showSuccessMessage(message, elementId = 'success-message') {
  const successElement = document.getElementById(elementId);
  if (successElement) {
    successElement.textContent = message;
    successElement.style.display = 'block';
    setTimeout(() => {
      successElement.style.display = 'none';
    }, 3000);
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price);
}

function calculateDiscountedPrice(price, discountPercent) {
  return price - (price * discountPercent / 100);
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BDSApiClient, handleApiError, showSuccessMessage, formatPrice, calculateDiscountedPrice };
}