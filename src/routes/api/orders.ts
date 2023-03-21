import express from 'express';
import { AddProductInput, OrderStore } from '../../models/order';
import { verifyAuthToken } from '../../utils/helpers';

const orders = express.Router();
const store = new OrderStore();

orders.get('/', verifyAuthToken, async (_, res) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

orders.get('/:id', verifyAuthToken, async (req, res) => {
  const id = req.params.id;

  try {
    const order = await store.show(id);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

orders.get('/currentOrder/:userId', verifyAuthToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const order = await store.currentUserOrder(userId);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

orders.post('/completedOrders/:userId', verifyAuthToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const orders = await store.userCompletedOrders(userId);
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

orders.post('/', verifyAuthToken, async (req, res) => {
  const productInput = req.body;

  try {
    const order = await store.create(productInput);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

orders.post('/:id/addProduct', verifyAuthToken, async (req, res) => {
  const id = req.params.id;
  const addProductInput: AddProductInput = req.body;

  try {
    const productOrder = await store.addProduct(id, addProductInput);
    res.json(productOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

orders.post('/:id/complete', verifyAuthToken, async (req, res) => {
  const id = req.params.id;

  try {
    const order = await store.completeOrder(id);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default orders;
