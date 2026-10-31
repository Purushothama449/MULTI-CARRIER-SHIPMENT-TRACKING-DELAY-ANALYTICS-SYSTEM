-- =============================================================================
-- SHIPTRACK DBMS LEVEL-3 PROJECT: DATABASE VIEWS
-- =============================================================================

-- 1. VIEW: active_shipments_view
-- Joins shipments, orders, customers, carriers, and warehouses to present complete active shipment details.
CREATE OR REPLACE VIEW active_shipments_view AS
SELECT 
    s.id AS shipment_id,
    s.tracking_no,
    s.order_id,
    o.order_number,
    s.customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    car.name AS carrier_name,
    car.code AS carrier_code,
    ow.name AS origin_warehouse,
    dw.name AS destination_warehouse,
    s.current_location,
    s.destination_city,
    s.current_status,
    s.delay_days,
    s.expected_delivery,
    s.actual_delivery,
    s.created_at
FROM shipments s
JOIN orders o ON s.order_id = o.id
JOIN customers c ON o.customer_id = c.id
JOIN carriers car ON s.carrier_id = car.id
JOIN warehouses ow ON s.origin_warehouse_id = ow.id
LEFT JOIN warehouses dw ON s.dest_warehouse_id = dw.id
WHERE s.current_status NOT IN ('DELIVERED', 'CANCELLED');


-- 2. VIEW: delayed_shipments_per_carrier_view
-- Aggregates total shipments, delayed shipments, and on-time performance per carrier.
CREATE OR REPLACE VIEW delayed_shipments_per_carrier_view AS
SELECT 
    c.id AS carrier_id,
    c.name AS carrier_name,
    c.code AS carrier_code,
    COUNT(s.id) AS total_shipments,
    COUNT(CASE WHEN s.current_status = 'DELIVERED' THEN 1 END) AS delivered_count,
    COUNT(CASE WHEN s.current_status = 'DELAYED' OR s.delay_days > 0 THEN 1 END) AS delayed_count,
    COUNT(CASE WHEN s.current_status = 'IN_TRANSIT' THEN 1 END) AS in_transit_count,
    ROUND(
        (COUNT(CASE WHEN s.current_status = 'DELIVERED' AND s.delay_days = 0 THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(CASE WHEN s.current_status = 'DELIVERED' THEN 1 END), 0)) * 100, 
        2
    ) AS calculated_on_time_pct
FROM carriers c
LEFT JOIN shipments s ON c.id = s.carrier_id
GROUP BY c.id, c.name, c.code;
