const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager');

const cartsManager = new CartManager();
cartsManager.loadCartsFromFile('carts.json');

router.get('/:cid/products', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    if (isNaN(cartId)) {
      return res.status(400).json({ error: 'The parameter "cid" must be a valid number' });
    }

    const cart = await cartsManager.getCartById(cartId);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error getting products from cart' });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ error: 'The parameters "cid" and "pid" must be a valid number' });
    }

    const updatedCart = await cartsManager.addProductToCart(cartId, productId);

    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: 'Cart or product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ error: 'The parameters "cid" and "pid" must be a valid number' });
    }

    const updatedQuantity = parseInt(req.body.quantity);

    if (isNaN(updatedQuantity)) {
      return res.status(400).json({ error: 'The quantity must be a valid number' });
    }

    const updatedCart = await cartsManager.updateProductQuantity(cartId, productId, updatedQuantity);

    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: 'Cart or product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating the quantity of the product in the cart' });
  }
});

// Delete route still not working
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ error: 'The parameters "cid" and "pid" must be a valid number' });
    }

    const deleted = await cartsManager.removeProductFromCart(cartId, productId);

    if (deleted) {
      res.json({ message: 'Product removed from cart successfully' });
    } else {
      res.status(404).json({ error: 'Cart or product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error removing product from cart' });
  }
});

module.exports = router;