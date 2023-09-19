const express = require('express');
const http = require('http');
const path = require('path');
const Handlebars = require('express-handlebars');
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const ProductManager = require('../src/ProductsManager');
const productsRouter = require('../src/routes/products.router'); 
const cartsRouter = require('../src/routes/carts.router'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productsManager = new ProductManager();
productsManager.loadProductsFromFile('products.json');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", Handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    const products = await productsManager.getProducts();
    res.render('index', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error obtaining the products' });
  }
});

app.get('/realtimeproducts', (req, res) => {
  const products = productsManager.getProducts();
  res.render('realTimeProducts', { products });
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('addProduct', (productData) => {
    const newProduct = {
      title: productData.title,
      price: parseFloat(productData.price), 

    };

    try {
      productsManager.addProduct(newProduct);
      io.emit('productAdded', newProduct);
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  });
});

app.use(bodyParser.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});