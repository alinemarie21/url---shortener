import * as userService from '../services/user.service.js';

export async function create(req, res) {
  const { name, email, password } = req.body ?? {};

  const user = await userService.create({ name, email, password });

  res.status(201).json(user);
}
