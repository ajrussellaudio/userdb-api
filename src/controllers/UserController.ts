import express from 'express';
import { ZodError } from 'zod';
import { createUser } from '../models/User';

const UserController = express.Router();

UserController.post('/', async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ error: error.flatten() });
    }
    return res.status(500).json({ error });
  }
});

export default UserController;
