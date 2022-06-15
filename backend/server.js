import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI) // continutul lui .env va fii in variabila MONGODB_URI
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
const port = process.env.PORT || 5000;

// app.get('/api/products', (req, res) => {
//   res.send(data.products);
// });

// app.get('/api/products/slug/:slug', (req, res) => {
//   const product = data.products.find(
//     (element) => element.slug === req.params.slug
//   );
//   product
//     ? res.send(product)
//     : res.status(404).send({ message: 'Product not found!' });
// });

// app.get('/api/products/:id', (req, res) => {
//   const product = data.products.find((x) => x._id === req.params.id);
//   product
//     ? res.send(product)
//     : res.status(404).send({ message: 'Product not found!' });
// });

app.listen(port, () => {
  console.log(`Server up http://localhost:${port}`);
});
