const API_BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('bds_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Erreur HTTP ${response.status}`);
  }

  return data;
}

const Auth = {
  async register(userData) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(identifier, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    localStorage.setItem('bds_token', data.token);
    localStorage.setItem('bds_user', JSON.stringify(data.user));
    return data;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
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
  },

  async updateProfile(updates) {
    const data = await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    localStorage.setItem('bds_user', JSON.stringify(data.user));
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    return request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },

  async requestPasswordReset(email) {
    return request('/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(resetToken, newPassword) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ reset_token: resetToken, new_password: newPassword }),
    });
  },
};

const Products = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return request(`/products${params ? `?${params}` : ''}`);
  },

  async getById(id) {
    return request(`/products/${id}`);
  },
};

const Cart = {
  async get() {
    return request('/cart');
  },

  async add(productId, quantity = 1, size = '', color = '') {
    return request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity, size, color }),
    });
  },

  async update(productId, quantity, size = '', color = '') {
    return request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity, size, color }),
    });
  },

  async remove(productId, size = '', color = '') {
    return request(`/cart/${productId}`, {
      method: 'DELETE',
      body: JSON.stringify({ size, color }),
    });
  },
};

const Orders = {
  async create(paymentStatus = 'pending') {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify({ payment_status: paymentStatus }),
    });
  },

  async getMy() {
    return request('/orders/myorders');
  },
};

const Contact = {
  async send({ name, email, message }) {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
    });
  },
};

export { Auth, Products, Cart, Orders, Contact };
