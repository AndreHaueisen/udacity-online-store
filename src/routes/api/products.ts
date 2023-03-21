import express from 'express';
import { ProductStore, isProductInput } from '../../models/product';
import { verifyAuthToken } from '../../utils/helpers';

const products = express.Router();
const store = new ProductStore();

products.get('/', async (_, res) => {
  try {
    const products = await store.index();

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

products.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const product = await store.show(id);
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

products.post('/', verifyAuthToken, async (req, res) => {
  if (isProductInput(req.body)) {
    const productInput = req.body;

    try {
      const product = await store.create(productInput);
      res.json(product);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(400).json('Invalid product input');
  }
});

export default products;
