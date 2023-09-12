const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('../src/routes/products.router'); 
const cartsRouter = require('../src/routes/carts.router'); 
const app = express();
const port = 8080;

app.use(bodyParser.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});