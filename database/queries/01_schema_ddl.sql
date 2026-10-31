-- =============================================================================
-- SHIPTRACK DBMS LEVEL-3 PROJECT: POSTGRESQL SCHEMA DDL
-- Multi-Carrier Shipment Tracking & Delay Analytics System
-- =============================================================================

-- Drop tables if exists (Cascade)
DROP TABLE IF EXISTS shipment_status_history CASCADE;
DROP TABLE IF EXISTS route_legs CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS carriers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 1. ROLES TABLE
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('ADMIN', 'WAREHOUSE_STAFF', 'CARRIER_DRIVER', 'CUSTOMER')),
    description TEXT
);

-- 2. USERS TABLE
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CUSTOMERS TABLE
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(100),
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CARRIERS TABLE
CREATE TABLE carriers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('Express', 'Standard', 'Same Day')),
    on_time_rate NUMERIC(5,2) DEFAULT 0.0 CHECK (on_time_rate BETWEEN 0 AND 100),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. WAREHOUSES TABLE
CREATE TABLE warehouses (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(200) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    current_utilization INT DEFAULT 0 CHECK (current_utilization >= 0),
    manager_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. INVENTORY TABLE
CREATE TABLE inventory (
    id VARCHAR(36) PRIMARY KEY,
    warehouse_id VARCHAR(36) NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    product_name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0),
    min_reorder_level INT NOT NULL DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDERS TABLE
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    items_count INT DEFAULT 1 CHECK (items_count > 0)
);

-- 8. SHIPMENTS TABLE
CREATE TABLE shipments (
    id VARCHAR(36) PRIMARY KEY,
    tracking_no VARCHAR(50) UNIQUE NOT NULL,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    carrier_id VARCHAR(36) NOT NULL REFERENCES carriers(id) ON DELETE RESTRICT,
    origin_warehouse_id VARCHAR(36) NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
    dest_warehouse_id VARCHAR(36) REFERENCES warehouses(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    destination_city VARCHAR(50) NOT NULL,
    expected_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    current_status VARCHAR(30) DEFAULT 'PENDING' CHECK (current_status IN ('PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_TRANSIT', 'AT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED', 'CANCELLED')),
    delay_days INT DEFAULT 0 CHECK (delay_days >= 0),
    current_location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ROUTE LEGS TABLE
CREATE TABLE route_legs (
    id VARCHAR(36) PRIMARY KEY,
    shipment_id VARCHAR(36) NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    sequence_number INT NOT NULL CHECK (sequence_number > 0),
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    departure_time TIMESTAMP WITH TIME ZONE,
    arrival_time TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_shipment_leg_seq UNIQUE(shipment_id, sequence_number)
);

-- 10. SHIPMENT STATUS HISTORY TABLE
CREATE TABLE shipment_status_history (
    id VARCHAR(36) PRIMARY KEY,
    shipment_id VARCHAR(36) NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    location VARCHAR(100) NOT NULL,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
