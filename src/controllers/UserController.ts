import express from 'express';
import { createUser } from '../models/User';

const UserController = express.Router();

UserController.post('/', async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ error });
  }
});

export default UserController;
