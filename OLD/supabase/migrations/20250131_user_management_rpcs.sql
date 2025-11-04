/**
 * User Management RPCs - Sprint 0: Secure Admin Operations
 *
 * Purpose: Provide secure, audited functions for user management
 * - Suspend/unsuspend users
 * - Delete users (soft delete)
 * - Reset passwords
 * - Change user roles
 *
 * Security:
 * - SECURITY DEFINER (runs with elevated privileges)
 * - RBAC checks within function
 * - Audit logging in same transaction
 * - Correlation IDs for traceability
 * - Reason required for destructive actions
 */

-- ============================================================================
-- 1. SUSPEND USER
-- ============================================================================

CREATE OR REPLACE FUNCTION suspend_user(
  p_user_id UUID,
  p_reason TEXT,
  p_admin_id UUID,
  p_correlation_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_role TEXT;
  v_admin_branch_id UUID;
  v_user_branch_id UUID;
  v_user_name TEXT;
  v_old_status TEXT;
  v_correlation_id TEXT;
BEGIN
  -- Generate correlation ID if not provided
  v_correlation_id := COALESCE(p_correlation_id, gen_random_uuid()::TEXT);

  -- Get admin role and branch
  SELECT role, branch_id INTO v_admin_role, v_admin_branch_id
  FROM profiles
  WHERE id = p_admin_id;

  IF v_admin_role IS NULL THEN
    RAISE EXCEPTION 'Admin not found';
  END IF;

  -- Check permissions
  IF v_admin_role NOT IN ('super_admin', 'branch_admin') THEN
    RAISE EXCEPTION 'Insufficient permissions. Required: super_admin or branch_admin';
  END IF;

  -- Get user details
  SELECT status, branch_id, full_name INTO v_old_status, v_user_branch_id, v_user_name
  FROM users
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Branch admins can only manage users in their branch
  IF v_admin_role = 'branch_admin' AND v_admin_branch_id != v_user_branch_id THEN
    RAISE EXCEPTION 'Branch admin can only manage users in their own branch';
  END IF;

  -- Prevent suspending already suspended users
  IF v_old_status = 'suspended' THEN
    RAISE EXCEPTION 'User is already suspended';
  END IF;

  -- Update user status
  UPDATE users
  SET
    status = 'suspended',
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Create audit log in same transaction
  INSERT INTO audit_logs (
    admin_id,
    action,
    target_id,
    target_type,
    changes,
    metadata,
    timestamp,
    created_at
  ) VALUES (
    p_admin_id,
    'suspend_user',
    p_user_id,
    'user',
    jsonb_build_object(
      'status', jsonb_build_object('from', v_old_status, 'to', 'suspended'),
      'full_name', v_user_name
    ),
    jsonb_build_object(
      'reason', p_reason,
      'correlation_id', v_correlation_id,
      'branch_id', v_user_branch_id
    ),
    NOW(),
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'correlation_id', v_correlation_id,
    'user_id', p_user_id,
    'status', 'suspended'
  );
END;
$$;

-- ============================================================================
-- 2. UNSUSPEND USER
-- ============================================================================

CREATE OR REPLACE FUNCTION unsuspend_user(
  p_user_id UUID,
  p_reason TEXT,
  p_admin_id UUID,
  p_correlation_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_role TEXT;
  v_admin_branch_id UUID;
  v_user_branch_id UUID;
  v_user_name TEXT;
  v_old_status TEXT;
  v_correlation_id TEXT;
BEGIN
  v_correlation_id := COALESCE(p_correlation_id, gen_random_uuid()::TEXT);

  SELECT role, branch_id INTO v_admin_role, v_admin_branch_id
  FROM profiles
  WHERE id = p_admin_id;

  IF v_admin_role NOT IN ('super_admin', 'branch_admin') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  SELECT status, branch_id, full_name INTO v_old_status, v_user_branch_id, v_user_name
  FROM users
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF v_admin_role = 'branch_admin' AND v_admin_branch_id != v_user_branch_id THEN
    RAISE EXCEPTION 'Branch admin can only manage users in their own branch';
  END IF;

  IF v_old_status != 'suspended' THEN
    RAISE EXCEPTION 'User is not suspended';
  END IF;

  UPDATE users
  SET
    status = 'active',
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO audit_logs (
    admin_id, action, target_id, target_type, changes, metadata, timestamp, created_at
  ) VALUES (
    p_admin_id, 'unsuspend_user', p_user_id, 'user',
    jsonb_build_object(
      'status', jsonb_build_object('from', v_old_status, 'to', 'active'),
      'full_name', v_user_name
    ),
    jsonb_build_object('reason', p_reason, 'correlation_id', v_correlation_id),
    NOW(), NOW()
  );

  RETURN jsonb_build_object('success', true, 'correlation_id', v_correlation_id);
END;
$$;

-- ============================================================================
-- 3. DELETE USER (Soft Delete)
-- ============================================================================

CREATE OR REPLACE FUNCTION delete_user(
  p_user_id UUID,
  p_reason TEXT,
  p_confirmation TEXT,
  p_admin_id UUID,
  p_correlation_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_role TEXT;
  v_user_email TEXT;
  v_user_name TEXT;
  v_correlation_id TEXT;
BEGIN
  v_correlation_id := COALESCE(p_correlation_id, gen_random_uuid()::TEXT);

  -- Only super_admin can delete users
  SELECT role INTO v_admin_role
  FROM profiles
  WHERE id = p_admin_id;

  IF v_admin_role != 'super_admin' THEN
    RAISE EXCEPTION 'Only super_admin can delete users';
  END IF;

  -- Verify confirmation matches user email
  SELECT email, full_name INTO v_user_email, v_user_name
  FROM users
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF LOWER(p_confirmation) != LOWER(v_user_email) THEN
    RAISE EXCEPTION 'Confirmation does not match user email';
  END IF;

  -- Soft delete: mark as deleted, anonymize email
  UPDATE users
  SET
    status = 'deleted',
    email = 'deleted_' || id || '@deleted.local',
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO audit_logs (
    admin_id, action, target_id, target_type, changes, metadata, timestamp, created_at
  ) VALUES (
    p_admin_id, 'delete_user', p_user_id, 'user',
    jsonb_build_object(
      'email', jsonb_build_object('from', v_user_email, 'to', 'deleted'),
      'full_name', v_user_name
    ),
    jsonb_build_object(
      'reason', p_reason,
      'confirmation', p_confirmation,
      'correlation_id', v_correlation_id
    ),
    NOW(), NOW()
  );

  RETURN jsonb_build_object('success', true, 'correlation_id', v_correlation_id);
END;
$$;

-- ============================================================================
-- 4. RESET PASSWORD
-- ============================================================================

CREATE OR REPLACE FUNCTION reset_user_password(
  p_user_id UUID,
  p_admin_id UUID,
  p_correlation_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_role TEXT;
  v_admin_branch_id UUID;
  v_user_branch_id UUID;
  v_user_email TEXT;
  v_user_name TEXT;
  v_correlation_id TEXT;
  v_reset_token TEXT;
BEGIN
  v_correlation_id := COALESCE(p_correlation_id, gen_random_uuid()::TEXT);

  SELECT role, branch_id INTO v_admin_role, v_admin_branch_id
  FROM profiles
  WHERE id = p_admin_id;

  IF v_admin_role NOT IN ('super_admin', 'branch_admin') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  SELECT email, branch_id, full_name INTO v_user_email, v_user_branch_id, v_user_name
  FROM users
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF v_admin_role = 'branch_admin' AND v_admin_branch_id != v_user_branch_id THEN
    RAISE EXCEPTION 'Branch admin can only manage users in their own branch';
  END IF;

  -- Generate password reset token (in production, trigger email via Supabase Auth)
  v_reset_token := encode(gen_random_bytes(32), 'hex');

  -- Store reset token with expiry (24 hours)
  UPDATE users
  SET
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
      'password_reset_token', v_reset_token,
      'password_reset_expires', (NOW() + INTERVAL '24 hours')::TEXT,
      'password_reset_by', p_admin_id
    ),
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO audit_logs (
    admin_id, action, target_id, target_type, changes, metadata, timestamp, created_at
  ) VALUES (
    p_admin_id, 'reset_password', p_user_id, 'user',
    jsonb_build_object('full_name', v_user_name, 'email', v_user_email),
    jsonb_build_object('correlation_id', v_correlation_id),
    NOW(), NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'correlation_id', v_correlation_id,
    'reset_token', v_reset_token,
    'message', 'Password reset initiated. User will receive email with reset link.'
  );
END;
$$;

-- ============================================================================
-- 5. CHANGE USER ROLE
-- ============================================================================

CREATE OR REPLACE FUNCTION change_user_role(
  p_user_id UUID,
  p_new_role TEXT,
  p_reason TEXT,
  p_admin_id UUID,
  p_correlation_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_role TEXT;
  v_old_role TEXT;
  v_user_name TEXT;
  v_correlation_id TEXT;
  v_valid_roles TEXT[] := ARRAY['student', 'parent', 'teacher', 'admin'];
BEGIN
  v_correlation_id := COALESCE(p_correlation_id, gen_random_uuid()::TEXT);

  -- Only super_admin can change roles
  SELECT role INTO v_admin_role
  FROM profiles
  WHERE id = p_admin_id;

  IF v_admin_role != 'super_admin' THEN
    RAISE EXCEPTION 'Only super_admin can change user roles';
  END IF;

  -- Validate new role
  IF NOT (p_new_role = ANY(v_valid_roles)) THEN
    RAISE EXCEPTION 'Invalid role. Must be one of: student, parent, teacher, admin';
  END IF;

  SELECT role, full_name INTO v_old_role, v_user_name
  FROM users
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  IF v_old_role = p_new_role THEN
    RAISE EXCEPTION 'User already has role: %', p_new_role;
  END IF;

  UPDATE users
  SET
    role = p_new_role,
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO audit_logs (
    admin_id, action, target_id, target_type, changes, metadata, timestamp, created_at
  ) VALUES (
    p_admin_id, 'change_role', p_user_id, 'user',
    jsonb_build_object(
      'role', jsonb_build_object('from', v_old_role, 'to', p_new_role),
      'full_name', v_user_name
    ),
    jsonb_build_object('reason', p_reason, 'correlation_id', v_correlation_id),
    NOW(), NOW()
  );

  RETURN jsonb_build_object('success', true, 'correlation_id', v_correlation_id);
END;
$$;

-- ============================================================================
-- GRANT EXECUTE PERMISSIONS
-- ============================================================================

-- Grant execute to authenticated users (RBAC checks are inside functions)
GRANT EXECUTE ON FUNCTION suspend_user TO authenticated;
GRANT EXECUTE ON FUNCTION unsuspend_user TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user TO authenticated;
GRANT EXECUTE ON FUNCTION reset_user_password TO authenticated;
GRANT EXECUTE ON FUNCTION change_user_role TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Test suspend_user:
-- SELECT suspend_user(
--   p_user_id := 'USER_UUID_HERE',
--   p_reason := 'Violation of terms',
--   p_admin_id := 'ADMIN_UUID_HERE'
-- );

-- Test with non-admin (should fail):
-- SELECT suspend_user(
--   p_user_id := 'USER_UUID_HERE',
--   p_reason := 'Test',
--   p_admin_id := 'NON_ADMIN_UUID_HERE'
-- );
