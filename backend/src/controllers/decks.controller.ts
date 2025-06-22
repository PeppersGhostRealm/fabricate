import { Response, NextFunction } from "express";
import pool from "../db";
import { AuthedRequest } from "../middleware/auth.middleware";

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

export async function createDeck(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO decks (user_id, name, content) VALUES ($1, $2, $3) RETURNING id, name, content",
      [req.user!.id, name, content]
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
    const result = await pool.query(
      "UPDATE decks SET name = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING id, name, content",
      [name, content, req.params.id, req.user!.id]
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
