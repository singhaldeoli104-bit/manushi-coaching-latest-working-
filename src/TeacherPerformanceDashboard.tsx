import React, { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * Screen 44: Teacher Performance Dashboard
 *
 * View teacher's own performance metrics and analytics with comprehensive data visualization
 *
 * Features:
 * - Time period selector (This month, Quarter, Year, All time)
 * - Key metrics cards (Classes taught, Total students, Average rating, Attendance rate)
 * - Performance indicators with progress bars
 * - Charts section (Performance trend, Subject-wise scores)
 * - Achievements/badges display
 * - Recent feedback from students, parents, and admin
 * - AI-suggested improvements
 * - Peer comparison (anonymized ranking)
 * - Export report button
 *
 * @framerIntrinsicWidth 390
 * @framerIntrinsicHeight 844
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

type TimePeriod = "month" | "quarter" | "year" | "all"

interface TeacherPerformanceDashboardProps {
    width?: number
    height?: number
}

export default function TeacherPerformanceDashboard(props: TeacherPerformanceDashboardProps) {
    const { width = 390, height = 844 } = props
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month")

    // Mock data
    const metrics = {
        classesTaught: 24,
        totalStudents: 156,
        averageRating: 4.8,
        attendanceRate: 96.5,
    }

    const performanceIndicators = {
        studentFeedback: 9.2,
        assignmentCompletion: 94.3,
        testAverageScores: 87.6,
        parentSatisfaction: 9.4,
    }

    const achievements = [
        { id: 1, title: "Best Teacher of Month", icon: "🏆", date: "Jan 2025" },
        { id: 2, title: "100% Attendance", icon: "✅", date: "Jan 2025" },
        { id: 3, title: "High Satisfaction Score", icon: "⭐", date: "Dec 2024" },
        { id: 4, title: "Innovation Award", icon: "💡", date: "Q4 2024" },
    ]

    const recentFeedback = [
        {
            id: 1,
            type: "Student",
            text: "Best teacher ever! Makes math fun and easy to understand.",
            author: "Priya S.",
            date: "2 days ago",
        },
        {
            id: 2,
            type: "Parent",
            text: "Very responsive and caring. My son's grades improved significantly.",
            author: "Rajesh M.",
            date: "5 days ago",
        },
        {
            id: 3,
            type: "Admin",
            text: "Excellent classroom management and student engagement.",
            author: "Principal",
            date: "1 week ago",
        },
    ]

    const improvements = [
        {
            id: 1,
            title: "Integrate more visual aids",
            description: "Students show 15% better retention with visual content",
        },
        {
            id: 2,
            title: "Increase parent communication",
            description: "Weekly updates improve parent satisfaction by 20%",
        },
        {
            id: 3,
            title: "Use gamification techniques",
            description: "Gamified lessons increase engagement by 30%",
        },
    ]

    const peerComparison = {
        yourRank: 3,
        totalTeachers: 24,
        percentile: 88,
        departmentAverage: 4.2,
    }

    const timePeriods: { id: TimePeriod; label: string }[] = [
        { id: "month", label: "This Month" },
        { id: "quarter", label: "Quarter" },
        { id: "year", label: "Year" },
        { id: "all", label: "All Time" },
    ]

    return (
        <div
            style={{
                width,
                height,
                backgroundColor: "#F9FAFB",
                fontFamily: "Inter, sans-serif",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Header with Time Period Selector */}
            <div
                style={{
                    backgroundColor: "#5B47FB",
                    padding: "16px",
                    color: "white",
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                    }}
                >
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            fontSize: "24px",
                            cursor: "pointer",
                            padding: 0,
                            marginRight: "12px",
                            width: "44px",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Go back"
                    >
                        ←
                    </button>
                    <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                        Performance Dashboard
                    </h1>
                </div>

                <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                    {timePeriods.map((period) => (
                        <button
                            key={period.id}
                            onClick={() => setSelectedPeriod(period.id)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                border: "none",
                                backgroundColor:
                                    selectedPeriod === period.id
                                        ? "white"
                                        : "rgba(255,255,255,0.2)",
                                color: selectedPeriod === period.id ? "#5B47FB" : "white",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                minWidth: "44px",
                                minHeight: "44px",
                            }}
                            aria-label={`Select ${period.label}`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                {/* Key Metrics - 2x2 Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginBottom: "16px",
                    }}
                >
                    <MetricCard
                        title="Classes Taught"
                        value={metrics.classesTaught.toString()}
                        icon="📚"
                        trend="+12%"
                    />
                    <MetricCard
                        title="Total Students"
                        value={metrics.totalStudents.toString()}
                        icon="👥"
                        trend="+8%"
                    />
                    <MetricCard
                        title="Average Rating"
                        value={metrics.averageRating.toFixed(1)}
                        icon="⭐"
                        trend="+0.2"
                        suffix="/5.0"
                    />
                    <MetricCard
                        title="Attendance Rate"
                        value={metrics.attendanceRate.toFixed(1)}
                        icon="✅"
                        trend="+1.5%"
                        suffix="%"
                    />
                </div>

                {/* Performance Indicators */}
                <Section title="Performance Indicators">
                    <IndicatorBar
                        label="Student Feedback Score"
                        value={performanceIndicators.studentFeedback}
                        max={10}
                        color="#10B981"
                    />
                    <IndicatorBar
                        label="Assignment Completion"
                        value={performanceIndicators.assignmentCompletion}
                        max={100}
                        color="#5B47FB"
                    />
                    <IndicatorBar
                        label="Test Average Scores"
                        value={performanceIndicators.testAverageScores}
                        max={100}
                        color="#F59E0B"
                    />
                    <IndicatorBar
                        label="Parent Satisfaction"
                        value={performanceIndicators.parentSatisfaction}
                        max={10}
                        color="#10B981"
                    />
                </Section>

                {/* Charts Section */}
                <Section title="Performance Trends">
                    <ChartPlaceholder title="Class Performance Trend" type="line" />
                    <ChartPlaceholder title="Subject-wise Average Scores" type="bar" />
                </Section>

                {/* Achievements */}
                <Section title="Achievements & Badges">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        {achievements.map((achievement) => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                        ))}
                    </div>
                </Section>

                {/* Recent Feedback */}
                <Section title="Recent Feedback">
                    {recentFeedback.map((feedback) => (
                        <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))}
                </Section>

                {/* AI-Suggested Improvements */}
                <Section title="AI-Suggested Improvements">
                    {improvements.map((item) => (
                        <ImprovementCard key={item.id} item={item} />
                    ))}
                </Section>

                {/* Peer Comparison */}
                <Section title="Compare with Peers">
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            padding: "16px",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                            <div>
                                <div style={{ fontSize: "12px", color: "#6B7280" }}>Your Rank</div>
                                <div style={{ fontSize: "24px", fontWeight: 700 }}>#{peerComparison.yourRank}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "12px", color: "#6B7280" }}>Percentile</div>
                                <div style={{ fontSize: "24px", fontWeight: 700, color: "#10B981" }}>
                                    {peerComparison.percentile}%
                                </div>
                            </div>
                        </div>
                        <div style={{ fontSize: "12px", color: "#6B7280", textAlign: "center" }}>
                            Out of {peerComparison.totalTeachers} teachers • Dept. avg: {peerComparison.departmentAverage}/5.0
                        </div>
                    </div>
                </Section>

                {/* Export Button */}
                <button
                    onClick={() => alert("Exporting performance report...")}
                    style={{
                        width: "100%",
                        padding: "16px",
                        backgroundColor: "#5B47FB",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginTop: "16px",
                        minHeight: "44px",
                    }}
                    aria-label="Export performance report"
                >
                    📥 Export Performance Report
                </button>
            </div>
        </div>
    )
}

// Helper Components
function MetricCard({ title, value, icon, trend, suffix = "" }: any) {
    return (
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
            <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
                {value}
                <span style={{ fontSize: "14px", color: "#6B7280" }}>{suffix}</span>
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>{title}</div>
            <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>{trend}</div>
        </div>
    )
}

function Section({ title, children }: any) {
    return (
        <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: "#111827" }}>
                {title}
            </h2>
            {children}
        </div>
    )
}

function IndicatorBar({ label, value, max, color }: any) {
    const percentage = (value / max) * 100
    return (
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color }}>
                    {value.toFixed(1)}/{max}
                </span>
            </div>
            <div style={{ height: "8px", backgroundColor: "#F3F4F6", borderRadius: "4px", overflow: "hidden" }}>
                <div
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        backgroundColor: color,
                        borderRadius: "4px",
                        transition: "width 0.3s ease",
                    }}
                />
            </div>
        </div>
    )
}

function ChartPlaceholder({ title, type }: any) {
    return (
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>{title}</div>
            <div
                style={{
                    height: "120px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6B7280",
                    fontSize: "14px",
                }}
            >
                {type === "line" ? "📈" : "📊"} {type === "line" ? "Line" : "Bar"} chart visualization
            </div>
        </div>
    )
}

function AchievementCard({ achievement }: any) {
    return (
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{achievement.icon}</div>
            <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{achievement.title}</div>
            <div style={{ fontSize: "10px", color: "#6B7280" }}>{achievement.date}</div>
        </div>
    )
}

function FeedbackCard({ feedback }: any) {
    return (
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#5B47FB" }}>{feedback.type}</span>
                <span style={{ fontSize: "12px", color: "#6B7280" }}>{feedback.date}</span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px", lineHeight: "1.5" }}>
                "{feedback.text}"
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>— {feedback.author}</div>
        </div>
    )
}

function ImprovementCard({ item }: any) {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                borderLeft: "4px solid #F59E0B",
            }}
        >
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                💡 {item.title}
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>{item.description}</div>
        </div>
    )
}

addPropertyControls(TeacherPerformanceDashboard, {
    width: {
        type: ControlType.Number,
        defaultValue: 390,
        min: 320,
        max: 1200,
    },
    height: {
        type: ControlType.Number,
        defaultValue: 844,
        min: 600,
        max: 1200,
    },
})
