/**
 * Audit Log Partitioning - Sprint 0: Scalable Audit Storage
 *
 * Purpose: Partition audit_logs table by month for performance and retention
 * - Monthly partitions for efficient queries and archival
 * - Automatic partition creation for future months
 * - Retention policy (drop old partitions after 12 months)
 * - Indexes on each partition for fast lookups
 *
 * Performance:
 * - Partition pruning reduces query scan size
 * - Each partition has own indexes
 * - Easy to archive/drop old data
 */

-- ============================================================================
-- 1. CREATE PARTITIONED AUDIT LOGS TABLE
-- ============================================================================

-- First, check if audit_logs exists and has data
DO $$
DECLARE
  v_row_count INTEGER;
  v_table_exists BOOLEAN;
BEGIN
  -- Check if table exists
  SELECT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'audit_logs'
  ) INTO v_table_exists;

  IF v_table_exists THEN
    -- Get row count
    SELECT COUNT(*) INTO v_row_count FROM audit_logs;
    RAISE NOTICE 'Found existing audit_logs table with % rows', v_row_count;

    -- If table has data, we need to migrate it
    IF v_row_count > 0 THEN
      RAISE NOTICE 'Backing up existing data...';

      -- Create backup table
      CREATE TABLE IF NOT EXISTS audit_logs_backup AS
      SELECT * FROM audit_logs;

      RAISE NOTICE 'Backup created: audit_logs_backup';
    END IF;

    -- Drop existing table
    DROP TABLE IF EXISTS audit_logs CASCADE;
    RAISE NOTICE 'Dropped existing audit_logs table';
  END IF;
END $$;

-- Create new partitioned table
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_id UUID,
  target_type TEXT,
  changes JSONB,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- ============================================================================
-- 2. CREATE MONTHLY PARTITIONS (2025)
-- ============================================================================

-- January 2025
CREATE TABLE audit_logs_2025_01 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- February 2025
CREATE TABLE audit_logs_2025_02 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- March 2025
CREATE TABLE audit_logs_2025_03 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- April 2025
CREATE TABLE audit_logs_2025_04 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');

-- May 2025
CREATE TABLE audit_logs_2025_05 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');

-- June 2025
CREATE TABLE audit_logs_2025_06 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');

-- July 2025
CREATE TABLE audit_logs_2025_07 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');

-- August 2025
CREATE TABLE audit_logs_2025_08 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

-- September 2025
CREATE TABLE audit_logs_2025_09 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');

-- October 2025
CREATE TABLE audit_logs_2025_10 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- November 2025
CREATE TABLE audit_logs_2025_11 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- December 2025
CREATE TABLE audit_logs_2025_12 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- ============================================================================
-- 3. CREATE INDEXES ON PARTITIONS
-- ============================================================================

-- Admin ID index (for filtering by admin)
CREATE INDEX idx_audit_logs_2025_01_admin ON audit_logs_2025_01(admin_id);
CREATE INDEX idx_audit_logs_2025_02_admin ON audit_logs_2025_02(admin_id);
CREATE INDEX idx_audit_logs_2025_03_admin ON audit_logs_2025_03(admin_id);
CREATE INDEX idx_audit_logs_2025_04_admin ON audit_logs_2025_04(admin_id);
CREATE INDEX idx_audit_logs_2025_05_admin ON audit_logs_2025_05(admin_id);
CREATE INDEX idx_audit_logs_2025_06_admin ON audit_logs_2025_06(admin_id);
CREATE INDEX idx_audit_logs_2025_07_admin ON audit_logs_2025_07(admin_id);
CREATE INDEX idx_audit_logs_2025_08_admin ON audit_logs_2025_08(admin_id);
CREATE INDEX idx_audit_logs_2025_09_admin ON audit_logs_2025_09(admin_id);
CREATE INDEX idx_audit_logs_2025_10_admin ON audit_logs_2025_10(admin_id);
CREATE INDEX idx_audit_logs_2025_11_admin ON audit_logs_2025_11(admin_id);
CREATE INDEX idx_audit_logs_2025_12_admin ON audit_logs_2025_12(admin_id);

-- Action index (for filtering by action type)
CREATE INDEX idx_audit_logs_2025_01_action ON audit_logs_2025_01(action);
CREATE INDEX idx_audit_logs_2025_02_action ON audit_logs_2025_02(action);
CREATE INDEX idx_audit_logs_2025_03_action ON audit_logs_2025_03(action);
CREATE INDEX idx_audit_logs_2025_04_action ON audit_logs_2025_04(action);
CREATE INDEX idx_audit_logs_2025_05_action ON audit_logs_2025_05(action);
CREATE INDEX idx_audit_logs_2025_06_action ON audit_logs_2025_06(action);
CREATE INDEX idx_audit_logs_2025_07_action ON audit_logs_2025_07(action);
CREATE INDEX idx_audit_logs_2025_08_action ON audit_logs_2025_08(action);
CREATE INDEX idx_audit_logs_2025_09_action ON audit_logs_2025_09(action);
CREATE INDEX idx_audit_logs_2025_10_action ON audit_logs_2025_10(action);
CREATE INDEX idx_audit_logs_2025_11_action ON audit_logs_2025_11(action);
CREATE INDEX idx_audit_logs_2025_12_action ON audit_logs_2025_12(action);

-- Target ID index (for looking up logs for specific targets)
CREATE INDEX idx_audit_logs_2025_01_target ON audit_logs_2025_01(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_02_target ON audit_logs_2025_02(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_03_target ON audit_logs_2025_03(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_04_target ON audit_logs_2025_04(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_05_target ON audit_logs_2025_05(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_06_target ON audit_logs_2025_06(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_07_target ON audit_logs_2025_07(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_08_target ON audit_logs_2025_08(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_09_target ON audit_logs_2025_09(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_10_target ON audit_logs_2025_10(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_11_target ON audit_logs_2025_11(target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_logs_2025_12_target ON audit_logs_2025_12(target_id) WHERE target_id IS NOT NULL;

-- ============================================================================
-- 4. FUNCTION TO AUTO-CREATE FUTURE PARTITIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION create_monthly_audit_partition(partition_date DATE)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  -- Calculate partition boundaries
  start_date := DATE_TRUNC('month', partition_date);
  end_date := start_date + INTERVAL '1 month';

  -- Generate partition name (format: audit_logs_YYYY_MM)
  partition_name := 'audit_logs_' || TO_CHAR(start_date, 'YYYY_MM');

  -- Check if partition already exists
  IF EXISTS (
    SELECT 1 FROM pg_class
    WHERE relname = partition_name
  ) THEN
    RAISE NOTICE 'Partition % already exists', partition_name;
    RETURN;
  END IF;

  -- Create partition
  EXECUTE format(
    'CREATE TABLE %I PARTITION OF audit_logs FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );

  -- Create indexes
  EXECUTE format('CREATE INDEX idx_%s_admin ON %I(admin_id)', partition_name, partition_name);
  EXECUTE format('CREATE INDEX idx_%s_action ON %I(action)', partition_name, partition_name);
  EXECUTE format('CREATE INDEX idx_%s_target ON %I(target_id) WHERE target_id IS NOT NULL', partition_name, partition_name);

  RAISE NOTICE 'Created partition % with indexes', partition_name;
END;
$$;

-- ============================================================================
-- 5. RETENTION POLICY FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_audit_partitions(retention_months INTEGER DEFAULT 12)
RETURNS TABLE (
  partition_name TEXT,
  action TEXT,
  row_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_partition RECORD;
  v_cutoff_date DATE;
  v_row_count BIGINT;
BEGIN
  -- Calculate cutoff date
  v_cutoff_date := DATE_TRUNC('month', NOW() - (retention_months || ' months')::INTERVAL);

  RAISE NOTICE 'Cleaning up partitions older than %', v_cutoff_date;

  -- Find and drop old partitions
  FOR v_partition IN
    SELECT
      c.relname::TEXT as partition_name,
      pg_get_expr(c.relpartbound, c.oid) as partition_bound
    FROM pg_class c
    JOIN pg_inherits i ON c.oid = i.inhrelid
    JOIN pg_class p ON p.oid = i.inhparent
    WHERE p.relname = 'audit_logs'
    AND c.relname LIKE 'audit_logs_%'
    ORDER BY c.relname
  LOOP
    -- Extract year and month from partition name
    DECLARE
      v_year INTEGER;
      v_month INTEGER;
      v_partition_date DATE;
    BEGIN
      v_year := SUBSTRING(v_partition.partition_name FROM 'audit_logs_(\d{4})_\d{2}')::INTEGER;
      v_month := SUBSTRING(v_partition.partition_name FROM 'audit_logs_\d{4}_(\d{2})')::INTEGER;
      v_partition_date := make_date(v_year, v_month, 1);

      IF v_partition_date < v_cutoff_date THEN
        -- Get row count before dropping
        EXECUTE format('SELECT COUNT(*) FROM %I', v_partition.partition_name) INTO v_row_count;

        -- Drop partition
        EXECUTE format('DROP TABLE %I', v_partition.partition_name);

        RETURN QUERY SELECT v_partition.partition_name, 'dropped'::TEXT, v_row_count;
        RAISE NOTICE 'Dropped partition % (% rows)', v_partition.partition_name, v_row_count;
      ELSE
        RETURN QUERY SELECT v_partition.partition_name, 'retained'::TEXT, NULL::BIGINT;
      END IF;
    END;
  END LOOP;
END;
$$;

-- ============================================================================
-- 6. RESTORE DATA FROM BACKUP (if exists)
-- ============================================================================

DO $$
DECLARE
  v_backup_exists BOOLEAN;
  v_row_count INTEGER;
BEGIN
  -- Check if backup exists
  SELECT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'audit_logs_backup'
  ) INTO v_backup_exists;

  IF v_backup_exists THEN
    -- Restore data from backup
    INSERT INTO audit_logs
    SELECT * FROM audit_logs_backup;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    RAISE NOTICE 'Restored % rows from backup', v_row_count;

    -- Keep backup table for safety (can drop manually later)
    RAISE NOTICE 'Backup table retained: audit_logs_backup (can be dropped manually)';
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- View all partitions:
-- SELECT
--   c.relname as partition_name,
--   pg_get_expr(c.relpartbound, c.oid) as partition_bound,
--   pg_size_pretty(pg_table_size(c.oid)) as size
-- FROM pg_class c
-- JOIN pg_inherits i ON c.oid = i.inhrelid
-- JOIN pg_class p ON p.oid = i.inhparent
-- WHERE p.relname = 'audit_logs'
-- ORDER BY c.relname;

-- Test partition creation for next month:
-- SELECT create_monthly_audit_partition(NOW() + INTERVAL '1 month');

-- Test retention cleanup (dry run - just view what would be dropped):
-- SELECT * FROM cleanup_old_audit_partitions(12);
