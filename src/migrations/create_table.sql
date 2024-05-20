CREATE TABLE IF NOT EXISTS tbl_user_account(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
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
CREATE TABLE IF NOT EXISTS tbl_domain_registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  domain VARCHAR(255) NOT NULL UNIQUE,
  years INTEGER NOT NULL,
  payment_id VARCHAR(255),
  auto_renew BOOLEAN,
  expiration_date TIMESTAMP,
  status VARCHAR(10),
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
CREATE TABLE IF NOT EXISTS tbl_domain_order_items (
    order_item_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    cart_id INTEGER,
    domain VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tbl_user_account(user_id),
    FOREIGN KEY (cart_id) REFERENCES tbl_domain_cart(cart_id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_payments (
    payment_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    order_item_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tbl_user_account(user_id),
    FOREIGN KEY (order_item_id) REFERENCES tbl_domain_order_items(order_item_id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER,--set not null
    payment_id INTEGER,
    order_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES tbl_domain_payments(payment_id),
    FOREIGN KEY (user_id) REFERENCES tbl_user_account(user_id)
);

CREATE TABLE IF NOT EXISTS tbl_reset_password_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES tbl_user_account(user_id)
);


