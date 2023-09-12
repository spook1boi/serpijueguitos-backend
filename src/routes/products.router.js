const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductsManager'); 

const productsManager = new ProductManager();
productsManager.loadProductsFromFile('products.json');

router.get('/', async (req, res) => {
  try {
    let limit = req.query.limit;
    if (limit) {
      limit = parseInt(limit);
      if (isNaN(limit)) {
        return res.status(400).json({ error: 'The parameter "limit" must be a valid number' });
      }
    }

    const products = await productsManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error obtaining the products' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'The parameter "pid" must be a valid number' });
    }

    const product = await productsManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error obtaining the product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productsManager.addProduct(productData);

    if (newProduct) {
      res.status(201).json(newProduct);
    } else {
      res.status(400).json({ error: 'Product could not be added' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'The parameter "pid" must be a valid number' });
    }

    const updatedData = req.body;
    const updatedProduct = await productsManager.updateProduct(productId, updatedData);

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'The parameter "pid" must be a valid number' });
    }

    const deleted = await productsManager.deleteProduct(productId);

    if (deleted) {
      res.json({ message: 'Product successfully removed' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

module.exports = router;