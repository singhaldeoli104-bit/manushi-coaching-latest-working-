-- ================================================
-- Migration: 006 - Create Triggers and Automations
-- Description: Automated notifications, data validations, and business logic triggers
-- Dependencies: All previous migrations
-- ================================================

-- ================================================
-- 1. Auto-create notification on new announcement
-- ================================================
CREATE OR REPLACE FUNCTION public.notify_on_new_announcement()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create notifications when announcement is published
    IF NEW.is_published = TRUE AND (OLD IS NULL OR OLD.is_published = FALSE) THEN
        INSERT INTO public.notifications (
            user_id,
            notification_type,
            title,
            message,
            priority,
            related_entity_type,
            related_entity_id,
            metadata
        )
        SELECT DISTINCT
            p.user_id,
            'announcement',
            NEW.title,
            SUBSTRING(NEW.content, 1, 200),
            CASE NEW.priority
                WHEN 'urgent' THEN 'high'
                WHEN 'high' THEN 'medium'
                ELSE 'low'
            END,
            'school_announcement',
            NEW.id,
            json_build_object(
                'announcement_type', NEW.announcement_type,
                'school_id', NEW.school_id
            )
        FROM public.parents p
        INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
        INNER JOIN public.children c ON pcr.child_id = c.id
        WHERE c.school_id = NEW.school_id
        AND (
            NEW.target_audience @> '["all"]'::jsonb OR
            NEW.target_audience @> '["parents"]'::jsonb
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_new_announcement
    AFTER INSERT OR UPDATE ON public.school_announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_new_announcement();

COMMENT ON FUNCTION public.notify_on_new_announcement IS 'Auto-create notifications when announcements are published';

-- ================================================
-- 2. Auto-update attendance summary on new record
-- ================================================
CREATE OR REPLACE FUNCTION public.auto_update_attendance_summary()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.update_attendance_summary_for_month(
        NEW.child_id,
        EXTRACT(YEAR FROM NEW.date)::INTEGER,
        EXTRACT(MONTH FROM NEW.date)::INTEGER
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_update_attendance_summary
    AFTER INSERT OR UPDATE OR DELETE ON public.attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_update_attendance_summary();

COMMENT ON FUNCTION public.auto_update_attendance_summary IS 'Auto-update attendance summary when records change';

-- ================================================
-- 3. Notify parent on low attendance
-- ================================================
CREATE OR REPLACE FUNCTION public.notify_on_low_attendance()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_user_ids UUID[];
BEGIN
    -- Check if attendance percentage dropped below 75%
    IF NEW.attendance_percentage < 75 THEN
        -- Get all parent user IDs for this child
        SELECT ARRAY_AGG(p.user_id)
        INTO v_parent_user_ids
        FROM public.parents p
        INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
        WHERE pcr.child_id = NEW.child_id;

        -- Create notification for each parent
        IF v_parent_user_ids IS NOT NULL THEN
            INSERT INTO public.notifications (
                user_id,
                notification_type,
                title,
                message,
                priority,
                related_entity_type,
                related_entity_id,
                metadata
            )
            SELECT
                unnest(v_parent_user_ids),
                'attendance_alert',
                'Low Attendance Alert',
                'Your child''s attendance has dropped to ' || NEW.attendance_percentage || '% this month.',
                'high',
                'attendance_summary',
                NEW.id,
                json_build_object(
                    'child_id', NEW.child_id,
                    'percentage', NEW.attendance_percentage,
                    'month', NEW.month,
                    'academic_year', NEW.academic_year
                );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_low_attendance
    AFTER INSERT OR UPDATE ON public.attendance_summary
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_low_attendance();

COMMENT ON FUNCTION public.notify_on_low_attendance IS 'Notify parents when attendance drops below 75%';

-- ================================================
-- 4. Notify on new AI insight
-- ================================================
CREATE OR REPLACE FUNCTION public.notify_on_ai_insight()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_user_ids UUID[];
BEGIN
    -- Only notify on high or critical insights
    IF NEW.severity IN ('high', 'critical') THEN
        SELECT ARRAY_AGG(p.user_id)
        INTO v_parent_user_ids
        FROM public.parents p
        INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
        WHERE pcr.child_id = NEW.child_id;

        IF v_parent_user_ids IS NOT NULL THEN
            INSERT INTO public.notifications (
                user_id,
                notification_type,
                title,
                message,
                priority,
                related_entity_type,
                related_entity_id,
                metadata
            )
            SELECT
                unnest(v_parent_user_ids),
                'ai_insight',
                'New AI Insight: ' || NEW.title,
                SUBSTRING(NEW.description, 1, 200),
                CASE NEW.severity
                    WHEN 'critical' THEN 'high'
                    WHEN 'high' THEN 'medium'
                    ELSE 'low'
                END,
                'ai_insight',
                NEW.id,
                json_build_object(
                    'child_id', NEW.child_id,
                    'insight_type', NEW.insight_type,
                    'severity', NEW.severity,
                    'confidence_score', NEW.confidence_score
                );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_ai_insight
    AFTER INSERT ON public.ai_insights
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_ai_insight();

COMMENT ON FUNCTION public.notify_on_ai_insight IS 'Notify parents on high/critical AI insights';

-- ================================================
-- 5. Notify on new risk factor
-- ================================================
CREATE OR REPLACE FUNCTION public.notify_on_risk_factor()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_user_ids UUID[];
BEGIN
    -- Only notify on high or critical risk levels
    IF NEW.risk_level IN ('high', 'critical') AND NEW.is_active = TRUE THEN
        SELECT ARRAY_AGG(p.user_id)
        INTO v_parent_user_ids
        FROM public.parents p
        INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
        WHERE pcr.child_id = NEW.child_id;

        IF v_parent_user_ids IS NOT NULL THEN
            INSERT INTO public.notifications (
                user_id,
                notification_type,
                title,
                message,
                priority,
                related_entity_type,
                related_entity_id,
                metadata
            )
            SELECT
                unnest(v_parent_user_ids),
                'risk_alert',
                'Risk Alert: ' || NEW.title,
                SUBSTRING(NEW.description, 1, 200),
                'high',
                'risk_factor',
                NEW.id,
                json_build_object(
                    'child_id', NEW.child_id,
                    'risk_category', NEW.risk_category,
                    'risk_level', NEW.risk_level,
                    'impact_score', NEW.impact_score
                );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_risk_factor
    AFTER INSERT ON public.risk_factors
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_risk_factor();

COMMENT ON FUNCTION public.notify_on_risk_factor IS 'Notify parents on high/critical risk factors';

-- ================================================
-- 6. Notify on upcoming exam
-- ================================================
CREATE OR REPLACE FUNCTION public.notify_on_upcoming_exam()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_user_ids UUID[];
    v_days_until_exam INTEGER;
BEGIN
    v_days_until_exam := NEW.exam_date - CURRENT_DATE;

    -- Notify 7 days before, 3 days before, and 1 day before
    IF v_days_until_exam IN (7, 3, 1) THEN
        SELECT ARRAY_AGG(p.user_id)
        INTO v_parent_user_ids
        FROM public.parents p
        INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
        WHERE pcr.child_id = NEW.child_id;

        IF v_parent_user_ids IS NOT NULL THEN
            INSERT INTO public.notifications (
                user_id,
                notification_type,
                title,
                message,
                priority,
                related_entity_type,
                related_entity_id,
                metadata
            )
            SELECT
                unnest(v_parent_user_ids),
                'exam_reminder',
                'Upcoming Exam: ' || NEW.subject,
                NEW.exam_name || ' is in ' || v_days_until_exam || ' day(s)',
                CASE v_days_until_exam
                    WHEN 1 THEN 'high'
                    ELSE 'medium'
                END,
                'exam_schedule',
                NEW.id,
                json_build_object(
                    'child_id', NEW.child_id,
                    'subject', NEW.subject,
                    'exam_date', NEW.exam_date,
                    'days_until_exam', v_days_until_exam
                );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger would need to be called by a scheduled job (cron)
-- For now, we'll create the function and trigger it manually or via pg_cron

COMMENT ON FUNCTION public.notify_on_upcoming_exam IS 'Notify parents about upcoming exams (7, 3, 1 days before)';

-- ================================================
-- 7. Notify on overdue homework
-- ================================================
CREATE OR REPLACE FUNCTION public.notify_on_overdue_homework()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_user_ids UUID[];
BEGIN
    -- Check if homework just became overdue
    IF NEW.submission_status IN ('pending', 'in_progress') AND NEW.due_date < CURRENT_DATE THEN
        SELECT ARRAY_AGG(p.user_id)
        INTO v_parent_user_ids
        FROM public.parents p
        INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
        WHERE pcr.child_id = NEW.child_id;

        IF v_parent_user_ids IS NOT NULL THEN
            INSERT INTO public.notifications (
                user_id,
                notification_type,
                title,
                message,
                priority,
                related_entity_type,
                related_entity_id,
                metadata
            )
            SELECT
                unnest(v_parent_user_ids),
                'homework_overdue',
                'Overdue Homework: ' || NEW.subject,
                NEW.title || ' was due on ' || NEW.due_date,
                'medium',
                'homework_assignment',
                NEW.id,
                json_build_object(
                    'child_id', NEW.child_id,
                    'subject', NEW.subject,
                    'due_date', NEW.due_date
                );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_on_overdue_homework
    AFTER INSERT OR UPDATE ON public.homework_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_overdue_homework();

COMMENT ON FUNCTION public.notify_on_overdue_homework IS 'Notify parents when homework becomes overdue';

-- ================================================
-- 8. Notify on fee due date approaching
-- ================================================
CREATE OR REPLACE FUNCTION public.notify_on_fee_due()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_user_ids UUID[];
    v_days_until_due INTEGER;
BEGIN
    -- Only for pending fees
    IF NEW.status = 'pending' AND NEW.due_date IS NOT NULL THEN
        v_days_until_due := NEW.due_date - CURRENT_DATE;

        -- Notify 7 days before and 1 day before
        IF v_days_until_due IN (7, 1) THEN
            SELECT ARRAY_AGG(DISTINCT p.user_id)
            INTO v_parent_user_ids
            FROM public.parents p
            INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
            WHERE pcr.child_id = NEW.child_id;

            IF v_parent_user_ids IS NOT NULL THEN
                INSERT INTO public.notifications (
                    user_id,
                    notification_type,
                    title,
                    message,
                    priority,
                    related_entity_type,
                    related_entity_id,
                    metadata
                )
                SELECT
                    unnest(v_parent_user_ids),
                    'fee_reminder',
                    'Fee Payment Reminder',
                    NEW.description || ' of ₹' || NEW.amount || ' is due in ' || v_days_until_due || ' day(s)',
                    CASE v_days_until_due
                        WHEN 1 THEN 'high'
                        ELSE 'medium'
                    END,
                    'financial_transaction',
                    NEW.id,
                    json_build_object(
                        'child_id', NEW.child_id,
                        'amount', NEW.amount,
                        'due_date', NEW.due_date,
                        'transaction_type', NEW.transaction_type
                    );
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This also needs scheduled job execution

COMMENT ON FUNCTION public.notify_on_fee_due IS 'Notify parents about upcoming fee due dates';

-- ================================================
-- 9. Auto-create action item from recommended action
-- ================================================
CREATE OR REPLACE FUNCTION public.create_action_item_from_recommendation()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_ids UUID[];
BEGIN
    -- Only create action items for high/urgent priority recommendations
    IF NEW.priority IN ('high', 'urgent') AND NEW.status = 'pending' THEN
        -- Get parent IDs
        SELECT ARRAY_AGG(pcr.parent_id)
        INTO v_parent_ids
        FROM public.parent_child_relationships pcr
        WHERE pcr.child_id = NEW.child_id;

        IF v_parent_ids IS NOT NULL THEN
            -- Create action item for each parent
            INSERT INTO public.action_items (
                child_id,
                parent_id,
                action_type,
                title,
                description,
                priority,
                due_date,
                status,
                metadata
            )
            SELECT
                NEW.child_id,
                unnest(v_parent_ids),
                'follow_up',
                NEW.title,
                NEW.description,
                NEW.priority,
                NEW.due_date,
                'pending',
                json_build_object(
                    'source', 'recommended_action',
                    'recommended_action_id', NEW.id,
                    'action_type', NEW.action_type
                );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_action_item_from_recommendation
    AFTER INSERT ON public.recommended_actions
    FOR EACH ROW
    EXECUTE FUNCTION public.create_action_item_from_recommendation();

COMMENT ON FUNCTION public.create_action_item_from_recommendation IS 'Auto-create action items from high priority recommendations';

-- ================================================
-- 10. Validate financial transaction amount
-- ================================================
CREATE OR REPLACE FUNCTION public.validate_financial_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure amount is positive
    IF NEW.amount <= 0 THEN
        RAISE EXCEPTION 'Transaction amount must be positive';
    END IF;

    -- Validate payment method for completed transactions
    IF NEW.status = 'completed' AND NEW.payment_method IS NULL THEN
        RAISE EXCEPTION 'Payment method is required for completed transactions';
    END IF;

    -- Auto-set transaction date if not provided
    IF NEW.transaction_date IS NULL AND NEW.status = 'completed' THEN
        NEW.transaction_date := NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_financial_transaction
    BEFORE INSERT OR UPDATE ON public.financial_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_financial_transaction();

COMMENT ON FUNCTION public.validate_financial_transaction IS 'Validate financial transaction data before insert/update';

-- ================================================
-- 11. Auto-sync calendar event from school event
-- ================================================
CREATE OR REPLACE FUNCTION public.sync_school_event_to_calendar()
RETURNS TRIGGER AS $$
BEGIN
    -- When school event is created or updated, sync to parent calendars
    IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.is_cancelled = FALSE AND NEW.is_cancelled = FALSE)) THEN
        -- Delete existing synced events for this school event
        DELETE FROM public.calendar_events
        WHERE school_event_id = NEW.id;

        -- Create new calendar events for all relevant parents
        INSERT INTO public.calendar_events (
            school_id,
            parent_id,
            event_type,
            title,
            description,
            start_time,
            end_time,
            is_all_day,
            location,
            is_synced_from_school,
            school_event_id,
            metadata
        )
        SELECT DISTINCT
            NEW.school_id,
            p.id,
            'school_event',
            NEW.title,
            NEW.description,
            NEW.start_date,
            NEW.end_date,
            NEW.is_all_day,
            NEW.location,
            TRUE,
            NEW.id,
            json_build_object(
                'event_type', NEW.event_type,
                'organizer', NEW.organizer
            )
        FROM public.parents p
        INNER JOIN public.parent_child_relationships pcr ON p.id = pcr.parent_id
        INNER JOIN public.children c ON pcr.child_id = c.id
        WHERE c.school_id = NEW.school_id
        AND (
            NEW.target_audience @> '["all"]'::jsonb OR
            NEW.target_audience @> '["parents"]'::jsonb
        );
    END IF;

    -- When school event is cancelled, mark calendar events as cancelled
    IF TG_OP = 'UPDATE' AND OLD.is_cancelled = FALSE AND NEW.is_cancelled = TRUE THEN
        DELETE FROM public.calendar_events
        WHERE school_event_id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_school_event_to_calendar
    AFTER INSERT OR UPDATE ON public.school_events
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_school_event_to_calendar();

COMMENT ON FUNCTION public.sync_school_event_to_calendar IS 'Auto-sync school events to parent calendars';

-- ================================================
-- 12. Increment announcement view count
-- ================================================
CREATE OR REPLACE FUNCTION public.increment_announcement_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.school_announcements
    SET view_count = view_count + 1
    WHERE id = NEW.announcement_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_announcement_views
    AFTER INSERT ON public.announcement_reads
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_announcement_views();

COMMENT ON FUNCTION public.increment_announcement_views IS 'Increment announcement view count when read';

-- ================================================
-- 13. Increment document download count
-- ================================================
CREATE OR REPLACE FUNCTION public.increment_document_downloads()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.school_documents
    SET download_count = download_count + 1
    WHERE id = NEW.document_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_document_downloads
    AFTER INSERT ON public.document_downloads
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_document_downloads();

COMMENT ON FUNCTION public.increment_document_downloads IS 'Increment document download count';

-- ================================================
-- 14. Update event participant count
-- ================================================
CREATE OR REPLACE FUNCTION public.update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current participants count for the event
    IF TG_OP = 'INSERT' AND NEW.response = 'attending' THEN
        UPDATE public.school_events
        SET current_participants = current_participants + (1 + COALESCE(NEW.number_of_guests, 0))
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.response != 'attending' AND NEW.response = 'attending' THEN
            UPDATE public.school_events
            SET current_participants = current_participants + (1 + COALESCE(NEW.number_of_guests, 0))
            WHERE id = NEW.event_id;
        ELSIF OLD.response = 'attending' AND NEW.response != 'attending' THEN
            UPDATE public.school_events
            SET current_participants = GREATEST(0, current_participants - (1 + COALESCE(OLD.number_of_guests, 0)))
            WHERE id = NEW.event_id;
        ELSIF OLD.response = 'attending' AND NEW.response = 'attending' AND OLD.number_of_guests != NEW.number_of_guests THEN
            UPDATE public.school_events
            SET current_participants = current_participants + (COALESCE(NEW.number_of_guests, 0) - COALESCE(OLD.number_of_guests, 0))
            WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.response = 'attending' THEN
        UPDATE public.school_events
        SET current_participants = GREATEST(0, current_participants - (1 + COALESCE(OLD.number_of_guests, 0)))
        WHERE id = OLD.event_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON public.event_rsvps
    FOR EACH ROW
    EXECUTE FUNCTION public.update_event_participant_count();

COMMENT ON FUNCTION public.update_event_participant_count IS 'Auto-update event participant count based on RSVPs';
