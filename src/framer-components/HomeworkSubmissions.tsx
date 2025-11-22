/**
 * SCREEN 32: Homework/Practice Submissions (Teacher View)
 *
 * Comprehensive submissions dashboard showing student progress, attempts,
 * scores, and performance analytics for homework/practice sets.
 *
 * Features:
 * - Overview metrics (completion rate, average score, attempts)
 * - Student submission list with status badges
 * - Filters: All, Completed, Pending, In Progress, Late
 * - Sort options: Name, Score, Date
 * - Individual submission review
 * - Bulk actions (remind, export)
 * - Performance analytics per student
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981 (Submitted)
 * - Warning: #F59E0B (Pending)
 * - Error: #EF4444 (Late)
 * - Info: #3B82F6 (Graded)
 * - Mobile: 390×844px
 * - Accessibility: WCAG AA
 */

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Student {
    id: string
    name: string
    status: "submitted" | "pending" | "late" | "graded" | "in_progress"
    score?: number
    attempts: number
    submittedAt?: string
    timeSpent?: number
}

interface HomeworkSubmissionsProps {
    primaryColor?: string
    homeworkTitle?: string
    totalStudents?: number
    onViewSubmission?: (studentId: string) => void
}

export default function HomeworkSubmissions({
    primaryColor = "#5B47FB",
    homeworkTitle = "Linear Equations Practice Set - Level 1",
    totalStudents = 38,
    onViewSubmission,
}: HomeworkSubmissionsProps) {
    const [filter, setFilter] = useState<"all" | "submitted" | "pending" | "in_progress" | "late" | "graded">("all")
    const [sortBy, setSortBy] = useState<"name" | "score" | "date">("name")
    const [searchQuery, setSearchQuery] = useState("")

    // Mock data
    const students: Student[] = [
        { id: "1", name: "Rahul Sharma", status: "graded", score: 92, attempts: 1, submittedAt: "2 hours ago", timeSpent: 25 },
        { id: "2", name: "Priya Singh", status: "submitted", score: 85, attempts: 2, submittedAt: "3 hours ago", timeSpent: 32 },
        { id: "3", name: "Arjun Patel", status: "late", score: 68, attempts: 1, submittedAt: "1 day ago", timeSpent: 18 },
        { id: "4", name: "Ananya Gupta", status: "in_progress", attempts: 0, timeSpent: 12 },
        { id: "5", name: "Vikram Kumar", status: "pending", attempts: 0 },
        { id: "6", name: "Sneha Verma", status: "graded", score: 95, attempts: 1, submittedAt: "1 hour ago", timeSpent: 28 },
        { id: "7", name: "Rohan Das", status: "submitted", score: 78, attempts: 1, submittedAt: "4 hours ago", timeSpent: 22 },
        { id: "8", name: "Kavya Reddy", status: "pending", attempts: 0 },
    ]

    const completedCount = students.filter(s => s.status === "submitted" || s.status === "graded").length
    const pendingCount = students.filter(s => s.status === "pending").length
    const inProgressCount = students.filter(s => s.status === "in_progress").length
    const lateCount = students.filter(s => s.status === "late").length
    const avgScore = Math.round(
        students.filter(s => s.score).reduce((acc, s) => acc + (s.score || 0), 0) /
        students.filter(s => s.score).length
    )
    const avgAttempts = (students.reduce((acc, s) => acc + s.attempts, 0) / students.length).toFixed(1)

    const filteredStudents = students.filter(s => {
        if (filter !== "all" && s.status !== filter) return false
        if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    }).sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name)
        if (sortBy === "score") return (b.score || 0) - (a.score || 0)
        if (sortBy === "date") return (b.submittedAt || "").localeCompare(a.submittedAt || "")
        return 0
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "graded": return "#3B82F6"
            case "submitted": return "#10B981"
            case "late": return "#EF4444"
            case "pending": return "#9CA3AF"
            case "in_progress": return "#F59E0B"
            default: return "#6B7280"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "graded": return "Graded"
            case "submitted": return "Submitted"
            case "late": return "Late"
            case "pending": return "Pending"
            case "in_progress": return "In Progress"
            default: return "Unknown"
        }
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#F9FAFB",
            overflow: "auto",
            fontFamily: "Inter, -apple-system, sans-serif",
        }}>
            {/* Header */}
            <div style={{
                padding: "20px",
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid #E5E7EB",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <button
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#F9FAFB",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Go back"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>
                            Homework Submissions
                        </h1>
                        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6B7280" }}>
                            {homeworkTitle}
                        </p>
                    </div>
                    <button
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#F9FAFB",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Export submissions"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 10L12 15L17 10" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15V3" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 10px 10px 40px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "14px",
                            boxSizing: "border-box",
                        }}
                        aria-label="Search students"
                    />
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                    >
                        <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
                        <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            {/* Metrics Cards */}
            <div style={{ padding: "20px" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    marginBottom: "20px"
                }}>
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: "16px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            cursor: "pointer",
                        }}
                        onClick={() => setFilter("all")}
                    >
                        <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>Assigned</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}>{totalStudents}</div>
                    </motion.div>

                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: "16px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            cursor: "pointer",
                        }}
                        onClick={() => setFilter("submitted")}
                    >
                        <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>Completed</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#10B981" }}>{completedCount}</div>
                    </motion.div>

                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: "16px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            cursor: "pointer",
                        }}
                        onClick={() => setFilter("pending")}
                    >
                        <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>Pending</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#F59E0B" }}>{pendingCount}</div>
                    </motion.div>

                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: "16px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            cursor: "pointer",
                        }}
                        onClick={() => setFilter("late")}
                    >
                        <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>Late</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#EF4444" }}>{lateCount}</div>
                    </motion.div>

                    <div style={{
                        padding: "16px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                    }}>
                        <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>Avg Score</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: primaryColor }}>{avgScore}%</div>
                    </div>

                    <div style={{
                        padding: "16px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                    }}>
                        <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>Avg Attempts</div>
                        <div style={{ fontSize: "24px", fontWeight: 700, color: "#6B7280" }}>{avgAttempts}</div>
                    </div>
                </div>

                {/* Filter Chips */}
                <div style={{
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                    marginBottom: "20px",
                    paddingBottom: "4px",
                }}>
                    {[
                        { value: "all", label: "All" },
                        { value: "submitted", label: "Submitted" },
                        { value: "pending", label: "Pending" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "late", label: "Late" },
                        { value: "graded", label: "Graded" },
                    ].map((chip) => (
                        <motion.button
                            key={chip.value}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(chip.value as any)}
                            style={{
                                padding: "8px 16px",
                                border: filter === chip.value ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                borderRadius: "20px",
                                backgroundColor: filter === chip.value ? `${primaryColor}10` : "#FFFFFF",
                                color: filter === chip.value ? primaryColor : "#6B7280",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                            aria-label={`Filter by ${chip.label}`}
                        >
                            {chip.label}
                        </motion.button>
                    ))}
                </div>

                {/* Sort Options */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                        {filteredStudents.length} {filteredStudents.length === 1 ? "Student" : "Students"}
                    </span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{
                            padding: "6px 32px 6px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "6px",
                            fontSize: "13px",
                            backgroundColor: "#FFFFFF",
                            cursor: "pointer",
                        }}
                        aria-label="Sort submissions"
                    >
                        <option value="name">Sort: Name</option>
                        <option value="score">Sort: Score</option>
                        <option value="date">Sort: Date</option>
                    </select>
                </div>

                {/* Student List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <AnimatePresence>
                        {filteredStudents.map((student) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onViewSubmission?.(student.id)}
                                style={{
                                    padding: "16px",
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: "12px",
                                    border: "1px solid #E5E7EB",
                                    cursor: "pointer",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    {/* Avatar */}
                                    <div style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "50%",
                                        backgroundColor: primaryColor,
                                        color: "#FFFFFF",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "18px",
                                        fontWeight: 600,
                                        flexShrink: 0,
                                    }}>
                                        {student.name.charAt(0)}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: "15px",
                                            fontWeight: 600,
                                            color: "#111827",
                                            marginBottom: "4px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {student.name}
                                        </div>
                                        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#6B7280" }}>
                                            {student.submittedAt && (
                                                <span>{student.submittedAt}</span>
                                            )}
                                            {student.attempts > 0 && (
                                                <span>• {student.attempts} {student.attempts === 1 ? "attempt" : "attempts"}</span>
                                            )}
                                            {student.timeSpent && (
                                                <span>• {student.timeSpent}m</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status & Score */}
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        {student.score !== undefined && (
                                            <div style={{
                                                fontSize: "18px",
                                                fontWeight: 700,
                                                color: student.score >= 90 ? "#10B981" : student.score >= 70 ? "#F59E0B" : "#EF4444",
                                                marginBottom: "4px",
                                            }}>
                                                {student.score}%
                                            </div>
                                        )}
                                        <div style={{
                                            padding: "4px 10px",
                                            borderRadius: "12px",
                                            backgroundColor: `${getStatusColor(student.status)}15`,
                                            color: getStatusColor(student.status),
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                        }}>
                                            {getStatusLabel(student.status)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredStudents.length === 0 && (
                    <div style={{
                        padding: "60px 20px",
                        textAlign: "center",
                        color: "#9CA3AF",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                        <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                            No submissions found
                        </div>
                        <div style={{ fontSize: "14px" }}>
                            {searchQuery ? "Try a different search term" : "No students match the selected filter"}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            {pendingCount > 0 && (
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: primaryColor,
                        color: "#FFFFFF",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                    }}
                    aria-label="Send reminder to pending students"
                >
                    🔔
                </motion.button>
            )}
        </div>
    )
}

addPropertyControls(HomeworkSubmissions, {
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#5B47FB",
    },
    homeworkTitle: {
        type: ControlType.String,
        title: "Homework Title",
        defaultValue: "Linear Equations Practice Set - Level 1",
    },
    totalStudents: {
        type: ControlType.Number,
        title: "Total Students",
        defaultValue: 38,
        min: 1,
        max: 200,
        step: 1,
    },
})
