import express from 'express';
import { OrderStore } from '../../models/order';
import { verifyAuthToken } from '../../utils/helpers';

const orders = express.Router();
const store = new OrderStore();

orders.get('/', async (_, res) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

orders.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const order = await store.show(id);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

orders.post('/', verifyAuthToken, async (req, res) => {
  const productInput = req.body;

  try {
    const order = await store.create(productInput);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default orders;
