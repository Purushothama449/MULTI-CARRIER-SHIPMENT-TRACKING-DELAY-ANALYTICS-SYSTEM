-- =============================================================================
-- SHIPTRACK DBMS LEVEL-3 PROJECT: SAMPLE DML & ANALYTICS QUERIES
-- =============================================================================

-- 1. SELECT WITH INNER & LEFT JOINs
-- Get shipment details along with order, customer, carrier and warehouse names
SELECT 
    s.tracking_no,
    o.order_number,
    c.name AS customer_name,
    car.name AS carrier_name,
    w_orig.name AS origin_hub,
    w_dest.name AS dest_hub,
    s.current_status,
    s.expected_delivery
FROM shipments s
INNER JOIN orders o ON s.order_id = o.id
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN carriers car ON s.carrier_id = car.id
INNER JOIN warehouses w_orig ON s.origin_warehouse_id = w_orig.id
LEFT JOIN warehouses w_dest ON s.dest_warehouse_id = w_dest.id
ORDER BY s.created_at DESC;

-- 2. GROUP BY AND HAVING
-- Carrier delay summary showing carriers having more than 1 delayed shipment
SELECT 
    car.name AS carrier_name,
    COUNT(s.id) AS total_shipments,
    COUNT(CASE WHEN s.current_status = 'DELAYED' THEN 1 END) AS delayed_shipments,
    ROUND(AVG(s.delay_days), 2) AS avg_delay_days
FROM carriers car
JOIN shipments s ON car.id = s.carrier_id
GROUP BY car.id, car.name
HAVING COUNT(CASE WHEN s.current_status = 'DELAYED' THEN 1 END) > 0
ORDER BY delayed_shipments DESC;

-- 3. SUBQUERY
-- Find customers whose total order spending is above the overall average customer spending
SELECT 
    c.name,
    c.email,
    c.city,
    SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.email, c.city
HAVING SUM(o.total_amount) > (
    SELECT AVG(total_order_sum) 
    FROM (
        SELECT SUM(total_amount) AS total_order_sum 
        FROM orders 
        GROUP BY customer_id
    ) AS customer_totals
);

-- 4. AGGREGATE FUNCTIONS (COUNT, SUM, AVG, MIN, MAX)
-- Dashboard Summary Statistics
SELECT 
    COUNT(*) AS total_shipments,
    COUNT(CASE WHEN current_status = 'IN_TRANSIT' THEN 1 END) AS in_transit_count,
    COUNT(CASE WHEN current_status = 'DELIVERED' THEN 1 END) AS delivered_count,
    COUNT(CASE WHEN current_status = 'DELAYED' THEN 1 END) AS delayed_count,
    MAX(delay_days) AS max_delay_days,
    ROUND(AVG(delay_days), 1) AS avg_delay_days
FROM shipments;

-- 5. ATOMIC TRANSACTION EXAMPLE: CREATE SHIPMENT & UPDATE INVENTORY
BEGIN;

-- Check inventory quantity (Application logic validation)
-- Deduct inventory item
UPDATE inventory
SET quantity = quantity - 1
WHERE sku = 'SKU-ELECTRONICS-101' AND quantity >= 1;

-- Insert Order
INSERT INTO orders (id, order_number, customer_id, total_amount, status, items_count)
VALUES ('ORD-TRANSACTION-99', 'ORD9999', 'cust-uuid-1', 4999.00, 'SHIPPED', 1);

-- Insert Shipment
INSERT INTO shipments (
    id, tracking_no, order_id, carrier_id, origin_warehouse_id, 
    customer_name, destination_city, expected_delivery, current_status, current_location
) VALUES (
    'shp-transaction-99', 'TRK999999', 'ORD-TRANSACTION-99', 'car-bluedart-1', 'wh-blr-1',
    'Rohan Sharma', 'Mumbai', CURRENT_TIMESTAMP + INTERVAL '3 days', 'IN_TRANSIT', 'Bangalore Warehouse'
);

COMMIT;
