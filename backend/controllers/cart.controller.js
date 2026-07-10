/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Cart controller - handles shopping cart operations and stock management
 */

const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { cart } = require('../locales');

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    // Vérifier que le produit existe
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: cart.productNotFound
      });
    }

    // Vérifier le stock disponible
    const availableStock = await Product.checkStock(product_id);
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = await Cart.getCartItem(userId, product_id);
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;
    
    if (totalQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: cart.insufficientStock,
        available: availableStock
      });
    }

    // Ajouter au panier
    await Cart.addItem(userId, product_id, quantity);

    // Récupérer le panier mis à jour
    const updatedCart = await Cart.getCartByUserId(userId);
    const total = await Cart.calculateTotal(userId);

    res.status(201).json({
      success: true,
      message: cart.itemAddedSuccess,
      cart: updatedCart,
      total
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({
      success: false,
      message: cart.addToCartError
    });
  }
};

// Récupérer le panier de l'utilisateur connecté
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.getCartByUserId(userId);
    const total = await Cart.calculateTotal(userId);
    const itemCount = await Cart.countItems(userId);

    res.json({
      success: true,
      count: itemCount,
      total,
      cart: cartItems
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du panier:', error);
    res.status(500).json({
      success: false,
      message: cart.retrieveCartError
    });
  }
};

// Mettre à jour la quantité d'un produit dans le panier
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Vérifier que l'item existe dans le panier
    const cartItem = await Cart.getCartItem(userId, productId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: cart.itemNotInCart
      });
    }

    // Vérifier le stock disponible
    const availableStock = await Product.checkStock(productId);
    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: cart.insufficientStock,
        available: availableStock
      });
    }

    // Mettre à jour la quantité
    await Cart.updateQuantity(userId, productId, quantity);

    // Récupérer le panier mis à jour
    const updatedCart = await Cart.getCartByUserId(userId);
    const total = await Cart.calculateTotal(userId);

    res.json({
      success: true,
      message: cart.itemUpdatedSuccess,
      cart: updatedCart,
      total
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du panier:', error);
    res.status(500).json({
      success: false,
      message: cart.updateCartError
    });
  }
};

// Retirer un produit du panier
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Vérifier que l'item existe dans le panier
    const cartItem = await Cart.getCartItem(userId, productId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: cart.itemNotInCart
      });
    }

    // Retirer du panier
    await Cart.removeItem(userId, productId);

    // Récupérer le panier mis à jour
    const updatedCart = await Cart.getCartByUserId(userId);
    const total = await Cart.calculateTotal(userId);

    res.json({
      success: true,
      message: cart.itemRemovedSuccess,
      cart: updatedCart,
      total
    });
  } catch (error) {
    console.error('❌ Erreur lors du retrait du panier:', error);
    res.status(500).json({
      success: false,
      message: cart.removeFromCartError
    });
  }
};

// Vider tout le panier
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.clearCart(userId);

    res.json({
      success: true,
      message: cart.cartClearedSuccess
    });
  } catch (error) {
    console.error('❌ Erreur lors du vidage du panier:', error);
    res.status(500).json({
      success: false,
      message: cart.clearCartError
    });
  }
};
