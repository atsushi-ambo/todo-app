import express from 'express';
import { 
  getCards, 
  getCard, 
  createCard, 
  updateCard, 
  deleteCard,
  getCardsByColumnId,
  moveCard
} from '../controllers/card.controller';

const router = express.Router();

// GET all cards
router.get('/', getCards);

// GET a single card
router.get('/:id', getCard);

// GET cards by column ID
router.get('/column/:columnId', getCardsByColumnId);

// POST a new card
router.post('/', createCard);

// PUT update a card
router.put('/:id', updateCard);

// PUT move a card to a different column or position
router.put('/:id/move', moveCard);

// DELETE a card
router.delete('/:id', deleteCard);

export default router;