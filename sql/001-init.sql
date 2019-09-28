DROP TABLE IF EXISTS amex_transactions;

CREATE TABLE IF NOT EXISTS amex_transactions (
       reference TEXT PRIMARY KEY NOT NULL CHECK (reference <> ''),
       transaction_date TIMESTAMP NOT NULL,
       process_date TIMESTAMP NOT NULL,
       minor_units INTEGER NOT NULL,
       counter_party_name TEXT NOT NULL,
       description TEXT
);
