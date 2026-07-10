/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Product controller - handles product CRUD operations, search and filtering
 */

const Product = require('../models/product.model');
const { product } = require('../locales');

// Créer un nouveau produit (Admin/SuperAdmin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, discount_percent, stock, image_url, gender } = req.body;

    const productId = await Product.create({
      name,
      description,
      category,
      price,
      discount_percent,
      stock,
      image_url,
      gender
    });

    const newProduct = await Product.findById(productId);

    res.status(201).json({
      success: true,
      message: product.productCreatedSuccess,
      product: newProduct
    });
  } catch (error) {
    console.error(product.logCreateError, error);
    res.status(500).json({
      success: false,
      message: product.createProductError
    });
  }
};

// Récupérer tous les produits (Public)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, gender, search, page, limit } = req.query;

    let products;

    // Recherche par mot-clé
    if (search) {
      products = await Product.search(search);
      
      // Si aucun résultat trouvé pour la recherche
      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: product.productNotFound
        });
      }
    }
    // Filtrer par catégorie ET genre
    else if (category && gender) {
      products = await Product.findByCategoryAndGender(category, gender);
    }
    // Filtrer par catégorie
    else if (category) {
      products = await Product.findByCategory(category);
    }
    // Filtrer par genre
    else if (gender) {
      products = await Product.findByGender(gender);
    }
    // Pagination
    else if (page && limit) {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      products = await Product.findWithPagination(parseInt(limit), offset);
    }
    // Tous les produits
    else {
      products = await Product.findAll();
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error(product.logRetrieveError, error);
    res.status(500).json({
      success: false,
      message: product.retrieveProductsError
    });
  }
};

// Récupérer un produit par ID (Public)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);

    if (!foundProduct) {
      return res.status(404).json({
        success: false,
        message: product.productNotFound
      });
    }

    res.json({
      success: true,
      product: foundProduct
    });
  } catch (error) {
    console.error(product.logRetrieveError, error);
    res.status(500).json({
      success: false,
      message: product.retrieveProductError
    });
  }
};

// Mettre à jour un produit (Admin/SuperAdmin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, discount_percent, stock, image_url, gender } = req.body;

    // Vérifier que le produit existe
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: product.productNotFound
      });
    }

    const updatedProduct = await Product.update(id, {
      name,
      description,
      category,
      price,
      discount_percent,
      stock,
      image_url,
      gender
    });

    res.json({
      success: true,
      message: product.productUpdatedSuccess,
      product: updatedProduct
    });
  } catch (error) {
    console.error(product.logUpdateError, error);
    res.status(500).json({
      success: false,
      message: product.updateProductError
    });
  }
};

// Supprimer un produit (Admin/SuperAdmin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que le produit existe
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: product.productNotFound
      });
    }

    await Product.delete(id);

    res.json({
      success: true,
      message: product.productDeletedSuccess
    });
  } catch (error) {
    console.error(product.logDeleteError, error);
    res.status(500).json({
      success: false,
      message: product.deleteProductError
    });
  }
};

// Obtenir le nombre total de produits (Admin/SuperAdmin)
exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.count();

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error(product.logRetrieveError, error);
    res.status(500).json({
      success: false,
      message: product.retrieveProductsError
    });
  }
};
