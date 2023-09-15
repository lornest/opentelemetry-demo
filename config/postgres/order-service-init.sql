-- CreateTable
CREATE TABLE IF NOT EXISTS Orders (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "card_number" TEXT NOT NULL
);

