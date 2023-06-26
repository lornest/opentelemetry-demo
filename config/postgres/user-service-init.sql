-- CreateTable
CREATE TABLE IF NOT EXISTS Users (
  "id" SERIAL PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "zip_code" TEXT NOT NULL,
  "payment_card" TEXT NOT NULL
);

-- Seed
INSERT INTO Users
(first_name, last_name, zip_code, payment_card) 
Values('John', 'Doe', '90210', '****-****-****-9876');

INSERT INTO Users
(first_name, last_name, zip_code, payment_card)
Values('Jane', 'Doe', '12345', '****-****-****-1234');
