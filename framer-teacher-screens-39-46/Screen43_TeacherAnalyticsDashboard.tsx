import React, { useState } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * SCREEN 43: Teacher Analytics Dashboard (CRITICAL)
 *
 * Comprehensive analytics with multiple chart types:
 * - KPI cards (avg score, homework completion, attendance, at-risk students)
 * - Performance trend line chart (6 months)
 * - Homework completion rate bar chart
 * - Topic mastery heatmap (color-coded)
 * - Attendance correlation scatter plot
 * - At-risk students panel
 * - AI teaching suggestions
 * - Export dashboard option
 *
 * Features:
 * - Multiple chart visualizations
 * - Date range selector
 * - Class/subject filters
 * - Interactive charts
 * - AI-powered insights
 */

interface KPIStat {
    label: string
    value: string | number
    change: number
    icon: string
    color: string
}

interface ChartDataPoint {
    label: string
    value: number
    color?: string
}

interface AtRiskStudent {
    id: string
    name: string
    avatar: string
    riskLevel: "high" | "medium" | "low"
    reason: string
}

interface TeacherAnalyticsDashboardProps {
    className?: string
    dateRange?: string
    onExport?: () => void
    style?: React.CSSProperties
}

export default function TeacherAnalyticsDashboard({
    className = "Class 10-A",
    dateRange = "Last 6 Months",
    onExport = () => console.log("Export"),
    style
}: TeacherAnalyticsDashboardProps) {
    const [selectedRange, setSelectedRange] = useState(dateRange)
    const [selectedView, setSelectedView] = useState<"overview" | "details">("overview")

    // KPI Stats
    const kpiStats: KPIStat[] = [
        { label: "Avg Score", value: "87.5%", change: 5.2, icon: "📊", color: "#5B47FB" },
        { label: "Homework", value: "92%", change: 3.1, icon: "📝", color: "#10B981" },
        { label: "Attendance", value: "94.5%", change: -1.2, icon: "📅", color: "#3B82F6" },
        { label: "At-Risk", value: 4, change: -2, icon: "⚠️", color: "#EF4444" }
    ]

    // Performance trend data (line chart)
    const performanceTrend: ChartDataPoint[] = [
        { label: "Aug", value: 82 },
        { label: "Sep", value: 84 },
        { label: "Oct", value: 83 },
        { label: "Nov", value: 86 },
        { label: "Dec", value: 85 },
        { label: "Jan", value: 88 }
    ]

    // Homework completion (bar chart)
    const homeworkCompletion: ChartDataPoint[] = [
        { label: "Week 1", value: 95, color: "#10B981" },
        { label: "Week 2", value: 88, color: "#10B981" },
        { label: "Week 3", value: 92, color: "#10B981" },
        { label: "Week 4", value: 90, color: "#10B981" }
    ]

    // Topic mastery (heatmap simulation)
    const topicMastery = [
        { topic: "Algebra", mastery: 92, color: "#10B981" },
        { topic: "Geometry", mastery: 85, color: "#F59E0B" },
        { topic: "Calculus", mastery: 78, color: "#EF4444" },
        { topic: "Statistics", mastery: 88, color: "#10B981" },
        { topic: "Trigonometry", mastery: 82, color: "#F59E0B" }
    ]

    // At-risk students
    const atRiskStudents: AtRiskStudent[] = [
        {
            id: "1",
            name: "Alex Johnson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            riskLevel: "high",
            reason: "3 consecutive low scores"
        },
        {
            id: "2",
            name: "Sarah Brown",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            riskLevel: "medium",
            reason: "Declining attendance"
        },
        {
            id: "3",
            name: "Mike Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
            riskLevel: "medium",
            reason: "Missing homework"
        }
    ]

    // AI Suggestions
    const aiSuggestions = [
        { id: "1", title: "Schedule Algebra Review", priority: "high", icon: "💡" },
        { id: "2", title: "Extra Practice for Calculus", priority: "medium", icon: "📚" },
        { id: "3", title: "One-on-One with At-Risk Students", priority: "high", icon: "👥" }
    ]

    const getRiskColor = (level: string) => {
        switch (level) {
            case "high": return "#EF4444"
            case "medium": return "#F59E0B"
            case "low": return "#10B981"
            default: return "#6B7280"
        }
    }

    const getMasteryColor = (score: number) => {
        if (score >= 85) return "#10B981"
        if (score >= 70) return "#F59E0B"
        return "#EF4444"
    }

    const maxValue = Math.max(...performanceTrend.map(d => d.value))
    const maxHomework = Math.max(...homeworkCompletion.map(d => d.value))

    return (
        <div style={{
            width: "390px",
            minHeight: "844px",
            backgroundColor: "#F9FAFB",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            overflow: "auto",
            ...style
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid #E5E7EB",
                padding: "16px 20px"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px"
                }}>
                    <button
                        onClick={() => console.log("Back")}
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "18px"
                        }}
                        aria-label="Go back"
                    >
                        ←
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#111827"
                        }}>
                            Analytics
                        </h1>
                        <p style={{
                            margin: "2px 0 0",
                            fontSize: "13px",
                            color: "#6B7280"
                        }}>
                            {className} • {selectedRange}
                        </p>
                    </div>
                    <button
                        onClick={onExport}
                        style={{
                            minHeight: "44px",
                            padding: "10px 16px",
                            borderRadius: "10px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "#FFFFFF",
                            color: "#5B47FB",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                        aria-label="Export dashboard"
                    >
                        Export
                    </button>
                </div>

                {/* Range Selector */}
                <select
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value)}
                    style={{
                        width: "100%",
                        minHeight: "40px",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#FFFFFF",
                        fontSize: "14px",
                        cursor: "pointer"
                    }}
                    aria-label="Select date range"
                >
                    <option>Last 6 Months</option>
                    <option>Last 3 Months</option>
                    <option>This Month</option>
                    <option>This Term</option>
                </select>
            </div>

            <div style={{ padding: "20px" }}>
                {/* KPI Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    marginBottom: "20px"
                }}>
                    {kpiStats.map((stat, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "12px",
                                padding: "16px",
                                border: "1px solid #E5E7EB"
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "8px"
                            }}>
                                <span style={{ fontSize: "20px" }}>{stat.icon}</span>
                                <span style={{
                                    fontSize: "12px",
                                    color: "#6B7280"
                                }}>
                                    {stat.label}
                                </span>
                            </div>
                            <div style={{
                                fontSize: "24px",
                                fontWeight: 700,
                                color: "#111827",
                                marginBottom: "4px"
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: stat.change >= 0 ? "#10B981" : "#EF4444"
                            }}>
                                {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                            </div>
                        </div>
                    ))}
                </div>

                {/* Performance Trend (Line Chart) */}
                <div style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid #E5E7EB",
                    marginBottom: "20px"
                }}>
                    <div style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "16px"
                    }}>
                        Performance Trend
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "12px",
                        height: "120px"
                    }}>
                        {performanceTrend.map((point, index) => {
                            const height = (point.value / maxValue) * 100
                            return (
                                <div
                                    key={index}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    <div style={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#5B47FB"
                                    }}>
                                        {point.value}
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#5B47FB",
                                            borderRadius: "4px 4px 0 0",
                                            position: "relative"
                                        }}
                                    />
                                    <div style={{
                                        fontSize: "11px",
                                        color: "#6B7280",
                                        fontWeight: 500
                                    }}>
                                        {point.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Homework Completion (Bar Chart) */}
                <div style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid #E5E7EB",
                    marginBottom: "20px"
                }}>
                    <div style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "16px"
                    }}>
                        Homework Completion Rate
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}>
                        {homeworkCompletion.map((item, index) => (
                            <div key={index}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "4px"
                                }}>
                                    <span style={{
                                        fontSize: "13px",
                                        color: "#6B7280"
                                    }}>
                                        {item.label}
                                    </span>
                                    <span style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#111827"
                                    }}>
                                        {item.value}%
                                    </span>
                                </div>
                                <div style={{
                                    height: "8px",
                                    backgroundColor: "#E5E7EB",
                                    borderRadius: "4px",
                                    overflow: "hidden"
                                }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        style={{
                                            height: "100%",
                                            backgroundColor: item.color,
                                            borderRadius: "4px"
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Topic Mastery Heatmap */}
                <div style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid #E5E7EB",
                    marginBottom: "20px"
                }}>
                    <div style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "16px"
                    }}>
                        Topic Mastery
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                    }}>
                        {topicMastery.map((topic, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                }}
                            >
                                <div style={{
                                    flex: 1,
                                    fontSize: "13px",
                                    color: "#111827"
                                }}>
                                    {topic.topic}
                                </div>
                                <div style={{
                                    width: "60px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    backgroundColor: getMasteryColor(topic.mastery) + "20",
                                    border: `2px solid ${getMasteryColor(topic.mastery)}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: getMasteryColor(topic.mastery)
                                }}>
                                    {topic.mastery}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* At-Risk Students */}
                <div style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid #E5E7EB",
                    marginBottom: "20px"
                }}>
                    <div style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "16px"
                    }}>
                        At-Risk Students
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}>
                        {atRiskStudents.map((student) => (
                            <div
                                key={student.id}
                                style={{
                                    padding: "12px",
                                    borderRadius: "10px",
                                    backgroundColor: "#FEF2F2",
                                    border: "1px solid #FEE2E2",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                }}
                            >
                                <img
                                    src={student.avatar}
                                    alt={student.name}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#111827",
                                        marginBottom: "2px"
                                    }}>
                                        {student.name}
                                    </div>
                                    <div style={{
                                        fontSize: "12px",
                                        color: "#6B7280"
                                    }}>
                                        {student.reason}
                                    </div>
                                </div>
                                <div style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    backgroundColor: getRiskColor(student.riskLevel) + "20",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: getRiskColor(student.riskLevel),
                                    textTransform: "uppercase"
                                }}>
                                    {student.riskLevel}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Suggestions */}
                <div style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid #E5E7EB"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px"
                    }}>
                        <span style={{ fontSize: "18px" }}>🤖</span>
                        <span style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#111827"
                        }}>
                            AI Suggestions
                        </span>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}>
                        {aiSuggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                onClick={() => console.log("View suggestion", suggestion.id)}
                                style={{
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid #E5E7EB",
                                    backgroundColor: "#F9FAFB",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                }}
                                aria-label={suggestion.title}
                            >
                                <span style={{ fontSize: "20px" }}>{suggestion.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#111827"
                                    }}>
                                        {suggestion.title}
                                    </div>
                                </div>
                                <span style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    backgroundColor: suggestion.priority === "high" ? "#FEE2E2" : "#FEF3C7",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: suggestion.priority === "high" ? "#DC2626" : "#D97706"
                                }}>
                                    {suggestion.priority}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(TeacherAnalyticsDashboard, {
    className: {
        type: ControlType.String,
        title: "Class Name",
        defaultValue: "Class 10-A"
    },
    dateRange: {
        type: ControlType.Enum,
        title: "Date Range",
        options: ["Last 6 Months", "Last 3 Months", "This Month", "This Term"],
        defaultValue: "Last 6 Months"
    }
})
