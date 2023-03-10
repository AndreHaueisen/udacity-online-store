import express from 'express';
import { AuthenticationInput, UserInput, UserStore } from '../../models/user';
import { verifyAuthToken } from '../../utils/helpers';
import jwt from 'jsonwebtoken';

const users = express.Router();
const store = new UserStore(parseInt(process.env.BCRYPT_SALT_ROUNDS!), process.env.BCRYPT_PASSOWORD!);

users.get('/', verifyAuthToken, async (_, res) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

users.get('/:id', verifyAuthToken, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

users.get('/authenticate', async (req, res) => {
  const authenticationInput = req.body as AuthenticationInput;

  try {
    const user = await store.authenticate(authenticationInput);
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET!);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

users.post('/', async (req, res) => {
  const userInput = req.body as UserInput;

  try {
    const user = await store.create(userInput);
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET!);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


export default users;