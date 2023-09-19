const fs = require('fs/promises');

class CartManager {
  constructor() {
    this.carts = [];
    this.idCounter = 1;
  }

  async loadCartsFromFile() {
    try {
      const data = await fs.readFile('carts.json', 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      throw new Error('Error loading carts from file.');
    }
  }

  async getCartById(id) {
    const cart = this.carts.find(cart => cart.id === id);
    return cart || null;
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);

    if (!cart) {
      return null; 
    }

    const existingProduct = cart.products.find(item => item.productId === productId);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }

    await this.saveCartsToFile();
    return cart;
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    const cart = await this.getCartById(cartId);

    if (!cart) {
      return null; 
    }

    const productToUpdate = cart.products.find(item => item.productId === productId);

    if (!productToUpdate) {
      return null; 
    }

    productToUpdate.quantity = newQuantity;

    await this.saveCartsToFile();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCartById(cartId);

    if (!cart) {
      return false;
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(item => item.productId !== productId);

    if (cart.products.length < initialLength) {
      await this.saveCartsToFile();
      return true; 
    }

    return false; 
  }

  async saveCartsToFile() {
    try {
      await fs.writeFile('carts.json', JSON.stringify(this.carts, null, 2));
    } catch (error) {
      throw new Error('Error saving carts to file.');
    }
  }
}

module.exports = CartManager;