CREATE TABLE IF NOT EXISTS tbl_user_account(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    country_code VARCHAR(5) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    token_generation_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    password_recovery_token varchar(255),
    recovery_token_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_user_profile(
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    email VARCHAR(255) NOT NULL,
    country_code VARCHAR(5) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    company_name VARCHAR(255) NOT NULL,
    address1 VARCHAR(255) NOT NULL,
    address2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    post_code VARCHAR(20) NOT NULL,
    state VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES tbl_user_account(user_id)
);

CREATE TABLE IF NOT EXISTS tbl_payment_intent (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    domain VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(10) NOT NULL,
    description TEXT,
    years VARCHAR(10) NOT NULL,
    payment_intent_id VARCHAR(255),
    client_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES tbl_user_account(user_id)
);

--DROP TYPE IF EXISTS domain_status CASCADE;
--CREATE TYPE domain_status AS ENUM ('active', 'expired', 'pending');

CREATE TABLE IF NOT EXISTS tbl_domain_registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  domain VARCHAR(255) NOT NULL UNIQUE,
  years INTEGER NOT NULL,
  auto_renew BOOLEAN,
  expiration_date TIMESTAMP,
  status VARCHAR (20),
  payment_intent_id VARCHAR(255) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES tbl_user_account(user_id)
);
CREATE TABLE IF NOT EXISTS tbl_domain_cart (
  cart_id SERIAL PRIMARY KEY,
  user_id INTEGER,
  domain VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES tbl_user_account(user_id)
);

CREATE TABLE IF NOT EXISTS tbl_payment_details (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  amount VARCHAR(255),
  currency VARCHAR(3),
  description TEXT,
  payment_method_id VARCHAR(255),
  payment_intent_id VARCHAR(255),
  customer_name VARCHAR(255),
  customer_address1 TEXT,
  customer_address2 TEXT,
  customer_city VARCHAR(255),
  customer_postal_code VARCHAR(10),
  customer_country VARCHAR(2),
  FOREIGN KEY (user_id) REFERENCES tbl_user_account(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--DROP TABLE tbl_reset_password_tokens,tbl_domain_registrations CASCADE;

