-- ================================================
-- Migration: 005 - Create Helper Functions
-- Description: Stored procedures and utility functions
-- Dependencies: All previous migrations
-- ================================================

-- ================================================
-- 1. Get Children for Parent Function
-- ================================================
CREATE OR REPLACE FUNCTION public.get_parent_children(p_user_id UUID)
RETURNS TABLE (
    child_id UUID,
    child_name TEXT,
    date_of_birth DATE,
    grade TEXT,
    section TEXT,
    roll_number TEXT,
    school_id UUID,
    school_name TEXT,
    relationship_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.full_name,
        c.date_of_birth,
        c.grade,
        c.section,
        c.roll_number,
        c.school_id,
        s.name AS school_name,
        pcr.relationship_type
    FROM public.children c
    INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
    INNER JOIN public.parents p ON pcr.parent_id = p.id
    LEFT JOIN public.schools s ON c.school_id = s.id
    WHERE p.user_id = p_user_id
    ORDER BY c.full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_parent_children IS 'Get all children for a parent user';

-- ================================================
-- 2. Calculate Attendance Percentage Function
-- ================================================
CREATE OR REPLACE FUNCTION public.calculate_attendance_percentage(
    p_child_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_days INTEGER;
    present_days INTEGER;
    percentage DECIMAL(5,2);
BEGIN
    SELECT COUNT(*) INTO total_days
    FROM public.attendance_records
    WHERE child_id = p_child_id
    AND date BETWEEN p_start_date AND p_end_date;

    IF total_days = 0 THEN
        RETURN 0;
    END IF;

    SELECT COUNT(*) INTO present_days
    FROM public.attendance_records
    WHERE child_id = p_child_id
    AND date BETWEEN p_start_date AND p_end_date
    AND status IN ('present', 'late');

    percentage := (present_days::DECIMAL / total_days::DECIMAL) * 100;
    RETURN ROUND(percentage, 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.calculate_attendance_percentage IS 'Calculate attendance percentage for a date range';

-- ================================================
-- 3. Get Academic Performance Summary Function
-- ================================================
CREATE OR REPLACE FUNCTION public.get_academic_performance_summary(
    p_child_id UUID,
    p_academic_year TEXT
)
RETURNS TABLE (
    subject TEXT,
    total_exams INTEGER,
    average_marks DECIMAL(5,2),
    highest_marks DECIMAL(5,2),
    lowest_marks DECIMAL(5,2),
    trend TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH exam_stats AS (
        SELECT
            ar.subject,
            COUNT(*) as exam_count,
            AVG(ar.marks_obtained) as avg_marks,
            MAX(ar.marks_obtained) as max_marks,
            MIN(ar.marks_obtained) as min_marks,
            CASE
                WHEN AVG(ar.marks_obtained) > LAG(AVG(ar.marks_obtained)) OVER (PARTITION BY ar.subject ORDER BY ar.exam_date)
                THEN 'improving'
                WHEN AVG(ar.marks_obtained) < LAG(AVG(ar.marks_obtained)) OVER (PARTITION BY ar.subject ORDER BY ar.exam_date)
                THEN 'declining'
                ELSE 'stable'
            END as performance_trend
        FROM public.academic_records ar
        WHERE ar.child_id = p_child_id
        AND ar.academic_year = p_academic_year
        GROUP BY ar.subject, ar.exam_date
    )
    SELECT
        subject,
        SUM(exam_count)::INTEGER,
        ROUND(AVG(avg_marks), 2),
        MAX(max_marks),
        MIN(min_marks),
        COALESCE(MAX(performance_trend), 'stable')
    FROM exam_stats
    GROUP BY subject;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.get_academic_performance_summary IS 'Get academic performance summary by subject';

-- ================================================
-- 4. Get Unread Notifications Count Function
-- ================================================
CREATE OR REPLACE FUNCTION public.get_unread_notifications_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*)::INTEGER INTO count
    FROM public.notifications
    WHERE user_id = p_user_id
    AND is_read = FALSE
    AND (expires_at IS NULL OR expires_at > NOW());

    RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_unread_notifications_count IS 'Get count of unread notifications for a user';

-- ================================================
-- 5. Mark Notification as Read Function
-- ================================================
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    updated BOOLEAN;
BEGIN
    UPDATE public.notifications
    SET is_read = TRUE,
        read_at = NOW()
    WHERE id = p_notification_id
    AND user_id = p_user_id
    AND is_read = FALSE;

    GET DIAGNOSTICS updated = ROW_COUNT;
    RETURN updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.mark_notification_read IS 'Mark a notification as read';

-- ================================================
-- 6. Get Financial Summary Function
-- ================================================
CREATE OR REPLACE FUNCTION public.get_financial_summary(
    p_parent_id UUID,
    p_academic_year TEXT
)
RETURNS TABLE (
    total_fees DECIMAL(10,2),
    total_paid DECIMAL(10,2),
    total_pending DECIMAL(10,2),
    overdue_amount DECIMAL(10,2),
    payment_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(ft.amount), 0) as total_fees,
        COALESCE(SUM(CASE WHEN ft.status = 'completed' THEN ft.amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN ft.status IN ('pending', 'processing') THEN ft.amount ELSE 0 END), 0) as total_pending,
        COALESCE(SUM(CASE WHEN ft.status = 'pending' AND ft.due_date < CURRENT_DATE THEN ft.amount ELSE 0 END), 0) as overdue_amount,
        COUNT(*)::INTEGER as payment_count
    FROM public.financial_transactions ft
    INNER JOIN public.children c ON ft.child_id = c.id
    INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
    WHERE pcr.parent_id = p_parent_id
    AND ft.academic_year = p_academic_year
    AND ft.transaction_type IN ('school_fee', 'exam_fee', 'library_fee', 'transport_fee', 'other_fee');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_financial_summary IS 'Get financial summary for a parent';

-- ================================================
-- 7. Get Upcoming Events Function
-- ================================================
CREATE OR REPLACE FUNCTION public.get_upcoming_events(
    p_user_id UUID,
    p_days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE (
    event_id UUID,
    event_type TEXT,
    title TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    child_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ce.id,
        ce.event_type,
        ce.title,
        ce.start_time,
        ce.end_time,
        ce.location,
        c.full_name as child_name
    FROM public.calendar_events ce
    LEFT JOIN public.children c ON ce.child_id = c.id
    LEFT JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
    LEFT JOIN public.parents p ON pcr.parent_id = p.id OR ce.parent_id = p.id
    WHERE p.user_id = p_user_id
    AND ce.start_time BETWEEN NOW() AND NOW() + (p_days_ahead || ' days')::INTERVAL
    AND ce.is_completed = FALSE
    ORDER BY ce.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_upcoming_events IS 'Get upcoming calendar events for a user';

-- ================================================
-- 8. Get Action Items Summary Function
-- ================================================
CREATE OR REPLACE FUNCTION public.get_action_items_summary(p_parent_id UUID)
RETURNS TABLE (
    total_items INTEGER,
    pending_items INTEGER,
    overdue_items INTEGER,
    completed_today INTEGER,
    high_priority_items INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_items,
        COUNT(CASE WHEN ai.status = 'pending' THEN 1 END)::INTEGER as pending_items,
        COUNT(CASE WHEN ai.status = 'pending' AND ai.due_date < CURRENT_DATE THEN 1 END)::INTEGER as overdue_items,
        COUNT(CASE WHEN ai.status = 'completed' AND ai.completed_at::DATE = CURRENT_DATE THEN 1 END)::INTEGER as completed_today,
        COUNT(CASE WHEN ai.priority IN ('high', 'urgent') AND ai.status != 'completed' THEN 1 END)::INTEGER as high_priority_items
    FROM public.action_items ai
    INNER JOIN public.children c ON ai.child_id = c.id
    INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
    WHERE pcr.parent_id = p_parent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_action_items_summary IS 'Get action items summary for a parent';

-- ================================================
-- 9. Update Attendance Summary Function
-- ================================================
CREATE OR REPLACE FUNCTION public.update_attendance_summary_for_month(
    p_child_id UUID,
    p_year INTEGER,
    p_month INTEGER
)
RETURNS VOID AS $$
DECLARE
    v_academic_year TEXT;
    v_total_days INTEGER;
    v_present_days INTEGER;
    v_absent_days INTEGER;
    v_late_days INTEGER;
    v_excused_days INTEGER;
    v_half_days INTEGER;
    v_total_late_minutes INTEGER;
    v_percentage DECIMAL(5,2);
BEGIN
    -- Determine academic year (April to March)
    IF p_month >= 4 THEN
        v_academic_year := p_year || '-' || (p_year + 1);
    ELSE
        v_academic_year := (p_year - 1) || '-' || p_year;
    END IF;

    -- Calculate statistics
    SELECT
        COUNT(*),
        COUNT(CASE WHEN status = 'present' THEN 1 END),
        COUNT(CASE WHEN status = 'absent' THEN 1 END),
        COUNT(CASE WHEN status = 'late' THEN 1 END),
        COUNT(CASE WHEN is_excused = TRUE THEN 1 END),
        COUNT(CASE WHEN status = 'half_day' THEN 1 END),
        COALESCE(SUM(late_by_minutes), 0)
    INTO
        v_total_days,
        v_present_days,
        v_absent_days,
        v_late_days,
        v_excused_days,
        v_half_days,
        v_total_late_minutes
    FROM public.attendance_records
    WHERE child_id = p_child_id
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;

    -- Calculate percentage
    IF v_total_days > 0 THEN
        v_percentage := (v_present_days::DECIMAL / v_total_days::DECIMAL) * 100;
    ELSE
        v_percentage := 0;
    END IF;

    -- Upsert summary
    INSERT INTO public.attendance_summary (
        child_id,
        academic_year,
        month,
        total_days,
        present_days,
        absent_days,
        late_days,
        excused_days,
        half_days,
        attendance_percentage,
        total_late_minutes
    ) VALUES (
        p_child_id,
        v_academic_year,
        p_month,
        v_total_days,
        v_present_days,
        v_absent_days,
        v_late_days,
        v_excused_days,
        v_half_days,
        ROUND(v_percentage, 2),
        v_total_late_minutes
    )
    ON CONFLICT (child_id, academic_year, month)
    DO UPDATE SET
        total_days = EXCLUDED.total_days,
        present_days = EXCLUDED.present_days,
        absent_days = EXCLUDED.absent_days,
        late_days = EXCLUDED.late_days,
        excused_days = EXCLUDED.excused_days,
        half_days = EXCLUDED.half_days,
        attendance_percentage = EXCLUDED.attendance_percentage,
        total_late_minutes = EXCLUDED.total_late_minutes,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_attendance_summary_for_month IS 'Update attendance summary for a specific month';

-- ================================================
-- 10. Get Child Dashboard Data Function
-- ================================================
CREATE OR REPLACE FUNCTION public.get_child_dashboard_data(p_child_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'child_info', (
            SELECT json_build_object(
                'id', c.id,
                'name', c.full_name,
                'grade', c.grade,
                'section', c.section,
                'school_name', s.name
            )
            FROM public.children c
            LEFT JOIN public.schools s ON c.school_id = s.id
            WHERE c.id = p_child_id
        ),
        'attendance', (
            SELECT json_build_object(
                'today_status', COALESCE(ar.status, 'not_marked'),
                'this_month_percentage', COALESCE(
                    (SELECT attendance_percentage
                     FROM public.attendance_summary
                     WHERE child_id = p_child_id
                     AND month = EXTRACT(MONTH FROM CURRENT_DATE)
                     AND academic_year LIKE '%' || EXTRACT(YEAR FROM CURRENT_DATE) || '%'
                    ), 0
                )
            )
            FROM public.attendance_records ar
            WHERE ar.child_id = p_child_id
            AND ar.date = CURRENT_DATE
            LIMIT 1
        ),
        'pending_homework', (
            SELECT COUNT(*)
            FROM public.homework_assignments
            WHERE child_id = p_child_id
            AND submission_status IN ('pending', 'in_progress')
            AND due_date >= CURRENT_DATE
        ),
        'upcoming_exams', (
            SELECT COUNT(*)
            FROM public.exam_schedule
            WHERE child_id = p_child_id
            AND is_completed = FALSE
            AND exam_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
        ),
        'unread_notifications', (
            SELECT COUNT(*)
            FROM public.notifications n
            INNER JOIN public.parents p ON n.user_id = p.user_id
            INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
            WHERE pcr.child_id = p_child_id
            AND n.is_read = FALSE
        ),
        'recent_ai_insights', (
            SELECT json_agg(json_build_object(
                'id', ai.id,
                'title', ai.title,
                'severity', ai.severity,
                'created_at', ai.created_at
            ))
            FROM (
                SELECT * FROM public.ai_insights
                WHERE child_id = p_child_id
                AND is_acknowledged = FALSE
                ORDER BY created_at DESC
                LIMIT 3
            ) ai
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_child_dashboard_data IS 'Get comprehensive dashboard data for a child';

-- ================================================
-- 11. Search Communications Function
-- ================================================
CREATE OR REPLACE FUNCTION public.search_communications(
    p_user_id UUID,
    p_search_term TEXT,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    communication_id UUID,
    subject TEXT,
    message TEXT,
    sender_type TEXT,
    sender_name TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    child_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cm.id,
        cm.subject,
        cm.message,
        cm.sender_type,
        cm.sender_name,
        cm.sent_at,
        c.full_name as child_name
    FROM public.communications cm
    LEFT JOIN public.children c ON cm.child_id = c.id
    LEFT JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
    LEFT JOIN public.parents p ON pcr.parent_id = p.id
    WHERE p.user_id = p_user_id
    AND (
        cm.subject ILIKE '%' || p_search_term || '%' OR
        cm.message ILIKE '%' || p_search_term || '%' OR
        cm.sender_name ILIKE '%' || p_search_term || '%'
    )
    ORDER BY cm.sent_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.search_communications IS 'Search communications by keyword';

-- ================================================
-- 12. Get Risk Factors for Child Function
-- ================================================
CREATE OR REPLACE FUNCTION public.get_active_risk_factors(p_child_id UUID)
RETURNS TABLE (
    risk_id UUID,
    risk_category TEXT,
    risk_level TEXT,
    title TEXT,
    description TEXT,
    impact_score DECIMAL(5,2),
    probability_score DECIMAL(5,2),
    detected_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        rf.id,
        rf.risk_category,
        rf.risk_level,
        rf.title,
        rf.description,
        rf.impact_score,
        rf.probability_score,
        rf.detected_at
    FROM public.risk_factors rf
    WHERE rf.child_id = p_child_id
    AND rf.is_active = TRUE
    ORDER BY
        CASE rf.risk_level
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'low' THEN 4
        END,
        rf.impact_score DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.get_active_risk_factors IS 'Get all active risk factors for a child sorted by priority';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_parent_children TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_attendance_percentage TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_academic_performance_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_notifications_count TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_financial_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_upcoming_events TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_action_items_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_attendance_summary_for_month TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_child_dashboard_data TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_communications TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_risk_factors TO authenticated;
