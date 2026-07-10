/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Product model - handles product data operations and inventory management
 */

const db = require('../../config/db');
const queries = require('../queries').product;

class Product {
  // Créer un nouveau produit
  static async create(productData) {
    const { 
      name, 
      description, 
      category, 
      price, 
      discount_percent = 0, 
      stock = 0, 
      image_url = null, 
      gender = 'unisex' 
    } = productData;
    
    const [result] = await db.query(queries.createProduct, [
      name, description, category, price, discount_percent, stock, image_url, gender
    ]);
    
    return result.insertId;
  }

  // Trouver un produit par ID
  static async findById(id) {
    const [rows] = await db.query(queries.findById, [id]);
    return rows[0];
  }

  // Récupérer tous les produits
  static async findAll() {
    const [rows] = await db.query(queries.findAll);
    return rows;
  }

  // Récupérer les produits par catégorie
  static async findByCategory(category) {
    const [rows] = await db.query(queries.findByCategory, [category]);
    return rows;
  }

  // Récupérer les produits par genre
  static async findByGender(gender) {
    const [rows] = await db.query(queries.findByGender, [gender]);
    return rows;
  }

  // Récupérer les produits par catégorie et genre
  static async findByCategoryAndGender(category, gender) {
    const [rows] = await db.query(queries.findByCategoryAndGender, [category, gender]);
    return rows;
  }

  // Rechercher des produits
  static async search(searchTerm) {
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await db.query(queries.searchProducts, [searchPattern, searchPattern, searchPattern]);
    return rows;
  }

  // Récupérer les produits avec pagination
  static async findWithPagination(limit, offset) {
    const [rows] = await db.query(queries.findWithPagination, [limit, offset]);
    return rows;
  }

  // Mettre à jour un produit
  static async update(id, productData) {
    const { 
      name, 
      description, 
      category, 
      price, 
      discount_percent, 
      stock, 
      image_url, 
      gender 
    } = productData;
    
    await db.query(queries.updateProduct, [
      name, description, category, price, discount_percent, stock, image_url, gender, id
    ]);
    
    return this.findById(id);
  }

  // Mettre à jour le stock d'un produit
  static async updateStock(id, stock) {
    await db.query(queries.updateStock, [stock, id]);
    return this.findById(id);
  }

  // Décrémenter le stock
  static async decrementStock(id, quantity) {
    const [result] = await db.query(queries.decrementStock, [quantity, id, quantity]);
    return result.affectedRows > 0;
  }

  // Incrémenter le stock
  static async incrementStock(id, quantity) {
    await db.query(queries.incrementStock, [quantity, id]);
    return this.findById(id);
  }

  // Vérifier le stock disponible
  static async checkStock(id) {
    const [rows] = await db.query(queries.checkStock, [id]);
    return rows[0]?.stock || 0;
  }

  // Supprimer un produit
  static async delete(id) {
    const [result] = await db.query(queries.deleteProduct, [id]);
    return result.affectedRows > 0;
  }

  // Compter le nombre total de produits
  static async count() {
    const [rows] = await db.query(queries.countProducts);
    return rows[0].total;
  }
}

module.exports = Product;
