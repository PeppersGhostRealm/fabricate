CREATE TABLE IF NOT EXISTS decks (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
  set_code TEXT NOT NULL,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  scryfall_id TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (set_code, number)
);