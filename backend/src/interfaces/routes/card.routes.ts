import express from 'express';
import { CardController } from '../controllers/card.controller';

export const createCardRouter = (cardController: CardController) => {
  const router = express.Router();

  // GET all cards
  router.get('/', cardController.getCards);
  
  // GET cards by column ID
  router.get('/column/:columnId', cardController.getCardsByColumnId);
  
  // GET a single card
  router.get('/:id', cardController.getCard);
  
  // POST create a new card
  router.post('/', cardController.createCard);
  
  // PUT update a card
  router.put('/:id', cardController.updateCard);
  
  // PUT move a card
  router.put('/:id/move', cardController.moveCard);
  
  // DELETE a card
  router.delete('/:id', cardController.deleteCard);

  return router;
};