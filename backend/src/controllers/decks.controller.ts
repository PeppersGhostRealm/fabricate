import { Response, NextFunction } from "express";
import axios from "axios";
import pool from "../db";
import { AuthedRequest } from "../middleware/auth.middleware";

async function ensureCard(set: string, number: string): Promise<string> {
  const lookup = await pool.query(
    "SELECT scryfall_id FROM cards WHERE set_code = $1 AND number = $2",
    [set.toLowerCase(), number]
  );
  if (lookup.rows.length > 0) return lookup.rows[0].scryfall_id;
  const resp = await axios.get(
    `https://api.scryfall.com/cards/${set}/${number}`
  );
  const card = resp.data;
  await pool.query(
    `INSERT INTO cards (set_code, number, name, scryfall_id) VALUES ($1,$2,$3,$4)
    ON CONFLICT (set_code, number) DO UPDATE SET name = EXCLUDED.name, scryfall_id = EXCLUDED.scryfall_id, updated_at = NOW()`,
    [set.toLowerCase(), number, card.name, card.id]
  );
  return card.id;
}

async function parseDeck(
  content: string
): Promise<{ set: string; number: string; quantity: number }[]> {
  const lines = content.split(/\r?\n/);
  const cards: { set: string; number: string; quantity: number }[] = [];
  const regex = /^(\d+)x?\s+(.+?)\s+\(([A-Za-z0-9]+)\)\s+(\d+[a-zA-Z]*)/;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const m = trimmed.match(regex);
    if (!m) continue;
    const quantity = parseInt(m[1], 10);
    const set = m[3];
    const number = m[4];
    await ensureCard(set, number);
    cards.push({ set: set.toLowerCase(), number, quantity });
  }
  return cards;
}

export async function listDecks(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await pool.query(
      "SELECT id, name, content FROM decks WHERE user_id = $1 ORDER BY id DESC",
      [req.user!.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getDeck(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await pool.query(
      "SELECT id, name, content FROM decks WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user!.id]
    );
    if (result.rows.length === 0) {
      res.status(404).send("Not found");
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getDeckDetails(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await pool.query(
      "SELECT id, name, content FROM decks WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user!.id]
    );
    if (result.rows.length === 0) {
      res.status(404).send("Not found");
      return;
    }
    const deck = result.rows[0];
    let cards: { set: string; number: string; quantity: number }[] = [];
    try {
      cards = JSON.parse(deck.content);
    } catch {
      cards = [];
    }
    const detailed = await Promise.all(
      cards.map(async (c) => {
        const r = await pool.query(
          "SELECT name FROM cards WHERE set_code = $1 AND number = $2",
          [c.set, c.number]
        );
        return { ...c, name: r.rows.length > 0 ? r.rows[0].name : "" };
      })
    );
    res.json({ id: deck.id, name: deck.name, cards: detailed });
  } catch (err) {
    next(err);
  }
}

export async function createDeck(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, content } = req.body;
  try {
    const parsed = await parseDeck(content);
    const result = await pool.query(
      "INSERT INTO decks (user_id, name, content) VALUES ($1, $2, $3) RETURNING id, name, content",
      [req.user!.id, name, JSON.stringify(parsed)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateDeck(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, content } = req.body;
  try {
    const parsed = await parseDeck(content);
    const result = await pool.query(
      "UPDATE decks SET name = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING id, name, content",
      [name, JSON.stringify(parsed), req.params.id, req.user!.id]
    );
    if (result.rows.length === 0) {
      res.status(404).send("Not found");
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteDeck(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await pool.query(
      "DELETE FROM decks WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user!.id]
    );
    if (result.rows.length === 0) {
      res.status(404).send("Not found");
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
