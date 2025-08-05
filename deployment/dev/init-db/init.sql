-- Create databases for each service
CREATE DATABASE litf_db_auth_service;
CREATE DATABASE litf_db_user_service;
CREATE DATABASE litf_db_payment_service;
CREATE DATABASE litf_db_helpdesk_service;
CREATE DATABASE litf_db_booth_service;

-- Create users for each service
CREATE USER litf_auth_user WITH PASSWORD 'auth_password';
CREATE USER litf_user_user WITH PASSWORD 'user_password';
CREATE USER litf_payment_user WITH PASSWORD 'payment_password';
CREATE USER litf_helpdesk_user WITH PASSWORD 'helpdesk_password';
CREATE USER litf_booth_user WITH PASSWORD 'booth_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE litf_auth_db TO litf_auth_user;
GRANT ALL PRIVILEGES ON DATABASE litf_user_db TO litf_user_user;
GRANT ALL PRIVILEGES ON DATABASE litf_payment_db TO litf_payment_user;
GRANT ALL PRIVILEGES ON DATABASE litf_helpdesk_db TO litf_helpdesk_user;
GRANT ALL PRIVILEGES ON DATABASE litf_booth_db TO litf_booth_user;