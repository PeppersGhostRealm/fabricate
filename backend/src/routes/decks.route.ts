import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  listDecks,
  getDeck,
  getDeckDetails,
  createDeck,
  updateDeck,
  deleteDeck,
} from "../controllers/decks.controller";

const router = Router();

router.use(requireAuth);
router.get("/", listDecks);
router.post("/", createDeck);
router.get("/:id", getDeck);
router.get("/:id/details", getDeckDetails);
router.put("/:id", updateDeck);
router.delete("/:id", deleteDeck);

export default router;
