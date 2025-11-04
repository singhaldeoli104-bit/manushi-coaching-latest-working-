-- ================================================
-- Migration: 002 - Create AI Insights Tables
-- Description: Tables for AI-powered insights, predictions, and recommendations
-- Dependencies: 001_create_parent_tables.sql
-- ================================================

-- ================================================
-- 1. AI Insights Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('academic', 'behavioral', 'social', 'health', 'overall')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    ai_model_version TEXT,
    data_sources JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_child_id ON public.ai_insights(child_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_insight_type ON public.ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_severity ON public.ai_insights(severity);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON public.ai_insights(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_is_acknowledged ON public.ai_insights(is_acknowledged);

COMMENT ON TABLE public.ai_insights IS 'AI-generated insights about student performance and behavior';
COMMENT ON COLUMN public.ai_insights.confidence_score IS 'AI model confidence percentage (0-100)';
COMMENT ON COLUMN public.ai_insights.data_sources IS 'Array of data sources used for this insight';

-- ================================================
-- 2. Risk Factors Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.risk_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    risk_category TEXT NOT NULL CHECK (risk_category IN ('academic_decline', 'attendance', 'behavioral', 'social', 'health', 'financial')),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    indicators JSONB DEFAULT '[]'::jsonb,
    impact_score DECIMAL(5,2) CHECK (impact_score >= 0 AND impact_score <= 100),
    probability_score DECIMAL(5,2) CHECK (probability_score >= 0 AND probability_score <= 100),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    mitigation_actions JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_factors_child_id ON public.risk_factors(child_id);
CREATE INDEX IF NOT EXISTS idx_risk_factors_risk_category ON public.risk_factors(risk_category);
CREATE INDEX IF NOT EXISTS idx_risk_factors_risk_level ON public.risk_factors(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_factors_is_active ON public.risk_factors(is_active);
CREATE INDEX IF NOT EXISTS idx_risk_factors_detected_at ON public.risk_factors(detected_at DESC);

COMMENT ON TABLE public.risk_factors IS 'Identified risk factors that may impact student success';
COMMENT ON COLUMN public.risk_factors.impact_score IS 'Potential impact severity (0-100)';
COMMENT ON COLUMN public.risk_factors.probability_score IS 'Likelihood of occurrence (0-100)';
COMMENT ON COLUMN public.risk_factors.indicators IS 'Array of specific indicators that triggered this risk';

-- ================================================
-- 3. Opportunities Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('academic_strength', 'talent', 'scholarship', 'competition', 'enrichment', 'career_path')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    potential_impact TEXT NOT NULL CHECK (potential_impact IN ('low', 'medium', 'high', 'exceptional')),
    confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    evidence JSONB DEFAULT '[]'::jsonb,
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    deadline TIMESTAMP WITH TIME ZONE,
    is_pursued BOOLEAN DEFAULT FALSE,
    pursued_at TIMESTAMP WITH TIME ZONE,
    outcome TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_child_id ON public.opportunities(child_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_opportunity_type ON public.opportunities(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_potential_impact ON public.opportunities(potential_impact);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_pursued ON public.opportunities(is_pursued);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);

COMMENT ON TABLE public.opportunities IS 'Identified opportunities for student growth and achievement';
COMMENT ON COLUMN public.opportunities.evidence IS 'Supporting evidence for this opportunity (performance data, strengths, etc.)';
COMMENT ON COLUMN public.opportunities.recommended_actions IS 'Suggested steps to pursue this opportunity';

-- ================================================
-- 4. Behavior Trends Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.behavior_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    trend_type TEXT NOT NULL CHECK (trend_type IN ('attendance', 'participation', 'discipline', 'engagement', 'social_interaction', 'homework_completion')),
    trend_direction TEXT NOT NULL CHECK (trend_direction IN ('improving', 'declining', 'stable', 'fluctuating')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    time_period_start DATE NOT NULL,
    time_period_end DATE NOT NULL,
    data_points JSONB DEFAULT '[]'::jsonb,
    statistical_significance DECIMAL(5,2),
    key_findings JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_behavior_trends_child_id ON public.behavior_trends(child_id);
CREATE INDEX IF NOT EXISTS idx_behavior_trends_trend_type ON public.behavior_trends(trend_type);
CREATE INDEX IF NOT EXISTS idx_behavior_trends_trend_direction ON public.behavior_trends(trend_direction);
CREATE INDEX IF NOT EXISTS idx_behavior_trends_time_period ON public.behavior_trends(time_period_start, time_period_end);

COMMENT ON TABLE public.behavior_trends IS 'Behavioral trends and patterns over time';
COMMENT ON COLUMN public.behavior_trends.data_points IS 'Array of timestamped data points showing the trend';
COMMENT ON COLUMN public.behavior_trends.statistical_significance IS 'P-value or confidence level of the trend';

-- ================================================
-- 5. Academic Predictions Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.academic_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    prediction_type TEXT NOT NULL CHECK (prediction_type IN ('grade_prediction', 'exam_performance', 'subject_difficulty', 'graduation_likelihood', 'college_readiness')),
    predicted_outcome TEXT NOT NULL,
    confidence_level DECIMAL(5,2) CHECK (confidence_level >= 0 AND confidence_level <= 100),
    prediction_date DATE NOT NULL,
    target_date DATE NOT NULL,
    factors_considered JSONB DEFAULT '[]'::jsonb,
    model_version TEXT,
    actual_outcome TEXT,
    accuracy_score DECIMAL(5,2),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_academic_predictions_child_id ON public.academic_predictions(child_id);
CREATE INDEX IF NOT EXISTS idx_academic_predictions_subject ON public.academic_predictions(subject);
CREATE INDEX IF NOT EXISTS idx_academic_predictions_prediction_type ON public.academic_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_academic_predictions_target_date ON public.academic_predictions(target_date);

COMMENT ON TABLE public.academic_predictions IS 'AI-generated predictions for academic performance';
COMMENT ON COLUMN public.academic_predictions.factors_considered IS 'Array of factors used in the prediction (attendance, past grades, etc.)';
COMMENT ON COLUMN public.academic_predictions.accuracy_score IS 'Accuracy when comparing prediction to actual outcome';

-- ================================================
-- 6. Recommended Actions Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.recommended_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    related_insight_id UUID REFERENCES public.ai_insights(id) ON DELETE SET NULL,
    related_risk_id UUID REFERENCES public.risk_factors(id) ON DELETE SET NULL,
    related_opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('intervention', 'enrichment', 'communication', 'monitoring', 'resource_allocation', 'counseling')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    steps JSONB DEFAULT '[]'::jsonb,
    responsible_parties JSONB DEFAULT '[]'::jsonb,
    estimated_effort TEXT,
    expected_impact TEXT,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'deferred')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    outcome_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommended_actions_child_id ON public.recommended_actions(child_id);
CREATE INDEX IF NOT EXISTS idx_recommended_actions_related_insight_id ON public.recommended_actions(related_insight_id);
CREATE INDEX IF NOT EXISTS idx_recommended_actions_related_risk_id ON public.recommended_actions(related_risk_id);
CREATE INDEX IF NOT EXISTS idx_recommended_actions_related_opportunity_id ON public.recommended_actions(related_opportunity_id);
CREATE INDEX IF NOT EXISTS idx_recommended_actions_action_type ON public.recommended_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_recommended_actions_priority ON public.recommended_actions(priority);
CREATE INDEX IF NOT EXISTS idx_recommended_actions_status ON public.recommended_actions(status);
CREATE INDEX IF NOT EXISTS idx_recommended_actions_due_date ON public.recommended_actions(due_date);

COMMENT ON TABLE public.recommended_actions IS 'AI-recommended actions based on insights, risks, and opportunities';
COMMENT ON COLUMN public.recommended_actions.steps IS 'Step-by-step action plan';
COMMENT ON COLUMN public.recommended_actions.responsible_parties IS 'Array of roles/people responsible (parent, teacher, counselor, etc.)';

-- ================================================
-- Row Level Security Policies
-- ================================================

-- AI Insights RLS
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view AI insights for their children"
    ON public.ai_insights FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can acknowledge AI insights for their children"
    ON public.ai_insights FOR UPDATE
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Risk Factors RLS
ALTER TABLE public.risk_factors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view risk factors for their children"
    ON public.risk_factors FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can update risk factors for their children"
    ON public.risk_factors FOR UPDATE
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Opportunities RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view opportunities for their children"
    ON public.opportunities FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can update opportunities for their children"
    ON public.opportunities FOR UPDATE
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Behavior Trends RLS
ALTER TABLE public.behavior_trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view behavior trends for their children"
    ON public.behavior_trends FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Academic Predictions RLS
ALTER TABLE public.academic_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view academic predictions for their children"
    ON public.academic_predictions FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Recommended Actions RLS
ALTER TABLE public.recommended_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view recommended actions for their children"
    ON public.recommended_actions FOR SELECT
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Parents can update recommended actions for their children"
    ON public.recommended_actions FOR UPDATE
    USING (
        child_id IN (
            SELECT c.id FROM public.children c
            INNER JOIN public.parent_child_relationships pcr ON c.id = pcr.child_id
            INNER JOIN public.parents p ON pcr.parent_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- ================================================
-- Triggers for updated_at
-- ================================================
CREATE TRIGGER update_ai_insights_updated_at
    BEFORE UPDATE ON public.ai_insights
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_factors_updated_at
    BEFORE UPDATE ON public.risk_factors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_behavior_trends_updated_at
    BEFORE UPDATE ON public.behavior_trends
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_predictions_updated_at
    BEFORE UPDATE ON public.academic_predictions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recommended_actions_updated_at
    BEFORE UPDATE ON public.recommended_actions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
