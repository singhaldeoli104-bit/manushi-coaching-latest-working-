-- ============================================================================
-- MANUSHI COACHING PLATFORM - PARENT SECTION DATABASE SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Created: 2025-10-19
-- Description: Complete database schema for parent section with AI insights,
--              analytics, communications, and financial tracking
-- ============================================================================

-- ============================================================================
-- ENTITY-RELATIONSHIP DIAGRAM (ERD)
-- ============================================================================
--
--  ┌─────────────┐         ┌─────────────────────────┐         ┌──────────────┐
--  │  profiles   │◄────────┤parent_child_relationships├────────►│   students   │
--  │  (auth)     │         │  (many-to-many bridge)  │         │              │
--  └─────────────┘         └─────────────────────────┘         └──────────────┘
--        │                              │                              │
--        │ 1:1                          │                              │
--        ▼                              │                              │
--  ┌─────────────┐                      │                              │
--  │   parents   │                      │                              │
--  │  (extended  │                      │                              │
--  │   profile)  │                      │                              │
--  └─────────────┘                      │                              │
--        │                              │                              │
--        │ 1:N                          │                              │
--        ├──────────────────────────────┼──────────────────────────────┤
--        │                              │                              │
--        ▼                              ▼                              ▼
--  ┌─────────────┐         ┌──────────────────────┐      ┌──────────────────┐
--  │   parent_   │         │   ai_insights        │      │  payments        │
--  │ notifications│         │   (AI analytics)     │      │  (existing)      │
--  └─────────────┘         └──────────────────────┘      └──────────────────┘
--        │                              │
--        │                              ├──────► risk_factors
--        │                              ├──────► opportunities
--        │                              ├──────► behavior_trends
--        ▼                              ├──────► academic_predictions
--  ┌─────────────┐                      └──────► recommended_actions
--  │   parent_   │
--  │ action_items│         ┌──────────────────────┐
--  └─────────────┘         │parent_teacher_comms  │
--                          │  (communication)     │
--                          └──────────────────────┘
--
-- ============================================================================

-- ============================================================================
-- EXTENSION REQUIREMENTS
-- ============================================================================
-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for advanced cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CUSTOM TYPES / ENUMS
-- ============================================================================

-- Relationship types between parents and students
CREATE TYPE parent_relationship_type AS ENUM (
    'mother',
    'father',
    'guardian',
    'grandparent',
    'sibling',
    'other'
);

-- AI insight categories
CREATE TYPE ai_insight_category AS ENUM (
    'academic_performance',
    'behavioral_analysis',
    'attendance_pattern',
    'engagement_level',
    'learning_style',
    'peer_interaction',
    'emotional_wellbeing',
    'time_management',
    'subject_strength',
    'subject_weakness'
);

-- AI insight severity levels
CREATE TYPE ai_insight_severity AS ENUM (
    'critical',      -- Immediate attention required
    'high',          -- Important, address soon
    'medium',        -- Notable, monitor closely
    'low',           -- Informational
    'positive'       -- Good news/achievement
);

-- Risk factor types
CREATE TYPE risk_factor_type AS ENUM (
    'attendance_drop',
    'grade_decline',
    'behavioral_concern',
    'engagement_decrease',
    'peer_conflict',
    'assignment_incomplete',
    'test_failure',
    'communication_gap',
    'emotional_distress',
    'learning_difficulty'
);

-- Opportunity types
CREATE TYPE opportunity_type AS ENUM (
    'academic_excellence',
    'skill_development',
    'leadership_potential',
    'creative_talent',
    'athletic_ability',
    'peer_mentorship',
    'advanced_placement',
    'extracurricular',
    'scholarship_eligible',
    'competition_ready'
);

-- Communication status
CREATE TYPE communication_status AS ENUM (
    'draft',
    'sent',
    'delivered',
    'read',
    'replied',
    'archived',
    'deleted'
);

-- Communication priority
CREATE TYPE communication_priority AS ENUM (
    'urgent',
    'high',
    'normal',
    'low'
);

-- Action item status
CREATE TYPE action_item_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'dismissed',
    'expired'
);

-- Notification preference channels
CREATE TYPE notification_channel AS ENUM (
    'in_app',
    'email',
    'sms',
    'push'
);

-- ============================================================================
-- TABLE: parents
-- Purpose: Extended profile information specific to parents
-- ============================================================================
CREATE TABLE parents (
    -- Primary Key
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

    -- Parent Information
    parent_id VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated: PAR-YYYYMMDD-XXXX
    occupation VARCHAR(255),
    employer VARCHAR(255),

    -- Contact Information
    primary_phone VARCHAR(20) NOT NULL,
    secondary_phone VARCHAR(20),
    alternate_email VARCHAR(255),

    -- Address Information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',

    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),

    -- Preferences & Settings
    preferred_communication_method notification_channel DEFAULT 'email',
    preferred_language VARCHAR(50) DEFAULT 'en',
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',

    -- AI & Analytics Settings
    ai_insights_enabled BOOLEAN DEFAULT true,
    weekly_report_enabled BOOLEAN DEFAULT true,
    alert_notifications_enabled BOOLEAN DEFAULT true,

    -- Financial Settings
    payment_reminder_enabled BOOLEAN DEFAULT true,
    payment_reminder_days_before INTEGER DEFAULT 7,
    auto_payment_enabled BOOLEAN DEFAULT false,

    -- Privacy & Security
    data_sharing_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    profile_completion_percentage INTEGER DEFAULT 0,

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_by UUID REFERENCES profiles(id),

    -- Constraints
    CONSTRAINT valid_phone CHECK (primary_phone ~ '^[+]?[0-9]{10,15}$'),
    CONSTRAINT valid_completion_percentage CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100)
);

-- Indexes for parents table
CREATE INDEX idx_parents_parent_id ON parents(parent_id);
CREATE INDEX idx_parents_primary_phone ON parents(primary_phone);
CREATE INDEX idx_parents_city ON parents(city);
CREATE INDEX idx_parents_onboarding_completed ON parents(onboarding_completed);
CREATE INDEX idx_parents_created_at ON parents(created_at);

-- Comments
COMMENT ON TABLE parents IS 'Extended profile information for parents/guardians';
COMMENT ON COLUMN parents.parent_id IS 'Human-readable unique identifier for parent (PAR-YYYYMMDD-XXXX)';
COMMENT ON COLUMN parents.profile_completion_percentage IS 'Calculated percentage of profile completion (0-100)';

-- ============================================================================
-- TABLE: parent_child_relationships
-- Purpose: Many-to-many relationship between parents and students
-- Allows multiple parents per student and multiple students per parent
-- ============================================================================
CREATE TABLE parent_child_relationships (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,

    -- Relationship Details
    relationship_type parent_relationship_type NOT NULL,
    relationship_description TEXT,

    -- Permissions & Access Control
    is_primary_contact BOOLEAN DEFAULT false,
    can_view_academic_records BOOLEAN DEFAULT true,
    can_view_financial_records BOOLEAN DEFAULT true,
    can_view_attendance BOOLEAN DEFAULT true,
    can_view_behavior_reports BOOLEAN DEFAULT true,
    can_receive_emergency_alerts BOOLEAN DEFAULT true,
    can_authorize_pickups BOOLEAN DEFAULT false,
    can_approve_field_trips BOOLEAN DEFAULT false,
    can_make_payments BOOLEAN DEFAULT true,

    -- Relationship Status
    is_active BOOLEAN DEFAULT true,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES profiles(id),

    -- Legal Documentation
    custody_documentation_url TEXT,
    court_order_url TEXT,
    legal_notes TEXT,

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_by UUID REFERENCES profiles(id),

    -- Constraints
    UNIQUE(parent_id, student_id, relationship_type)
);

-- Indexes for parent_child_relationships table
CREATE INDEX idx_parent_child_parent_id ON parent_child_relationships(parent_id);
CREATE INDEX idx_parent_child_student_id ON parent_child_relationships(student_id);
CREATE INDEX idx_parent_child_is_primary ON parent_child_relationships(is_primary_contact) WHERE is_primary_contact = true;
CREATE INDEX idx_parent_child_is_active ON parent_child_relationships(is_active) WHERE is_active = true;

-- Comments
COMMENT ON TABLE parent_child_relationships IS 'Many-to-many relationship mapping between parents and students with permissions';
COMMENT ON COLUMN parent_child_relationships.is_primary_contact IS 'Indicates the primary contact parent for this student';
COMMENT ON COLUMN parent_child_relationships.custody_documentation_url IS 'URL to storage bucket for legal custody documents';

-- ============================================================================
-- TABLE: ai_insights
-- Purpose: AI-generated insights about student performance and behavior
-- ============================================================================
CREATE TABLE ai_insights (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,

    -- Insight Details
    insight_category ai_insight_category NOT NULL,
    severity ai_insight_severity NOT NULL,

    -- Content
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    detailed_analysis TEXT,

    -- AI Model Information
    ai_model_version VARCHAR(50),
    confidence_score DECIMAL(5,4), -- 0.0000 to 1.0000

    -- Data Sources
    data_sources JSONB, -- Array of data sources used
    -- Example: ["attendance", "grades", "assignments", "behavior_reports"]

    -- Time Period Analyzed
    analysis_period_start DATE NOT NULL,
    analysis_period_end DATE NOT NULL,

    -- Metrics & Scores
    impact_score DECIMAL(5,2), -- 0-100 scale
    trend_direction VARCHAR(20), -- 'improving', 'declining', 'stable', 'fluctuating'

    -- Visualization Data
    chart_data JSONB, -- JSON data for charts/graphs
    metrics JSONB, -- Key metrics as JSON
    -- Example: {"attendance_rate": 85, "average_grade": 78, "assignment_completion": 90}

    -- Related Entities
    related_subjects TEXT[], -- Array of subject names
    related_classes UUID[], -- Array of class IDs
    related_assignments UUID[], -- Array of assignment IDs

    -- Action Tracking
    requires_action BOOLEAN DEFAULT false,
    action_taken BOOLEAN DEFAULT false,
    action_taken_at TIMESTAMP WITH TIME ZONE,

    -- Parent Interaction
    viewed_by_parent BOOLEAN DEFAULT false,
    viewed_at TIMESTAMP WITH TIME ZONE,
    parent_acknowledged BOOLEAN DEFAULT false,
    parent_acknowledged_at TIMESTAMP WITH TIME ZONE,
    parent_feedback TEXT,
    parent_rating INTEGER, -- 1-5 stars for insight usefulness

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,

    -- Audit Fields
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_confidence_score CHECK (confidence_score >= 0 AND confidence_score <= 1),
    CONSTRAINT valid_impact_score CHECK (impact_score >= 0 AND impact_score <= 100),
    CONSTRAINT valid_parent_rating CHECK (parent_rating >= 1 AND parent_rating <= 5),
    CONSTRAINT valid_analysis_period CHECK (analysis_period_end >= analysis_period_start)
);

-- Indexes for ai_insights table
CREATE INDEX idx_ai_insights_student_id ON ai_insights(student_id);
CREATE INDEX idx_ai_insights_parent_id ON ai_insights(parent_id);
CREATE INDEX idx_ai_insights_category ON ai_insights(insight_category);
CREATE INDEX idx_ai_insights_severity ON ai_insights(severity);
CREATE INDEX idx_ai_insights_is_active ON ai_insights(is_active) WHERE is_active = true;
CREATE INDEX idx_ai_insights_requires_action ON ai_insights(requires_action) WHERE requires_action = true;
CREATE INDEX idx_ai_insights_generated_at ON ai_insights(generated_at DESC);
CREATE INDEX idx_ai_insights_viewed_by_parent ON ai_insights(viewed_by_parent) WHERE viewed_by_parent = false;

-- Comments
COMMENT ON TABLE ai_insights IS 'AI-generated insights about student performance, behavior, and patterns';
COMMENT ON COLUMN ai_insights.confidence_score IS 'AI model confidence in the insight (0.0000 to 1.0000)';
COMMENT ON COLUMN ai_insights.impact_score IS 'Estimated impact/importance score (0-100)';

-- ============================================================================
-- TABLE: risk_factors
-- Purpose: Identified risk factors that may impact student success
-- ============================================================================
CREATE TABLE risk_factors (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    ai_insight_id UUID REFERENCES ai_insights(id) ON DELETE SET NULL,

    -- Risk Details
    risk_type risk_factor_type NOT NULL,
    severity ai_insight_severity NOT NULL,

    -- Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    potential_consequences TEXT,

    -- Risk Metrics
    risk_score DECIMAL(5,2) NOT NULL, -- 0-100 scale
    probability DECIMAL(5,4), -- 0.0000 to 1.0000

    -- Detection Information
    first_detected_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_detected_at TIMESTAMP WITH TIME ZONE NOT NULL,
    detection_frequency INTEGER DEFAULT 1,

    -- Contributing Factors
    contributing_factors JSONB,
    -- Example: [{"factor": "attendance", "value": "65%"}, {"factor": "homework_completion", "value": "45%"}]

    -- Related Data
    related_subjects TEXT[],
    related_classes UUID[],
    related_period_start DATE,
    related_period_end DATE,

    -- Mitigation & Resolution
    recommended_interventions TEXT[],
    mitigation_plan TEXT,
    resolution_steps JSONB,

    -- Status Tracking
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,

    -- Parent Interaction
    parent_notified BOOLEAN DEFAULT false,
    parent_notified_at TIMESTAMP WITH TIME ZONE,
    parent_acknowledged BOOLEAN DEFAULT false,
    parent_acknowledged_at TIMESTAMP WITH TIME ZONE,
    parent_comments TEXT,

    -- Follow-up
    follow_up_required BOOLEAN DEFAULT true,
    follow_up_date DATE,
    last_follow_up_at TIMESTAMP WITH TIME ZONE,

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,
    escalated BOOLEAN DEFAULT false,
    escalated_at TIMESTAMP WITH TIME ZONE,
    escalated_to UUID REFERENCES profiles(id),

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),

    -- Constraints
    CONSTRAINT valid_risk_score CHECK (risk_score >= 0 AND risk_score <= 100),
    CONSTRAINT valid_probability CHECK (probability >= 0 AND probability <= 1),
    CONSTRAINT valid_detection_dates CHECK (last_detected_at >= first_detected_at)
);

-- Indexes for risk_factors table
CREATE INDEX idx_risk_factors_student_id ON risk_factors(student_id);
CREATE INDEX idx_risk_factors_parent_id ON risk_factors(parent_id);
CREATE INDEX idx_risk_factors_ai_insight_id ON risk_factors(ai_insight_id);
CREATE INDEX idx_risk_factors_risk_type ON risk_factors(risk_type);
CREATE INDEX idx_risk_factors_severity ON risk_factors(severity);
CREATE INDEX idx_risk_factors_is_active ON risk_factors(is_active) WHERE is_active = true;
CREATE INDEX idx_risk_factors_is_resolved ON risk_factors(is_resolved);
CREATE INDEX idx_risk_factors_parent_acknowledged ON risk_factors(parent_acknowledged) WHERE parent_acknowledged = false;
CREATE INDEX idx_risk_factors_follow_up_date ON risk_factors(follow_up_date) WHERE is_resolved = false;

-- Comments
COMMENT ON TABLE risk_factors IS 'Identified risk factors that may negatively impact student success';
COMMENT ON COLUMN risk_factors.risk_score IS 'Calculated risk severity score (0-100)';
COMMENT ON COLUMN risk_factors.detection_frequency IS 'Number of times this risk has been detected';

-- ============================================================================
-- TABLE: opportunities
-- Purpose: Identified opportunities for student growth and excellence
-- ============================================================================
CREATE TABLE opportunities (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    ai_insight_id UUID REFERENCES ai_insights(id) ON DELETE SET NULL,

    -- Opportunity Details
    opportunity_type opportunity_type NOT NULL,

    -- Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    potential_benefits TEXT,

    -- Opportunity Metrics
    opportunity_score DECIMAL(5,2) NOT NULL, -- 0-100 scale
    confidence_level DECIMAL(5,4), -- 0.0000 to 1.0000

    -- Evidence
    supporting_evidence JSONB,
    -- Example: [{"metric": "math_scores", "value": "95%", "trend": "improving"}]

    -- Related Data
    related_subjects TEXT[],
    related_classes UUID[],
    related_period_start DATE,
    related_period_end DATE,

    -- Action Required
    action_required BOOLEAN DEFAULT false,
    recommended_actions TEXT[],
    action_deadline DATE,

    -- Requirements
    prerequisites TEXT[],
    estimated_time_commitment VARCHAR(100),
    estimated_cost DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'INR',

    -- External Resources
    external_programs TEXT[],
    scholarship_available BOOLEAN DEFAULT false,
    scholarship_details TEXT,
    application_url TEXT,
    application_deadline DATE,

    -- Status Tracking
    status action_item_status DEFAULT 'pending',
    pursued BOOLEAN DEFAULT false,
    pursued_at TIMESTAMP WITH TIME ZONE,

    -- Parent Interaction
    parent_notified BOOLEAN DEFAULT false,
    parent_notified_at TIMESTAMP WITH TIME ZONE,
    parent_interested BOOLEAN,
    parent_interested_at TIMESTAMP WITH TIME ZONE,
    parent_comments TEXT,

    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,

    -- Outcome Tracking
    outcome TEXT,
    outcome_recorded_at TIMESTAMP WITH TIME ZONE,

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),

    -- Constraints
    CONSTRAINT valid_opportunity_score CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
    CONSTRAINT valid_confidence_level CHECK (confidence_level >= 0 AND confidence_level <= 1)
);

-- Indexes for opportunities table
CREATE INDEX idx_opportunities_student_id ON opportunities(student_id);
CREATE INDEX idx_opportunities_parent_id ON opportunities(parent_id);
CREATE INDEX idx_opportunities_ai_insight_id ON opportunities(ai_insight_id);
CREATE INDEX idx_opportunities_type ON opportunities(opportunity_type);
CREATE INDEX idx_opportunities_is_active ON opportunities(is_active) WHERE is_active = true;
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_parent_interested ON opportunities(parent_interested);
CREATE INDEX idx_opportunities_application_deadline ON opportunities(application_deadline) WHERE status = 'pending';

-- Comments
COMMENT ON TABLE opportunities IS 'Identified opportunities for student growth, excellence, and advancement';
COMMENT ON COLUMN opportunities.opportunity_score IS 'Calculated opportunity potential score (0-100)';

-- ============================================================================
-- TABLE: behavior_trends
-- Purpose: Behavioral pattern analysis over time
-- ============================================================================
CREATE TABLE behavior_trends (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    ai_insight_id UUID REFERENCES ai_insights(id) ON DELETE SET NULL,

    -- Trend Details
    behavior_category VARCHAR(100) NOT NULL,
    -- Examples: 'participation', 'collaboration', 'punctuality', 'homework_completion'

    trend_direction VARCHAR(20) NOT NULL, -- 'improving', 'declining', 'stable', 'fluctuating'

    -- Content
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    detailed_analysis TEXT,

    -- Time Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Metrics
    baseline_score DECIMAL(5,2), -- Starting point (0-100)
    current_score DECIMAL(5,2), -- Current status (0-100)
    change_percentage DECIMAL(6,2), -- Percentage change (can be negative)

    -- Trend Data (for charting)
    data_points JSONB NOT NULL,
    -- Example: [{"date": "2024-01-01", "score": 75}, {"date": "2024-01-08", "score": 80}]

    -- Analysis
    positive_behaviors TEXT[],
    negative_behaviors TEXT[],
    contributing_factors JSONB,

    -- Related Context
    related_subjects TEXT[],
    related_classes UUID[],
    related_teachers UUID[],

    -- Recommendations
    recommendations TEXT[],
    parental_support_suggestions TEXT[],

    -- Statistical Analysis
    statistical_significance DECIMAL(5,4), -- p-value
    sample_size INTEGER,

    -- Parent Interaction
    viewed_by_parent BOOLEAN DEFAULT false,
    viewed_at TIMESTAMP WITH TIME ZONE,
    parent_feedback TEXT,

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_period CHECK (period_end >= period_start),
    CONSTRAINT valid_scores CHECK (baseline_score >= 0 AND baseline_score <= 100 AND current_score >= 0 AND current_score <= 100)
);

-- Indexes for behavior_trends table
CREATE INDEX idx_behavior_trends_student_id ON behavior_trends(student_id);
CREATE INDEX idx_behavior_trends_parent_id ON behavior_trends(parent_id);
CREATE INDEX idx_behavior_trends_ai_insight_id ON behavior_trends(ai_insight_id);
CREATE INDEX idx_behavior_trends_category ON behavior_trends(behavior_category);
CREATE INDEX idx_behavior_trends_direction ON behavior_trends(trend_direction);
CREATE INDEX idx_behavior_trends_is_active ON behavior_trends(is_active) WHERE is_active = true;
CREATE INDEX idx_behavior_trends_period ON behavior_trends(period_start, period_end);

-- Comments
COMMENT ON TABLE behavior_trends IS 'Behavioral pattern analysis and trends over time';
COMMENT ON COLUMN behavior_trends.data_points IS 'Time-series data points for trend visualization';

-- ============================================================================
-- TABLE: academic_predictions
-- Purpose: AI-powered predictive analytics for academic performance
-- ============================================================================
CREATE TABLE academic_predictions (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    ai_insight_id UUID REFERENCES ai_insights(id) ON DELETE SET NULL,

    -- Prediction Details
    prediction_type VARCHAR(100) NOT NULL,
    -- Examples: 'final_grade', 'exam_performance', 'graduation_likelihood', 'college_readiness'

    subject VARCHAR(100),
    class_id UUID REFERENCES classes(id),

    -- Content
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    detailed_explanation TEXT,

    -- Prediction Metrics
    predicted_outcome VARCHAR(255) NOT NULL,
    confidence_level DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    probability DECIMAL(5,4), -- 0.0000 to 1.0000

    -- Scoring
    predicted_score DECIMAL(5,2), -- Predicted numerical score
    predicted_grade VARCHAR(10), -- Predicted letter grade
    current_score DECIMAL(5,2), -- Current actual score

    -- Time Frame
    prediction_date DATE NOT NULL,
    target_date DATE NOT NULL, -- When prediction applies to
    prediction_horizon_days INTEGER, -- Days into future

    -- Model Information
    model_version VARCHAR(50),
    model_accuracy DECIMAL(5,4), -- Historical model accuracy

    -- Contributing Factors
    key_factors JSONB,
    -- Example: [{"factor": "attendance", "weight": 0.35, "current_value": 0.85}]

    positive_indicators TEXT[],
    risk_indicators TEXT[],

    -- Scenario Analysis
    best_case_scenario TEXT,
    best_case_score DECIMAL(5,2),
    worst_case_scenario TEXT,
    worst_case_score DECIMAL(5,2),
    most_likely_scenario TEXT,
    most_likely_score DECIMAL(5,2),

    -- Recommendations
    improvement_recommendations TEXT[],
    action_plan JSONB,
    required_improvements TEXT[],

    -- Validation (after target date)
    actual_outcome VARCHAR(255),
    actual_score DECIMAL(5,2),
    actual_grade VARCHAR(10),
    prediction_accuracy DECIMAL(5,4), -- How accurate was prediction
    validated_at TIMESTAMP WITH TIME ZONE,

    -- Parent Interaction
    viewed_by_parent BOOLEAN DEFAULT false,
    viewed_at TIMESTAMP WITH TIME ZONE,
    parent_acknowledged BOOLEAN DEFAULT false,
    parent_acknowledged_at TIMESTAMP WITH TIME ZONE,
    parent_feedback TEXT,

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,
    is_outdated BOOLEAN DEFAULT false,
    superseded_by UUID REFERENCES academic_predictions(id),

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_confidence CHECK (confidence_level >= 0 AND confidence_level <= 1),
    CONSTRAINT valid_probability CHECK (probability >= 0 AND probability <= 1),
    CONSTRAINT valid_target_date CHECK (target_date >= prediction_date)
);

-- Indexes for academic_predictions table
CREATE INDEX idx_academic_predictions_student_id ON academic_predictions(student_id);
CREATE INDEX idx_academic_predictions_parent_id ON academic_predictions(parent_id);
CREATE INDEX idx_academic_predictions_ai_insight_id ON academic_predictions(ai_insight_id);
CREATE INDEX idx_academic_predictions_type ON academic_predictions(prediction_type);
CREATE INDEX idx_academic_predictions_subject ON academic_predictions(subject);
CREATE INDEX idx_academic_predictions_is_active ON academic_predictions(is_active) WHERE is_active = true;
CREATE INDEX idx_academic_predictions_target_date ON academic_predictions(target_date);

-- Comments
COMMENT ON TABLE academic_predictions IS 'AI-powered predictive analytics for academic performance';
COMMENT ON COLUMN academic_predictions.prediction_horizon_days IS 'Number of days into the future this prediction covers';

-- ============================================================================
-- TABLE: recommended_actions
-- Purpose: AI-recommended actions for parents to take
-- ============================================================================
CREATE TABLE recommended_actions (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    ai_insight_id UUID REFERENCES ai_insights(id) ON DELETE SET NULL,
    risk_factor_id UUID REFERENCES risk_factors(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,

    -- Action Details
    action_type VARCHAR(100) NOT NULL,
    -- Examples: 'schedule_meeting', 'review_assignment', 'discuss_with_student',
    --           'contact_teacher', 'provide_resources', 'monitor_progress'

    priority communication_priority NOT NULL DEFAULT 'normal',

    -- Content
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reasoning TEXT,
    expected_outcome TEXT,

    -- Action Steps
    action_steps JSONB,
    -- Example: [{"step": 1, "description": "Review assignment feedback", "estimated_minutes": 10}]

    -- Timing
    recommended_by_date DATE,
    estimated_duration_minutes INTEGER,
    best_time_to_act VARCHAR(100), -- e.g., "evening", "weekend", "before next exam"

    -- Resources
    required_resources TEXT[],
    helpful_links JSONB,
    -- Example: [{"title": "How to help with math homework", "url": "https://..."}]

    attached_documents TEXT[],

    -- Impact Estimation
    potential_impact ai_insight_severity,
    impact_description TEXT,
    success_probability DECIMAL(5,4),

    -- Status Tracking
    status action_item_status DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    dismissal_reason TEXT,

    -- Parent Interaction
    viewed_by_parent BOOLEAN DEFAULT false,
    viewed_at TIMESTAMP WITH TIME ZONE,
    parent_notes TEXT,

    -- Outcome Tracking
    action_taken BOOLEAN DEFAULT false,
    action_taken_at TIMESTAMP WITH TIME ZONE,
    action_notes TEXT,
    outcome TEXT,
    outcome_rating INTEGER, -- 1-5 stars
    was_helpful BOOLEAN,

    -- Follow-up
    requires_follow_up BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_notes TEXT,

    -- Reminders
    reminder_sent BOOLEAN DEFAULT false,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    reminder_count INTEGER DEFAULT 0,

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_outcome_rating CHECK (outcome_rating >= 1 AND outcome_rating <= 5),
    CONSTRAINT valid_success_probability CHECK (success_probability >= 0 AND success_probability <= 1)
);

-- Indexes for recommended_actions table
CREATE INDEX idx_recommended_actions_student_id ON recommended_actions(student_id);
CREATE INDEX idx_recommended_actions_parent_id ON recommended_actions(parent_id);
CREATE INDEX idx_recommended_actions_ai_insight_id ON recommended_actions(ai_insight_id);
CREATE INDEX idx_recommended_actions_risk_factor_id ON recommended_actions(risk_factor_id);
CREATE INDEX idx_recommended_actions_opportunity_id ON recommended_actions(opportunity_id);
CREATE INDEX idx_recommended_actions_action_type ON recommended_actions(action_type);
CREATE INDEX idx_recommended_actions_priority ON recommended_actions(priority);
CREATE INDEX idx_recommended_actions_status ON recommended_actions(status);
CREATE INDEX idx_recommended_actions_is_active ON recommended_actions(is_active) WHERE is_active = true;
CREATE INDEX idx_recommended_actions_recommended_by_date ON recommended_actions(recommended_by_date) WHERE status = 'pending';

-- Comments
COMMENT ON TABLE recommended_actions IS 'AI-recommended actions for parents to improve student outcomes';
COMMENT ON COLUMN recommended_actions.action_steps IS 'Structured step-by-step action plan';

-- ============================================================================
-- TABLE: parent_teacher_communications
-- Purpose: Structured communication between parents and teachers
-- ============================================================================
CREATE TABLE parent_teacher_communications (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Communication Details
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    communication_type VARCHAR(50) NOT NULL,
    -- Examples: 'inquiry', 'concern', 'meeting_request', 'feedback', 'complaint', 'appreciation'

    priority communication_priority DEFAULT 'normal',
    status communication_status DEFAULT 'sent',

    -- Context
    related_to VARCHAR(100),
    -- Examples: 'academic_performance', 'behavior', 'attendance', 'assignments', 'exams', 'general'

    related_entity_type VARCHAR(50), -- 'assignment', 'exam', 'class', 'subject'
    related_entity_id UUID,

    -- Thread Management
    parent_message_id UUID, -- References parent message in thread
    thread_id UUID, -- Groups related messages
    is_thread_starter BOOLEAN DEFAULT true,

    -- Sender Information
    sent_by UUID NOT NULL REFERENCES profiles(id), -- Can be parent or teacher
    sent_by_role VARCHAR(50) NOT NULL, -- 'parent' or 'teacher'

    -- Recipient Information
    recipient_id UUID NOT NULL REFERENCES profiles(id),
    recipient_role VARCHAR(50) NOT NULL,

    -- Delivery & Read Tracking
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,

    -- Response Management
    response_required BOOLEAN DEFAULT true,
    response_deadline DATE,
    response_received BOOLEAN DEFAULT false,

    -- Attachments
    attachments JSONB,
    -- Example: [{"name": "report.pdf", "url": "https://...", "size": 12345, "type": "application/pdf"}]

    -- Meeting Scheduling (if type is meeting_request)
    meeting_requested BOOLEAN DEFAULT false,
    proposed_meeting_dates JSONB,
    meeting_scheduled_at TIMESTAMP WITH TIME ZONE,
    meeting_location VARCHAR(255),
    meeting_type VARCHAR(50), -- 'in_person', 'virtual', 'phone'
    meeting_link TEXT,
    meeting_completed BOOLEAN DEFAULT false,
    meeting_notes TEXT,

    -- Escalation
    is_escalated BOOLEAN DEFAULT false,
    escalated_at TIMESTAMP WITH TIME ZONE,
    escalated_to UUID REFERENCES profiles(id),
    escalation_reason TEXT,

    -- Privacy & Compliance
    is_confidential BOOLEAN DEFAULT false,
    involves_sensitive_info BOOLEAN DEFAULT false,

    -- Tags & Categories
    tags TEXT[],
    custom_metadata JSONB,

    -- Archive
    archived BOOLEAN DEFAULT false,
    archived_at TIMESTAMP WITH TIME ZONE,
    archived_by UUID REFERENCES profiles(id),

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_roles CHECK (
        (sent_by_role IN ('parent', 'teacher')) AND
        (recipient_role IN ('parent', 'teacher')) AND
        (sent_by_role != recipient_role)
    )
);

-- Indexes for parent_teacher_communications table
CREATE INDEX idx_ptc_parent_id ON parent_teacher_communications(parent_id);
CREATE INDEX idx_ptc_student_id ON parent_teacher_communications(student_id);
CREATE INDEX idx_ptc_teacher_id ON parent_teacher_communications(teacher_id);
CREATE INDEX idx_ptc_sent_by ON parent_teacher_communications(sent_by);
CREATE INDEX idx_ptc_recipient_id ON parent_teacher_communications(recipient_id);
CREATE INDEX idx_ptc_status ON parent_teacher_communications(status);
CREATE INDEX idx_ptc_priority ON parent_teacher_communications(priority);
CREATE INDEX idx_ptc_thread_id ON parent_teacher_communications(thread_id);
CREATE INDEX idx_ptc_created_at ON parent_teacher_communications(created_at DESC);
CREATE INDEX idx_ptc_unread ON parent_teacher_communications(recipient_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_ptc_response_required ON parent_teacher_communications(response_required, response_received) WHERE response_required = true AND response_received = false;

-- Comments
COMMENT ON TABLE parent_teacher_communications IS 'Structured communication system between parents and teachers';
COMMENT ON COLUMN parent_teacher_communications.thread_id IS 'Groups related messages together for conversation threading';

-- ============================================================================
-- TABLE: parent_action_items
-- Purpose: Parent-specific action items and todos
-- ============================================================================
CREATE TABLE parent_action_items (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,

    -- Optional Relationships
    recommended_action_id UUID REFERENCES recommended_actions(id) ON DELETE SET NULL,
    communication_id UUID REFERENCES parent_teacher_communications(id) ON DELETE SET NULL,
    ai_insight_id UUID REFERENCES ai_insights(id) ON DELETE SET NULL,

    -- Action Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    action_type VARCHAR(100),
    -- Examples: 'payment', 'document_upload', 'form_submission', 'meeting_attendance',
    --           'review_content', 'contact_teacher', 'help_with_homework'

    priority communication_priority DEFAULT 'normal',

    -- Timing
    due_date DATE,
    due_time TIME,
    estimated_duration_minutes INTEGER,

    -- Status Tracking
    status action_item_status DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    dismissal_reason TEXT,

    -- Completion Details
    completion_notes TEXT,
    completion_proof_url TEXT, -- Link to uploaded proof/document

    -- Reminders
    reminder_enabled BOOLEAN DEFAULT true,
    reminder_before_days INTEGER DEFAULT 1,
    last_reminder_sent_at TIMESTAMP WITH TIME ZONE,
    reminder_count INTEGER DEFAULT 0,

    -- Recurrence
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'custom'
    recurrence_config JSONB,
    next_occurrence_date DATE,

    -- Related Information
    related_links JSONB,
    attached_files TEXT[],
    tags TEXT[],

    -- Collaboration
    assigned_by UUID REFERENCES profiles(id),
    shared_with UUID[], -- Array of profile IDs who can see this

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Indexes for parent_action_items table
CREATE INDEX idx_parent_action_items_parent_id ON parent_action_items(parent_id);
CREATE INDEX idx_parent_action_items_student_id ON parent_action_items(student_id);
CREATE INDEX idx_parent_action_items_recommended_action_id ON parent_action_items(recommended_action_id);
CREATE INDEX idx_parent_action_items_status ON parent_action_items(status);
CREATE INDEX idx_parent_action_items_priority ON parent_action_items(priority);
CREATE INDEX idx_parent_action_items_due_date ON parent_action_items(due_date) WHERE status != 'completed';
CREATE INDEX idx_parent_action_items_is_active ON parent_action_items(is_active) WHERE is_active = true;

-- Comments
COMMENT ON TABLE parent_action_items IS 'Parent-specific action items, todos, and task management';
COMMENT ON COLUMN parent_action_items.recurrence_config IS 'JSON configuration for recurring tasks';

-- ============================================================================
-- TABLE: parent_notification_preferences
-- Purpose: Fine-grained notification preferences for parents
-- ============================================================================
CREATE TABLE parent_notification_preferences (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Keys
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE, -- NULL means applies to all children

    -- Notification Categories
    notification_category VARCHAR(100) NOT NULL,
    -- Examples: 'academic_alerts', 'attendance_updates', 'payment_reminders',
    --           'ai_insights', 'teacher_messages', 'behavior_reports'

    -- Channel Preferences
    enabled BOOLEAN DEFAULT true,
    in_app_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    push_enabled BOOLEAN DEFAULT true,

    -- Timing Preferences
    immediate_notification BOOLEAN DEFAULT false,
    daily_digest BOOLEAN DEFAULT true,
    weekly_summary BOOLEAN DEFAULT true,

    -- Digest Timing
    digest_time TIME DEFAULT '08:00:00',
    digest_timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',

    -- Frequency Control
    max_notifications_per_day INTEGER,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    quiet_hours_enabled BOOLEAN DEFAULT false,

    -- Severity Filtering
    only_high_priority BOOLEAN DEFAULT false,
    minimum_severity ai_insight_severity,

    -- Custom Rules
    custom_rules JSONB,
    -- Example: {"only_on_weekdays": true, "exclude_subjects": ["art"], "threshold": 70}

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(parent_id, student_id, notification_category)
);

-- Indexes for parent_notification_preferences table
CREATE INDEX idx_pnp_parent_id ON parent_notification_preferences(parent_id);
CREATE INDEX idx_pnp_student_id ON parent_notification_preferences(student_id);
CREATE INDEX idx_pnp_category ON parent_notification_preferences(notification_category);
CREATE INDEX idx_pnp_enabled ON parent_notification_preferences(enabled) WHERE enabled = true;

-- Comments
COMMENT ON TABLE parent_notification_preferences IS 'Fine-grained notification preferences for parents by category and channel';
COMMENT ON COLUMN parent_notification_preferences.student_id IS 'NULL means preference applies to all children';

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Note: This is commented out by default. Uncomment to insert sample data.

/*
-- Sample Parent Profile
INSERT INTO parents (id, parent_id, primary_phone, occupation, city, ai_insights_enabled, onboarding_completed)
SELECT id, 'PAR-20241019-0001', '+919876543210', 'Software Engineer', 'Mumbai', true, true
FROM profiles WHERE email = 'parent1@example.com' LIMIT 1;

-- Sample Parent-Child Relationship
INSERT INTO parent_child_relationships (parent_id, student_id, relationship_type, is_primary_contact)
SELECT p.id, s.id, 'mother', true
FROM parents p, students s
WHERE p.parent_id = 'PAR-20241019-0001' AND s.student_id = 'STU-001' LIMIT 1;

-- Sample AI Insight
INSERT INTO ai_insights (
    student_id, parent_id, insight_category, severity,
    title, summary, confidence_score, impact_score,
    analysis_period_start, analysis_period_end
)
SELECT
    s.id, p.id, 'academic_performance', 'medium',
    'Math Performance Declining',
    'Student''s math scores have declined by 15% over the past month.',
    0.8750, 75.00,
    CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE
FROM students s, parents p
WHERE s.student_id = 'STU-001' AND p.parent_id = 'PAR-20241019-0001' LIMIT 1;
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
