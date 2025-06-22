import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  listDecks,
  getDeck,
  createDeck,
  updateDeck,
  deleteDeck,
} from "../controllers/decks.controller";

const router = Router();

router.use(requireAuth);
router.get("/", listDecks);
router.post("/", createDeck);
router.get("/:id", getDeck);
router.put("/:id", updateDeck);
router.delete("/:id", deleteDeck);

export default router;
