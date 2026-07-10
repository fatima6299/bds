// frontend/js/cart.js

class CartService {
  static API_BASE_URL = 'http://localhost:3000/api/cart';

  static async getCart() {
    try {
      const response = await fetch(this.API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bds_token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la récupération du panier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur Cart.getCart:', error);
      throw error;
    }
  }

  static async addToCart(productId, quantity = 1) {
    try {
      const response = await fetch(this.API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bds_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          product_id: productId, 
          quantity: quantity 
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'ajout au panier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur Cart.addToCart:', error);
      throw error;
    }
  }

  static async updateCartItem(productId, quantity) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bds_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du panier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur Cart.updateCartItem:', error);
      throw error;
    }
  }

  static async removeFromCart(productId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bds_token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression du produit');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur Cart.removeFromCart:', error);
      throw error;
    }
  }

  static async clearCart() {
    try {
      const response = await fetch(this.API_BASE_URL, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bds_token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression du panier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur Cart.clearCart:', error);
      throw error;
    }
  }
}

// Pour une utilisation globale
window.Cart = CartService;