-- =============================================================================
-- SHIPTRACK DBMS LEVEL-3 PROJECT: STORED FUNCTIONS AND TRIGGERS
-- =============================================================================

-- 1. STORED FUNCTION: calculate_delay(shipment_id)
-- Calculates the difference in days between actual delivery date (or current date)
-- and expected delivery date.
CREATE OR REPLACE FUNCTION calculate_delay(p_shipment_id VARCHAR)
RETURNS INT AS $$
DECLARE
    v_expected TIMESTAMP WITH TIME ZONE;
    v_actual TIMESTAMP WITH TIME ZONE;
    v_status VARCHAR;
    v_delay_days INT := 0;
BEGIN
    SELECT expected_delivery, actual_delivery, current_status
    INTO v_expected, v_actual, v_status
    FROM shipments
    WHERE id = p_shipment_id;

    IF NOT FOUND THEN
        RETURN 0;
    END IF;

    IF v_status = 'DELIVERED' AND v_actual IS NOT NULL THEN
        IF v_actual > v_expected THEN
            v_delay_days := EXTRACT(DAY FROM (v_actual - v_expected));
        END IF;
    ELSIF v_status != 'DELIVERED' AND CURRENT_TIMESTAMP > v_expected THEN
        v_delay_days := EXTRACT(DAY FROM (CURRENT_TIMESTAMP - v_expected));
    END IF;

    -- Update the delay_days column in shipments
    UPDATE shipments 
    SET delay_days = v_delay_days,
        current_status = CASE WHEN v_delay_days > 0 AND current_status != 'DELIVERED' THEN 'DELAYED' ELSE current_status END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_shipment_id;

    RETURN v_delay_days;
END;
$$ LANGUAGE plpgsql;


-- 2. TRIGGER FUNCTION: log_shipment_status_change()
-- Automatically logs status changes into shipment_status_history table
-- and recalculates carrier on-time delivery rates.
CREATE OR REPLACE FUNCTION log_shipment_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status history if status or location changes
    IF (TG_OP = 'INSERT') OR (OLD.current_status IS DISTINCT FROM NEW.current_status) OR (OLD.current_location IS DISTINCT FROM NEW.current_location) THEN
        INSERT INTO shipment_status_history (
            id,
            shipment_id,
            status,
            location,
            notes,
            updated_at,
            updated_by
        ) VALUES (
            gen_random_uuid()::varchar,
            NEW.id,
            NEW.current_status,
            NEW.current_location,
            'Automated trigger log for status: ' || NEW.current_status,
            CURRENT_TIMESTAMP,
            'SYSTEM_TRIGGER'
        );
    END IF;

    -- Update carrier on-time rate if delivered
    IF NEW.current_status = 'DELIVERED' AND (TG_OP = 'INSERT' OR OLD.current_status != 'DELIVERED') THEN
        UPDATE carriers
        SET on_time_rate = (
            SELECT ROUND(
                (COUNT(CASE WHEN delay_days = 0 THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 
                2
            )
            FROM shipments
            WHERE carrier_id = NEW.carrier_id AND current_status = 'DELIVERED'
        )
        WHERE id = NEW.carrier_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- BIND TRIGGER TO SHIPMENTS TABLE
DROP TRIGGER IF EXISTS trg_shipment_status_history ON shipments;
CREATE TRIGGER trg_shipment_status_history
AFTER INSERT OR UPDATE ON shipments
FOR EACH ROW
EXECUTE FUNCTION log_shipment_status_change();
