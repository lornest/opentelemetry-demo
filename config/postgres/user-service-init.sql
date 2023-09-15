-- CreateTable
CREATE TABLE IF NOT EXISTS Users (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "postal_code" TEXT NOT NULL
);

-- Seed
INSERT INTO Users
(first_name, last_name, postal_code) 
Values('John', 'Doe', 'EH12 5JZ');

INSERT INTO Users
(first_name, last_name, postal_code)
Values('Jane', 'Doe', 'SW3 7XZ');
