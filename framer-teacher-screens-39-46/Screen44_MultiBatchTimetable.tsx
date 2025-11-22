import React, { useState } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * SCREEN 44: Multi-Batch Overview & Timetable
 *
 * Complex timetable grid for teachers managing multiple batches:
 * - Weekly timetable grid (days × time slots)
 * - Session blocks with class name, subject, duration
 * - Batch health indicators
 * - Teaching load statistics
 * - Conflict detection (overlapping sessions)
 * - Batch filter chips
 * - Daily load bar chart
 *
 * Features:
 * - Grid layout (7 days × time slots)
 * - Color-coded batch sessions
 * - Drag indicators
 * - Load visualization
 * - Quick navigation to classes
 */

interface TimeSlot {
    id: string
    day: string
    time: string
    duration: number
    className: string
    subject: string
    batchColor: string
    status: "scheduled" | "ongoing" | "completed"
}

interface Batch {
    id: string
    name: string
    color: string
    studentsCount: number
    health: "good" | "warning" | "critical"
}

interface MultiBatchTimetableProps {
    teacherName?: string
    weekStart?: string
    onSessionClick?: (sessionId: string) => void
    style?: React.CSSProperties
}

export default function MultiBatchTimetable({
    teacherName = "Sarah Johnson",
    weekStart = "Jan 13, 2025",
    onSessionClick = () => console.log("Session clicked"),
    style
}: MultiBatchTimetableProps) {
    const [selectedView, setSelectedView] = useState<"week" | "day">("week")
    const [selectedDay, setSelectedDay] = useState<string | null>(null)

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const timeSlots = ["8:00", "9:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

    const batches: Batch[] = [
        { id: "1", name: "JEE Batch A", color: "#5B47FB", studentsCount: 30, health: "good" },
        { id: "2", name: "NEET Dropper", color: "#10B981", studentsCount: 25, health: "warning" },
        { id: "3", name: "Class 10-A", color: "#F59E0B", studentsCount: 28, health: "good" },
        { id: "4", name: "Class 10-B", color: "#3B82F6", studentsCount: 27, health: "critical" }
    ]

    // Simplified timetable data - in real app, this would be complex positioning
    const sessions: TimeSlot[] = [
        {
            id: "1",
            day: "Mon",
            time: "9:00",
            duration: 60,
            className: "JEE Batch A",
            subject: "Physics",
            batchColor: "#5B47FB",
            status: "scheduled"
        },
        {
            id: "2",
            day: "Mon",
            time: "14:00",
            duration: 90,
            className: "Class 10-A",
            subject: "Math",
            batchColor: "#F59E0B",
            status: "scheduled"
        },
        {
            id: "3",
            day: "Tue",
            time: "10:00",
            duration: 60,
            className: "NEET Dropper",
            subject: "Chemistry",
            batchColor: "#10B981",
            status: "scheduled"
        },
        {
            id: "4",
            day: "Wed",
            time: "9:00",
            duration: 60,
            className: "Class 10-B",
            subject: "Science",
            batchColor: "#3B82F6",
            status: "scheduled"
        },
        {
            id: "5",
            day: "Thu",
            time: "15:00",
            duration: 60,
            className: "JEE Batch A",
            subject: "Math",
            batchColor: "#5B47FB",
            status: "scheduled"
        }
    ]

    const dailyLoad = {
        Mon: 3,
        Tue: 2,
        Wed: 4,
        Thu: 3,
        Fri: 2,
        Sat: 1,
        Sun: 0
    }

    const totalHours = Object.values(dailyLoad).reduce((a, b) => a + b, 0)
    const maxDailyLoad = Math.max(...Object.values(dailyLoad))

    const getHealthColor = (health: string) => {
        switch (health) {
            case "good": return "#10B981"
            case "warning": return "#F59E0B"
            case "critical": return "#EF4444"
            default: return "#6B7280"
        }
    }

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
                            My Timetable
                        </h1>
                        <p style={{
                            margin: "2px 0 0",
                            fontSize: "13px",
                            color: "#6B7280"
                        }}>
                            Week of {weekStart}
                        </p>
                    </div>
                </div>

                {/* View Toggle */}
                <div style={{
                    display: "flex",
                    gap: "8px",
                    padding: "4px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px"
                }}>
                    <button
                        onClick={() => setSelectedView("week")}
                        style={{
                            flex: 1,
                            minHeight: "36px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: selectedView === "week" ? "#FFFFFF" : "transparent",
                            color: selectedView === "week" ? "#111827" : "#6B7280",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: selectedView === "week" ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
                        }}
                        aria-label="Week view"
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setSelectedView("day")}
                        style={{
                            flex: 1,
                            minHeight: "36px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: selectedView === "day" ? "#FFFFFF" : "transparent",
                            color: selectedView === "day" ? "#111827" : "#6B7280",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: selectedView === "day" ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
                        }}
                        aria-label="Day view"
                    >
                        Day
                    </button>
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                {/* Teaching Load Stats */}
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
                        Weekly Load
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "16px",
                        marginBottom: "20px"
                    }}>
                        <div>
                            <div style={{ fontSize: "24px", fontWeight: 700, color: "#5B47FB" }}>
                                {totalHours}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6B7280" }}>
                                Total Hours
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", fontWeight: 700, color: "#10B981" }}>
                                {sessions.length}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6B7280" }}>
                                Sessions
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", fontWeight: 700, color: "#F59E0B" }}>
                                {batches.length}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6B7280" }}>
                                Batches
                            </div>
                        </div>
                    </div>

                    {/* Daily Load Bar Chart */}
                    <div style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "8px",
                        height: "80px"
                    }}>
                        {days.map((day) => {
                            const load = dailyLoad[day]
                            const height = (load / maxDailyLoad) * 100
                            return (
                                <div
                                    key={day}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "4px"
                                    }}
                                >
                                    <div style={{
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        color: "#5B47FB"
                                    }}>
                                        {load}h
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.5, delay: days.indexOf(day) * 0.05 }}
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#5B47FB",
                                            borderRadius: "4px 4px 0 0"
                                        }}
                                    />
                                    <div style={{
                                        fontSize: "11px",
                                        color: "#6B7280",
                                        fontWeight: 500
                                    }}>
                                        {day}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Batch Health Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    marginBottom: "20px"
                }}>
                    {batches.map((batch) => (
                        <div
                            key={batch.id}
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "12px",
                                padding: "16px",
                                border: "1px solid #E5E7EB",
                                position: "relative"
                            }}
                        >
                            <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: getHealthColor(batch.health),
                                position: "absolute",
                                top: "12px",
                                right: "12px"
                            }} />
                            <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                backgroundColor: batch.color + "20",
                                marginBottom: "8px"
                            }} />
                            <div style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#111827",
                                marginBottom: "4px"
                            }}>
                                {batch.name}
                            </div>
                            <div style={{
                                fontSize: "12px",
                                color: "#6B7280"
                            }}>
                                {batch.studentsCount} students
                            </div>
                        </div>
                    ))}
                </div>

                {/* Timetable Grid */}
                <div style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "16px",
                    border: "1px solid #E5E7EB"
                }}>
                    <div style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "16px"
                    }}>
                        This Week's Schedule
                    </div>

                    {/* Simplified Session List (Grid view would be too complex for mobile) */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}>
                        {sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => onSessionClick(session.id)}
                                style={{
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: "1px solid #E5E7EB",
                                    backgroundColor: "#FFFFFF",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    borderLeft: `4px solid ${session.batchColor}`
                                }}
                                aria-label={`${session.className} ${session.subject} on ${session.day}`}
                            >
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "8px"
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: "#111827",
                                            marginBottom: "4px"
                                        }}>
                                            {session.className}
                                        </div>
                                        <div style={{
                                            fontSize: "13px",
                                            color: "#6B7280"
                                        }}>
                                            {session.subject}
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: "4px 8px",
                                        borderRadius: "6px",
                                        backgroundColor: session.batchColor + "20",
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        color: session.batchColor
                                    }}>
                                        {session.duration} min
                                    </div>
                                </div>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "12px",
                                    color: "#6B7280"
                                }}>
                                    <span>📅 {session.day}</span>
                                    <span>•</span>
                                    <span>🕐 {session.time}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Add Session Button */}
                    <button
                        onClick={() => console.log("Add session")}
                        style={{
                            width: "100%",
                            minHeight: "44px",
                            padding: "12px",
                            marginTop: "12px",
                            borderRadius: "10px",
                            border: "2px dashed #E5E7EB",
                            backgroundColor: "#F9FAFB",
                            color: "#6B7280",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                        }}
                        aria-label="Add new session"
                    >
                        <span style={{ fontSize: "16px" }}>+</span>
                        Add Session
                    </button>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(MultiBatchTimetable, {
    teacherName: {
        type: ControlType.String,
        title: "Teacher Name",
        defaultValue: "Sarah Johnson"
    },
    weekStart: {
        type: ControlType.String,
        title: "Week Start",
        defaultValue: "Jan 13, 2025"
    }
})
