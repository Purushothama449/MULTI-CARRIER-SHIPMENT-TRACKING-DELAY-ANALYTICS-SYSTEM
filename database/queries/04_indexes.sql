-- =============================================================================
-- SHIPTRACK DBMS LEVEL-3 PROJECT: INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================================================

-- Shipments Table Indexes
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_no ON shipments(tracking_no);
CREATE INDEX IF NOT EXISTS idx_shipments_current_status ON shipments(current_status);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier_id ON shipments(carrier_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);

-- Orders Table Indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Route Legs Index
CREATE INDEX IF NOT EXISTS idx_route_legs_shipment_id ON route_legs(shipment_id);
CREATE INDEX IF NOT EXISTS idx_route_legs_seq ON route_legs(shipment_id, sequence_number);

-- Shipment Status History Index
CREATE INDEX IF NOT EXISTS idx_status_history_shipment_id ON shipment_status_history(shipment_id);
