-- ================================================
-- Migration: 007 - Create Seed Data
-- Description: Sample data for development and testing
-- Dependencies: All previous migrations
-- NOTE: This file should only be run in development/staging environments
-- ================================================

-- WARNING: This script will insert test data. Do NOT run in production!

-- ================================================
-- 1. Sample Schools
-- ================================================
INSERT INTO public.schools (id, name, address, city, state, postal_code, country, phone, email, principal_name, affiliation, board, metadata)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Delhi Public School', 'Mathura Road', 'New Delhi', 'Delhi', '110001', 'India', '+91-11-2323-4567', 'info@dps.edu.in', 'Dr. Rajesh Kumar', 'CBSE', 'CBSE', '{"established": 1949, "student_count": 5000}'::jsonb),
    ('00000000-0000-0000-0000-000000000002', 'Modern School', 'Barakhamba Road', 'New Delhi', 'Delhi', '110001', 'India', '+91-11-2331-7580', 'contact@modernschool.net', 'Ms. Priya Sharma', 'CBSE', 'CBSE', '{"established": 1920, "student_count": 3500}'::jsonb),
    ('00000000-0000-0000-0000-000000000003', 'Ryan International School', 'Sector 31', 'Noida', 'Uttar Pradesh', '201301', 'India', '+91-120-2534-567', 'info@ryangroup.org', 'Mr. Amit Patel', 'CBSE', 'CBSE', '{"established": 1976, "student_count": 4200}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 2. Sample Test Users & Parents
-- NOTE: In real environment, users would be created via Supabase Auth
-- This is just for reference - actual user_id values would come from auth.users
-- ================================================
-- Assuming test users exist in auth.users with these IDs:
-- Parent 1: '10000000-0000-0000-0000-000000000001'
-- Parent 2: '10000000-0000-0000-0000-000000000002'
-- Parent 3: '10000000-0000-0000-0000-000000000003'

INSERT INTO public.parents (id, user_id, full_name, email, phone, address, city, state, postal_code, country, occupation, metadata)
VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Rajesh Sharma', 'rajesh.sharma@email.com', '+91-98765-43210', 'A-101, Vasant Vihar', 'New Delhi', 'Delhi', '110057', 'India', 'Software Engineer', '{"preferred_language": "en", "emergency_contact": "+91-98765-43211"}'::jsonb),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Priya Verma', 'priya.verma@email.com', '+91-98765-43220', 'B-202, Greater Kailash', 'New Delhi', 'Delhi', '110048', 'India', 'Doctor', '{"preferred_language": "en", "emergency_contact": "+91-98765-43221"}'::jsonb),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Amit Patel', 'amit.patel@email.com', '+91-98765-43230', 'C-303, Sector 62', 'Noida', 'Uttar Pradesh', '201309', 'India', 'Business Owner', '{"preferred_language": "hi", "emergency_contact": "+91-98765-43231"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 3. Sample Children
-- ================================================
INSERT INTO public.children (id, school_id, full_name, date_of_birth, grade, section, roll_number, admission_number, blood_group, gender, address, city, state, postal_code, country, medical_conditions, emergency_contact_name, emergency_contact_phone, metadata)
VALUES
    ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Aarav Sharma', '2012-05-15', '8', 'A', '08A15', 'DPS2020-1234', 'O+', 'male', 'A-101, Vasant Vihar', 'New Delhi', 'Delhi', '110057', 'India', NULL, 'Sunita Sharma', '+91-98765-43211', '{"allergies": [], "special_needs": null}'::jsonb),
    ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Diya Sharma', '2014-08-22', '6', 'B', '06B22', 'DPS2022-5678', 'A+', 'female', 'A-101, Vasant Vihar', 'New Delhi', 'Delhi', '110057', 'India', 'Asthma (mild)', 'Sunita Sharma', '+91-98765-43211', '{"allergies": ["peanuts"], "special_needs": null}'::jsonb),
    ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Arjun Verma', '2011-11-30', '9', 'A', '09A10', 'MS2019-9876', 'B+', 'male', 'B-202, Greater Kailash', 'New Delhi', 'Delhi', '110048', 'India', NULL, 'Vikram Verma', '+91-98765-43221', '{"allergies": [], "special_needs": null}'::jsonb),
    ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Ananya Patel', '2013-03-10', '7', 'C', '07C15', 'RYAN2021-4321', 'AB+', 'female', 'C-303, Sector 62', 'Noida', 'Uttar Pradesh', '201309', 'India', NULL, 'Neha Patel', '+91-98765-43231', '{"allergies": [], "special_needs": null}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 4. Parent-Child Relationships
-- ================================================
INSERT INTO public.parent_child_relationships (parent_id, child_id, relationship_type, is_primary_contact, is_emergency_contact, metadata)
VALUES
    ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'father', TRUE, TRUE, '{}'::jsonb),
    ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'father', TRUE, TRUE, '{}'::jsonb),
    ('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', 'mother', TRUE, TRUE, '{}'::jsonb),
    ('20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004', 'father', TRUE, TRUE, '{}'::jsonb)
ON CONFLICT (parent_id, child_id) DO NOTHING;

-- ================================================
-- 5. Sample Academic Records
-- ================================================
INSERT INTO public.academic_records (child_id, academic_year, term, exam_type, exam_name, exam_date, subject, total_marks, marks_obtained, grade, rank, teacher_remarks, metadata)
VALUES
    ('30000000-0000-0000-0000-000000000001', '2024-2025', 'First', 'midterm', 'Mid Term Examination', '2024-09-15', 'Mathematics', 100, 85, 'A', 5, 'Excellent performance', '{"difficulty_level": "medium"}'::jsonb),
    ('30000000-0000-0000-0000-000000000001', '2024-2025', 'First', 'midterm', 'Mid Term Examination', '2024-09-16', 'Science', 100, 78, 'B+', 12, 'Good effort', '{"difficulty_level": "medium"}'::jsonb),
    ('30000000-0000-0000-0000-000000000001', '2024-2025', 'First', 'midterm', 'Mid Term Examination', '2024-09-17', 'English', 100, 92, 'A+', 2, 'Outstanding', '{"difficulty_level": "medium"}'::jsonb),
    ('30000000-0000-0000-0000-000000000002', '2024-2025', 'First', 'midterm', 'Mid Term Examination', '2024-09-15', 'Mathematics', 100, 95, 'A+', 1, 'Exceptional work', '{"difficulty_level": "medium"}'::jsonb),
    ('30000000-0000-0000-0000-000000000003', '2024-2025', 'First', 'midterm', 'Mid Term Examination', '2024-09-15', 'Physics', 100, 72, 'B', 18, 'Needs improvement in conceptual understanding', '{"difficulty_level": "hard"}'::jsonb)
ON CONFLICT DO NOTHING;

-- ================================================
-- 6. Sample Attendance Records (Last 30 days)
-- ================================================
DO $$
DECLARE
    child_ids UUID[] := ARRAY[
        '30000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000002',
        '30000000-0000-0000-0000-000000000003',
        '30000000-0000-0000-0000-000000000004'
    ];
    child_id UUID;
    day_offset INTEGER;
    attendance_date DATE;
    random_status TEXT;
BEGIN
    FOREACH child_id IN ARRAY child_ids
    LOOP
        FOR day_offset IN 0..29
        LOOP
            attendance_date := CURRENT_DATE - day_offset;

            -- Skip weekends
            IF EXTRACT(DOW FROM attendance_date) NOT IN (0, 6) THEN
                -- 90% present, 5% late, 3% absent, 2% half_day
                random_status := CASE
                    WHEN random() < 0.90 THEN 'present'
                    WHEN random() < 0.95 THEN 'late'
                    WHEN random() < 0.98 THEN 'absent'
                    ELSE 'half_day'
                END;

                INSERT INTO public.attendance_records (child_id, date, status, check_in_time, check_out_time, late_by_minutes, period_type)
                VALUES (
                    child_id,
                    attendance_date,
                    random_status,
                    CASE WHEN random_status IN ('present', 'late', 'half_day') THEN '08:00:00'::TIME ELSE NULL END,
                    CASE WHEN random_status IN ('present', 'half_day') THEN '14:00:00'::TIME ELSE NULL END,
                    CASE WHEN random_status = 'late' THEN (random() * 30)::INTEGER ELSE NULL END,
                    'full_day'
                )
                ON CONFLICT (child_id, date, period_type) DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- ================================================
-- 7. Sample Financial Transactions
-- ================================================
INSERT INTO public.financial_transactions (child_id, transaction_type, description, amount, currency, status, payment_method, transaction_date, due_date, academic_year, term, metadata)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'school_fee', 'Tuition Fee - Q1', 25000.00, 'INR', 'completed', 'upi', '2024-04-05', '2024-04-01', '2024-2025', 'First', '{"payment_id": "pay_123456"}'::jsonb),
    ('30000000-0000-0000-0000-000000000001', 'school_fee', 'Tuition Fee - Q2', 25000.00, 'INR', 'completed', 'upi', '2024-07-03', '2024-07-01', '2024-2025', 'Second', '{"payment_id": "pay_234567"}'::jsonb),
    ('30000000-0000-0000-0000-000000000001', 'school_fee', 'Tuition Fee - Q3', 25000.00, 'INR', 'pending', NULL, NULL, '2024-10-01', '2024-2025', 'Third', '{}'::jsonb),
    ('30000000-0000-0000-0000-000000000002', 'school_fee', 'Tuition Fee - Q1', 22000.00, 'INR', 'completed', 'card', '2024-04-02', '2024-04-01', '2024-2025', 'First', '{"payment_id": "pay_345678"}'::jsonb),
    ('30000000-0000-0000-0000-000000000003', 'exam_fee', 'Board Exam Fee', 3500.00, 'INR', 'completed', 'upi', '2024-08-15', '2024-08-10', '2024-2025', 'Annual', '{"payment_id": "pay_456789"}'::jsonb)
ON CONFLICT DO NOTHING;

-- ================================================
-- 8. Sample AI Insights
-- ================================================
INSERT INTO public.ai_insights (child_id, insight_type, title, description, severity, confidence_score, ai_model_version, data_sources, is_acknowledged)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'academic', 'Strong Mathematical Aptitude', 'Aarav shows consistent high performance in mathematics with strong problem-solving skills. Consider advanced mathematics programs.', 'low', 92.5, 'v1.2.3', '["academic_records", "homework_completion"]'::jsonb, FALSE),
    ('30000000-0000-0000-0000-000000000002', 'behavioral', 'Excellent Classroom Participation', 'Diya demonstrates active participation and engagement in classroom discussions.', 'low', 88.0, 'v1.2.3', '["attendance_records", "teacher_feedback"]'::jsonb, TRUE),
    ('30000000-0000-0000-0000-000000000003', 'academic', 'Physics Conceptual Gap', 'Arjun may benefit from additional support in physics conceptual understanding.', 'medium', 85.0, 'v1.2.3', '["academic_records", "exam_performance"]'::jsonb, FALSE)
ON CONFLICT DO NOTHING;

-- ================================================
-- 9. Sample Risk Factors
-- ================================================
INSERT INTO public.risk_factors (child_id, risk_category, risk_level, title, description, indicators, impact_score, probability_score, is_active)
VALUES
    ('30000000-0000-0000-0000-000000000003', 'academic_decline', 'medium', 'Physics Performance Decline', 'Marks in physics have dropped from 85% to 72% over last two exams.', '["declining_grades", "low_homework_completion"]'::jsonb, 65.0, 70.0, TRUE)
ON CONFLICT DO NOTHING;

-- ================================================
-- 10. Sample Opportunities
-- ================================================
INSERT INTO public.opportunities (child_id, opportunity_type, title, description, potential_impact, confidence_score, evidence, recommended_actions)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'academic_strength', 'Mathematics Olympiad Candidate', 'Based on consistent high performance, Aarav is a strong candidate for national mathematics olympiads.', 'high', 88.0, '["math_scores", "problem_solving_skills"]'::jsonb, '["Enroll in olympiad coaching", "Practice with previous papers"]'::jsonb),
    ('30000000-0000-0000-0000-000000000002', 'talent', 'Debate Competition Potential', 'Excellent communication skills and confidence suggest potential in debate competitions.', 'medium', 82.0, '["classroom_participation", "presentation_skills"]'::jsonb, '["Join debate club", "Participate in inter-school competitions"]'::jsonb)
ON CONFLICT DO NOTHING;

-- ================================================
-- 11. Sample School Announcements
-- ================================================
INSERT INTO public.school_announcements (school_id, title, content, announcement_type, priority, target_audience, is_published, published_at, author_name, author_role)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Parent-Teacher Meeting', 'Dear Parents, The quarterly parent-teacher meeting is scheduled for October 20, 2024. Please mark your calendars.', 'event', 'high', '["parents"]'::jsonb, TRUE, NOW(), 'Principal Office', 'administrator'),
    ('00000000-0000-0000-0000-000000000001', 'Diwali Holiday Notice', 'The school will remain closed from October 28 to November 3 for Diwali celebrations.', 'general', 'normal', '["all"]'::jsonb, TRUE, NOW() - INTERVAL '2 days', 'Admin Department', 'administrator'),
    ('00000000-0000-0000-0000-000000000002', 'Science Exhibition', 'Annual Science Exhibition will be held on November 15. Students are encouraged to participate.', 'academic', 'normal', '["students", "parents"]'::jsonb, TRUE, NOW() - INTERVAL '1 day', 'Science Department', 'teacher')
ON CONFLICT DO NOTHING;

-- ================================================
-- 12. Sample School Contacts
-- ================================================
INSERT INTO public.school_contacts (school_id, contact_type, name, title, department, email, phone, is_primary, is_active)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'principal', 'Dr. Rajesh Kumar', 'Principal', 'Administration', 'principal@dps.edu.in', '+91-11-2323-4567', TRUE, TRUE),
    ('00000000-0000-0000-0000-000000000001', 'administrative', 'Ms. Sunita Malhotra', 'Office Manager', 'Administration', 'office@dps.edu.in', '+91-11-2323-4568', TRUE, TRUE),
    ('00000000-0000-0000-0000-000000000002', 'principal', 'Ms. Priya Sharma', 'Principal', 'Administration', 'principal@modernschool.net', '+91-11-2331-7580', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- ================================================
-- 13. Sample Homework Assignments
-- ================================================
INSERT INTO public.homework_assignments (child_id, subject, title, description, assigned_date, due_date, priority, estimated_duration_minutes, assignment_type, submission_status)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'Mathematics', 'Chapter 5 - Algebra Practice', 'Complete exercises 5.1 to 5.3 from textbook', CURRENT_DATE - 2, CURRENT_DATE + 1, 'high', 60, 'homework', 'in_progress'),
    ('30000000-0000-0000-0000-000000000001', 'Science', 'Project: Solar System Model', 'Create a 3D model of the solar system', CURRENT_DATE - 7, CURRENT_DATE + 7, 'medium', 240, 'project', 'pending'),
    ('30000000-0000-0000-0000-000000000002', 'English', 'Essay: My Favorite Book', 'Write a 500-word essay about your favorite book', CURRENT_DATE - 1, CURRENT_DATE + 2, 'medium', 45, 'homework', 'pending')
ON CONFLICT DO NOTHING;

-- ================================================
-- 14. Sample Exam Schedule
-- ================================================
INSERT INTO public.exam_schedule (child_id, exam_name, subject, exam_type, exam_date, start_time, duration_minutes, total_marks, passing_marks, preparation_status, is_completed)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'Final Term Examination', 'Mathematics', 'final', CURRENT_DATE + 15, '09:00:00', 180, 100, 33, 'in_progress', FALSE),
    ('30000000-0000-0000-0000-000000000001', 'Final Term Examination', 'Science', 'final', CURRENT_DATE + 17, '09:00:00', 180, 100, 33, 'in_progress', FALSE),
    ('30000000-0000-0000-0000-000000000003', 'Board Examination', 'Physics', 'standardized', CURRENT_DATE + 30, '09:00:00', 180, 100, 33, 'not_started', FALSE)
ON CONFLICT DO NOTHING;

-- ================================================
-- 15. Sample Notifications
-- ================================================
INSERT INTO public.notifications (user_id, notification_type, title, message, priority, related_entity_type, related_entity_id, is_read)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'announcement', 'Parent-Teacher Meeting', 'Dear Parents, The quarterly parent-teacher meeting is scheduled for October 20, 2024.', 'medium', 'school_announcement', (SELECT id FROM public.school_announcements LIMIT 1), FALSE),
    ('10000000-0000-0000-0000-000000000001', 'homework_overdue', 'Homework Reminder', 'Mathematics homework is due tomorrow', 'low', 'homework_assignment', (SELECT id FROM public.homework_assignments WHERE subject = 'Mathematics' LIMIT 1), FALSE),
    ('10000000-0000-0000-0000-000000000002', 'ai_insight', 'New AI Insight: Physics Conceptual Gap', 'Arjun may benefit from additional support in physics conceptual understanding.', 'medium', 'ai_insight', (SELECT id FROM public.ai_insights WHERE insight_type = 'academic' LIMIT 1), FALSE)
ON CONFLICT DO NOTHING;

-- ================================================
-- 16. Sample Communications
-- ================================================
INSERT INTO public.communications (child_id, communication_type, direction, sender_type, sender_name, sender_email, subject, message, is_read, sent_at)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'general', 'inbound', 'teacher', 'Mrs. Kavita Singh', 'kavita.singh@dps.edu.in', 'Excellent Progress in Mathematics', 'Dear Mr. Sharma, I wanted to share that Aarav has shown exceptional progress in mathematics this term. Keep up the good work!', TRUE, NOW() - INTERVAL '2 days'),
    ('30000000-0000-0000-0000-000000000002', 'attendance', 'inbound', 'admin', 'School Office', 'office@dps.edu.in', 'Attendance Notification', 'Diya was absent on October 10, 2024. Please confirm if this was a planned leave.', FALSE, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- ================================================
-- 17. Sample Action Items
-- ================================================
INSERT INTO public.action_items (child_id, parent_id, action_type, title, description, priority, due_date, status)
VALUES
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'form_submission', 'Submit Annual Sports Form', 'Complete and submit the annual sports consent form by the due date', 'medium', CURRENT_DATE + 7, 'pending'),
    ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'academic_support', 'Arrange Physics Tutoring', 'Consider arranging additional physics tutoring to address conceptual gaps', 'high', CURRENT_DATE + 14, 'pending')
ON CONFLICT DO NOTHING;

-- ================================================
-- Summary
-- ================================================
DO $$
BEGIN
    RAISE NOTICE 'Seed data created successfully!';
    RAISE NOTICE 'Created:';
    RAISE NOTICE '  - 3 schools';
    RAISE NOTICE '  - 3 parents';
    RAISE NOTICE '  - 4 children';
    RAISE NOTICE '  - 4 parent-child relationships';
    RAISE NOTICE '  - Academic records, attendance, finances, and more';
    RAISE NOTICE '';
    RAISE NOTICE 'Test Parent Credentials (user_id):';
    RAISE NOTICE '  - Rajesh Sharma: 10000000-0000-0000-0000-000000000001';
    RAISE NOTICE '  - Priya Verma: 10000000-0000-0000-0000-000000000002';
    RAISE NOTICE '  - Amit Patel: 10000000-0000-0000-0000-000000000003';
    RAISE NOTICE '';
    RAISE NOTICE 'Note: You will need to create corresponding users in Supabase Auth with these UUIDs';
END $$;
