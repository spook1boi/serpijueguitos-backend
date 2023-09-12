const fs = require('fs').promises;

class ProductManager {
  constructor() {
    this.products = [];
    this.idCounter = 1;
  }

  async loadProductsFromFile(filename) {
    try {
      const data = await fs.readFile(filename, 'utf-8');
      this.products = JSON.parse(data);
      this.idCounter = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
    } catch (error) {
      console.error('Error al cargar productos desde el archivo:', error.message);
    }
  }

  async saveProductsToFile(filename) {
    try {
      await fs.writeFile(filename, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error al guardar productos en el archivo:', error.message);
    }
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    const product = this.products.find(product => product.id === id);
    return product || null;
  }

  async addProduct(productData) {
    const { title, description, code, price, stock, category, thumbnails } = productData;
    const newProduct = {
      id: this.idCounter++,
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status: true,
    };
    this.products.push(newProduct);
    await this.saveProductsToFile('products.json');
    return newProduct;
  }

  async updateProduct(id, updatedData) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedData };
      await this.saveProductsToFile('products.json');
      return this.products[productIndex];
    }
    return null;
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      await this.saveProductsToFile('products.json');
      return true;
    }
    return false;
  }
}

module.exports = ProductManager;