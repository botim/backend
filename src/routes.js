import { Router } from 'express';
import { getBotIds } from './models/confirmed';
import { createUserIds } from './models/suspected';

const routes = Router();

routes.get('/confirmed', (req, res) => {
  getBotIds().then(botIds => {
    res.json({ botIds })
  });
});

routes.post('/suspected', (req, res) => {
  const { userId } = req.query;
  createUserIds(userId, false).then(id => {
    res.json({ id })
  });
});

export default routes;
