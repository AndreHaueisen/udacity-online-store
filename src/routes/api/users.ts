import express from 'express';
import { AuthenticationInput, isAuthenticationInput, UserInput, isUserInput, UserStore } from '../../models/user';
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
    res.status(500).json(err);
  }
});

users.get('/:id', verifyAuthToken, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

users.post('/authenticate', async (req, res) => {
  const authenticationInput = req.body as AuthenticationInput;

  if (isAuthenticationInput(authenticationInput)) {
    try {
      const user = await store.authenticate(authenticationInput);
      if (!user) {
        throw new Error('Invalid authentication input');
      }

      const token = jwt.sign({ user }, process.env.TOKEN_SECRET!);
      res.json(token);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
    }
  } else {
    res.status(400).json('Invalid authentication input');
  }
});

users.post('/', async (req, res) => {
  const userInput = req.body as UserInput;

  if (isUserInput(userInput)) {
    try {
      const user = await store.create(userInput);
      jwt.sign({ user }, process.env.TOKEN_SECRET!);

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(400).json('Invalid user input');
  }
});

export default users;
