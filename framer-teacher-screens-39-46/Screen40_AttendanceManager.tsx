import React, { useState } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * SCREEN 40: Attendance Manager
 *
 * Monthly calendar view with attendance tracking:
 * - Calendar grid showing month view
 * - Color-coded attendance markers (Present/Absent/Late/Holiday)
 * - Class and date range selectors
 * - Attendance statistics
 * - Legend for status types
 * - Bulk edit mode
 * - Export reports functionality
 *
 * Features:
 * - Interactive calendar grid
 * - Student list view
 * - Quick mark attendance
 * - Attendance trends
 * - Export options
 * - Fully accessible
 */

interface AttendanceRecord {
    date: string
    status: "present" | "absent" | "late" | "holiday"
    studentCount?: number
    totalStudents?: number
}

interface Student {
    id: string
    name: string
    avatar: string
    status: "present" | "absent" | "late"
}

interface AttendanceManagerProps {
    className?: string
    selectedDate?: string
    onMarkAttendance?: (studentId: string, status: string) => void
    onExport?: () => void
    style?: React.CSSProperties
}

export default function AttendanceManager({
    className = "Class 10-A",
    selectedDate = "2025-01-15",
    onMarkAttendance = () => console.log("Mark attendance"),
    onExport = () => console.log("Export"),
    style
}: AttendanceManagerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)) // January 2025
    const [viewMode, setViewMode] = useState<"calendar" | "daily">("calendar")
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)

    // Mock attendance data
    const attendanceData: Record<string, AttendanceRecord> = {
        "2025-01-06": { date: "2025-01-06", status: "present", studentCount: 28, totalStudents: 30 },
        "2025-01-07": { date: "2025-01-07", status: "present", studentCount: 30, totalStudents: 30 },
        "2025-01-08": { date: "2025-01-08", status: "present", studentCount: 27, totalStudents: 30 },
        "2025-01-09": { date: "2025-01-09", status: "absent", studentCount: 20, totalStudents: 30 },
        "2025-01-10": { date: "2025-01-10", status: "late", studentCount: 25, totalStudents: 30 },
        "2025-01-13": { date: "2025-01-13", status: "present", studentCount: 29, totalStudents: 30 },
        "2025-01-14": { date: "2025-01-14", status: "present", studentCount: 30, totalStudents: 30 },
        "2025-01-15": { date: "2025-01-15", status: "holiday", studentCount: 0, totalStudents: 30 }
    }

    const students: Student[] = [
        { id: "1", name: "Emma Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", status: "present" },
        { id: "2", name: "Liam Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam", status: "present" },
        { id: "3", name: "Olivia Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia", status: "absent" },
        { id: "4", name: "Noah Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah", status: "late" },
        { id: "5", name: "Ava Martinez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava", status: "present" }
    ]

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days: (Date | null)[] = []

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day))
        }

        return days
    }

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "present": return "#10B981"
            case "absent": return "#EF4444"
            case "late": return "#F59E0B"
            case "holiday": return "#9CA3AF"
            default: return "#E5E7EB"
        }
    }

    const days = getDaysInMonth(currentMonth)
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    const stats = {
        totalClasses: 12,
        avgAttendance: 92.5,
        presentDays: 11,
        absentDays: 1
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
                            Attendance
                        </h1>
                        <p style={{
                            margin: "2px 0 0",
                            fontSize: "13px",
                            color: "#6B7280"
                        }}>
                            {className}
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
                        aria-label="Export attendance"
                    >
                        Export
                    </button>
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
                        onClick={() => setViewMode("calendar")}
                        style={{
                            flex: 1,
                            minHeight: "36px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: viewMode === "calendar" ? "#FFFFFF" : "transparent",
                            color: viewMode === "calendar" ? "#111827" : "#6B7280",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: viewMode === "calendar" ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
                        }}
                        aria-label="Calendar view"
                    >
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode("daily")}
                        style={{
                            flex: 1,
                            minHeight: "36px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: viewMode === "daily" ? "#FFFFFF" : "transparent",
                            color: viewMode === "daily" ? "#111827" : "#6B7280",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: viewMode === "daily" ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
                        }}
                        aria-label="Daily view"
                    >
                        Daily List
                    </button>
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                {viewMode === "calendar" ? (
                    <>
                        {/* Stats Cards */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "12px",
                            marginBottom: "20px"
                        }}>
                            <div style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "12px",
                                padding: "16px",
                                border: "1px solid #E5E7EB"
                            }}>
                                <div style={{
                                    fontSize: "13px",
                                    color: "#6B7280",
                                    marginBottom: "4px"
                                }}>
                                    Total Classes
                                </div>
                                <div style={{
                                    fontSize: "24px",
                                    fontWeight: 700,
                                    color: "#111827"
                                }}>
                                    {stats.totalClasses}
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "12px",
                                padding: "16px",
                                border: "1px solid #E5E7EB"
                            }}>
                                <div style={{
                                    fontSize: "13px",
                                    color: "#6B7280",
                                    marginBottom: "4px"
                                }}>
                                    Avg Attendance
                                </div>
                                <div style={{
                                    fontSize: "24px",
                                    fontWeight: 700,
                                    color: "#10B981"
                                }}>
                                    {stats.avgAttendance}%
                                </div>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "16px",
                            padding: "20px",
                            border: "1px solid #E5E7EB",
                            marginBottom: "20px"
                        }}>
                            {/* Month Navigation */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "16px"
                            }}>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "8px",
                                        border: "1px solid #E5E7EB",
                                        backgroundColor: "#FFFFFF",
                                        cursor: "pointer",
                                        fontSize: "16px"
                                    }}
                                    aria-label="Previous month"
                                >
                                    ←
                                </button>
                                <div style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "#111827"
                                }}>
                                    {monthYear}
                                </div>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "8px",
                                        border: "1px solid #E5E7EB",
                                        backgroundColor: "#FFFFFF",
                                        cursor: "pointer",
                                        fontSize: "16px"
                                    }}
                                    aria-label="Next month"
                                >
                                    →
                                </button>
                            </div>

                            {/* Day Headers */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7, 1fr)",
                                gap: "4px",
                                marginBottom: "8px"
                            }}>
                                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            color: "#6B7280",
                                            textAlign: "center",
                                            padding: "4px"
                                        }}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7, 1fr)",
                                gap: "4px"
                            }}>
                                {days.map((day, index) => {
                                    if (!day) {
                                        return <div key={`empty-${index}`} />
                                    }

                                    const dateStr = formatDate(day)
                                    const record = attendanceData[dateStr]
                                    const isToday = dateStr === selectedDate

                                    return (
                                        <button
                                            key={dateStr}
                                            onClick={() => {
                                                setSelectedDay(day)
                                                setViewMode("daily")
                                            }}
                                            style={{
                                                aspectRatio: "1",
                                                borderRadius: "8px",
                                                border: isToday ? `2px solid #5B47FB` : "1px solid #E5E7EB",
                                                backgroundColor: record ? getStatusColor(record.status) + "20" : "#FFFFFF",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                position: "relative"
                                            }}
                                            aria-label={`View attendance for ${day.toLocaleDateString()}`}
                                        >
                                            <div style={{
                                                fontSize: "13px",
                                                fontWeight: isToday ? 700 : 500,
                                                color: record ? "#111827" : "#6B7280"
                                            }}>
                                                {day.getDate()}
                                            </div>
                                            {record && (
                                                <div style={{
                                                    width: "6px",
                                                    height: "6px",
                                                    borderRadius: "50%",
                                                    backgroundColor: getStatusColor(record.status),
                                                    marginTop: "2px"
                                                }}
                                                />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            padding: "16px",
                            border: "1px solid #E5E7EB"
                        }}>
                            <div style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#111827",
                                marginBottom: "12px"
                            }}>
                                Legend
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "12px"
                            }}>
                                {[
                                    { label: "Present", color: "#10B981" },
                                    { label: "Absent", color: "#EF4444" },
                                    { label: "Late", color: "#F59E0B" },
                                    { label: "Holiday", color: "#9CA3AF" }
                                ].map(item => (
                                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{
                                            width: "12px",
                                            height: "12px",
                                            borderRadius: "50%",
                                            backgroundColor: item.color
                                        }} />
                                        <span style={{ fontSize: "13px", color: "#6B7280" }}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Daily List View */
                    <>
                        <div style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "16px",
                            padding: "16px",
                            border: "1px solid #E5E7EB",
                            marginBottom: "12px"
                        }}>
                            <div style={{
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#111827",
                                marginBottom: "4px"
                            }}>
                                Today's Attendance
                            </div>
                            <div style={{
                                fontSize: "13px",
                                color: "#6B7280"
                            }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        {/* Student List */}
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            {students.map(student => (
                                <div
                                    key={student.id}
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        border: "1px solid #E5E7EB",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px"
                                    }}
                                >
                                    <img
                                        src={student.avatar}
                                        alt={student.name}
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                            borderRadius: "50%",
                                            objectFit: "cover"
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: "#111827"
                                        }}>
                                            {student.name}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        {["present", "absent", "late"].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => onMarkAttendance(student.id, status)}
                                                style={{
                                                    width: "36px",
                                                    height: "36px",
                                                    borderRadius: "8px",
                                                    border: student.status === status ? "2px solid" : "1px solid #E5E7EB",
                                                    borderColor: student.status === status ? getStatusColor(status) : "#E5E7EB",
                                                    backgroundColor: student.status === status ? getStatusColor(status) + "20" : "#FFFFFF",
                                                    cursor: "pointer",
                                                    fontSize: "16px"
                                                }}
                                                aria-label={`Mark as ${status}`}
                                            >
                                                {status === "present" && "✓"}
                                                {status === "absent" && "✗"}
                                                {status === "late" && "⏰"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={() => console.log("Submit attendance")}
                            style={{
                                width: "100%",
                                minHeight: "48px",
                                padding: "14px",
                                marginTop: "20px",
                                borderRadius: "12px",
                                border: "none",
                                backgroundColor: "#5B47FB",
                                color: "#FFFFFF",
                                fontSize: "16px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                            aria-label="Submit attendance"
                        >
                            Submit Attendance
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

addPropertyControls(AttendanceManager, {
    className: {
        type: ControlType.String,
        title: "Class Name",
        defaultValue: "Class 10-A"
    },
    selectedDate: {
        type: ControlType.String,
        title: "Selected Date",
        defaultValue: "2025-01-15"
    }
})
