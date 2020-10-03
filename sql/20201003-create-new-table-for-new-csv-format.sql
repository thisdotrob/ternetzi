\c finances

CREATE TABLE amex_transactions (
       date TIMESTAMP NOT NULL,
       description TEXT NOT NULL CHECK (description <> ''),
       card_member TEXT NOT NULL CHECK (card_member <> ''),
       account_number  TEXT NOT NULL CHECK (account_number <> ''),
       amount INTEGER NOT NULL,
       extended_details TEXT,
       appears_on_your_statement_as TEXT NOT NULL CHECK (appears_on_your_statement_as <> ''),
       address TEXT,
       town_or_city TEXT,
       postcode TEXT,
       country TEXT,
       reference TEXT PRIMARY KEY NOT NULL CHECK (reference <> '')
);

GRANT SELECT, UPDATE, INSERT ON ALL TABLES IN SCHEMA public TO ternetzi;
GRANT UPDATE ON ALL SEQUENCES IN SCHEMA public TO ternetzi;
