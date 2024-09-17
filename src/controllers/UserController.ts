import express from 'express';
import { ZodError } from 'zod';
import { createUser, findUserById } from '../models/User';

const UserController = express.Router();

UserController.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

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
