import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * AttendanceHistory Component (Screen 15)
 *
 * Monthly calendar view with attendance marks, bulk edit features, and export reports.
 * Provides complete attendance history management with visual calendar interface.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

interface AttendanceRecord {
    studentId: string
    studentName: string
    date: string
    status: "present" | "absent" | "late"
    note?: string
}

interface Student {
    id: string
    name: string
    rollNumber: string
    avatar: string
    attendancePercentage: number
}

export function AttendanceHistory(props) {
    const {
        className,
        primaryColor,
        successColor,
        errorColor,
        warningColor,
        backgroundColor,
        students: studentsCount,
        showCalendar,
        showStudentView,
        enableExport,
        enableBulkEdit,
    } = props

    const [selectedView, setSelectedView] = useState<"calendar" | "student">(
        showCalendar ? "calendar" : "student"
    )
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [bulkEditMode, setBulkEditMode] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
        new Set()
    )
    const [filterStatus, setFilterStatus] = useState<
        "all" | "present" | "absent" | "late"
    >("all")

    // Mock data
    const mockStudents: Student[] = Array.from(
        { length: studentsCount },
        (_, i) => ({
            id: `student-${i + 1}`,
            name: `Student ${i + 1}`,
            rollNumber: `R${String(i + 1).padStart(3, "0")}`,
            avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
            attendancePercentage: Math.floor(Math.random() * 30 + 70),
        })
    )

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(selectedMonth)
        const firstDay = getFirstDayOfMonth(selectedMonth)
        const days = []

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day)
        }

        return days
    }

    const getAttendanceStatus = (day: number) => {
        // Mock: Generate random status
        const random = Math.random()
        if (random > 0.8) return "absent"
        if (random > 0.7) return "late"
        return "present"
    }

    const getStatusColor = (
        status: "present" | "absent" | "late" | null
    ) => {
        if (status === "present") return successColor
        if (status === "absent") return errorColor
        if (status === "late") return warningColor
        return "#E5E7EB"
    }

    const handleExport = () => {
        console.log("Exporting attendance data...")
        // Implementation would export to CSV/PDF/Excel
    }

    const handleBulkEdit = () => {
        console.log(
            "Bulk editing students:",
            Array.from(selectedStudents)
        )
        // Implementation would apply bulk changes
    }

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor,
                display: "flex",
                flexDirection: "column",
                fontFamily: "Inter, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: "#111827",
                                margin: 0,
                            }}
                        >
                            Attendance History
                        </h1>
                        <p
                            style={{
                                fontSize: 14,
                                color: "#6B7280",
                                margin: "4px 0 0 0",
                            }}
                        >
                            {studentsCount} students · {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                        </p>
                    </div>
                    {enableExport && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExport}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: primaryColor,
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: 12,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Export
                        </motion.button>
                    )}
                </div>

                {/* View Toggle */}
                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        gap: 12,
                    }}
                >
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedView("calendar")}
                        style={{
                            padding: "8px 16px",
                            backgroundColor:
                                selectedView === "calendar"
                                    ? primaryColor
                                    : "#F3F4F6",
                            color:
                                selectedView === "calendar"
                                    ? "#FFFFFF"
                                    : "#6B7280",
                            border: "none",
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Calendar View
                    </motion.button>
                    {showStudentView && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedView("student")}
                            style={{
                                padding: "8px 16px",
                                backgroundColor:
                                    selectedView === "student"
                                        ? primaryColor
                                        : "#F3F4F6",
                                color:
                                    selectedView === "student"
                                        ? "#FFFFFF"
                                        : "#6B7280",
                                border: "none",
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Student View
                        </motion.button>
                    )}
                    {enableBulkEdit && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                                setBulkEditMode(!bulkEditMode)
                            }
                            style={{
                                padding: "8px 16px",
                                backgroundColor: bulkEditMode
                                    ? warningColor
                                    : "#F3F4F6",
                                color: bulkEditMode
                                    ? "#FFFFFF"
                                    : "#6B7280",
                                border: "none",
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            {bulkEditMode ? "Cancel Bulk Edit" : "Bulk Edit"}
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Content Area */}
            <div
                style={{
                    flex: 1,
                    padding: 24,
                    overflowY: "auto",
                }}
            >
                <AnimatePresence mode="wait">
                    {selectedView === "calendar" ? (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {/* Month Navigation */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 20,
                                }}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        const newDate = new Date(
                                            selectedMonth
                                        )
                                        newDate.setMonth(
                                            newDate.getMonth() - 1
                                        )
                                        setSelectedMonth(newDate)
                                    }}
                                    style={{
                                        padding: 10,
                                        backgroundColor: "#FFFFFF",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: 10,
                                        cursor: "pointer",
                                        fontSize: 18,
                                    }}
                                >
                                    ←
                                </motion.button>
                                <h2
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: "#111827",
                                    }}
                                >
                                    {monthNames[selectedMonth.getMonth()]}{" "}
                                    {selectedMonth.getFullYear()}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        const newDate = new Date(
                                            selectedMonth
                                        )
                                        newDate.setMonth(
                                            newDate.getMonth() + 1
                                        )
                                        setSelectedMonth(newDate)
                                    }}
                                    style={{
                                        padding: 10,
                                        backgroundColor: "#FFFFFF",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: 10,
                                        cursor: "pointer",
                                        fontSize: 18,
                                    }}
                                >
                                    →
                                </motion.button>
                            </div>

                            {/* Calendar Grid */}
                            <div
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: 16,
                                    padding: 20,
                                    boxShadow:
                                        "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                {/* Day Headers */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(7, 1fr)",
                                        gap: 8,
                                        marginBottom: 12,
                                    }}
                                >
                                    {[
                                        "Sun",
                                        "Mon",
                                        "Tue",
                                        "Wed",
                                        "Thu",
                                        "Fri",
                                        "Sat",
                                    ].map((day) => (
                                        <div
                                            key={day}
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: "#6B7280",
                                                textAlign: "center",
                                            }}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(7, 1fr)",
                                        gap: 8,
                                    }}
                                >
                                    {generateCalendarDays().map(
                                        (day, index) => {
                                            if (day === null) {
                                                return (
                                                    <div
                                                        key={`empty-${index}`}
                                                    />
                                                )
                                            }

                                            const status =
                                                getAttendanceStatus(day)
                                            const isToday =
                                                day ===
                                                    new Date().getDate() &&
                                                selectedMonth.getMonth() ===
                                                    new Date().getMonth()

                                            return (
                                                <motion.div
                                                    key={day}
                                                    whileHover={{
                                                        scale: 1.05,
                                                    }}
                                                    whileTap={{
                                                        scale: 0.95,
                                                    }}
                                                    onClick={() =>
                                                        setSelectedDate(
                                                            new Date(
                                                                selectedMonth.getFullYear(),
                                                                selectedMonth.getMonth(),
                                                                day
                                                            )
                                                        )
                                                    }
                                                    style={{
                                                        aspectRatio: "1",
                                                        display: "flex",
                                                        flexDirection:
                                                            "column",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        backgroundColor:
                                                            getStatusColor(
                                                                status
                                                            ),
                                                        borderRadius: 12,
                                                        cursor: "pointer",
                                                        border: isToday
                                                            ? `2px solid ${primaryColor}`
                                                            : "none",
                                                        position:
                                                            "relative",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            color:
                                                                status
                                                                    ? "#FFFFFF"
                                                                    : "#111827",
                                                        }}
                                                    >
                                                        {day}
                                                    </span>
                                                </motion.div>
                                            )
                                        }
                                    )}
                                </div>

                                {/* Legend */}
                                <div
                                    style={{
                                        marginTop: 20,
                                        display: "flex",
                                        gap: 20,
                                        justifyContent: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                backgroundColor:
                                                    successColor,
                                                borderRadius: 4,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 12,
                                                color: "#6B7280",
                                            }}
                                        >
                                            Present
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                backgroundColor: errorColor,
                                                borderRadius: 4,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 12,
                                                color: "#6B7280",
                                            }}
                                        >
                                            Absent
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                backgroundColor:
                                                    warningColor,
                                                borderRadius: 4,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 12,
                                                color: "#6B7280",
                                            }}
                                        >
                                            Late
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="student"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Student List View */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {mockStudents.map((student) => (
                                    <motion.div
                                        key={student.id}
                                        whileHover={{ scale: 1.02 }}
                                        style={{
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: 16,
                                            padding: 20,
                                            boxShadow:
                                                "0 1px 3px rgba(0,0,0,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 16,
                                        }}
                                    >
                                        {bulkEditMode && (
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.has(
                                                    student.id
                                                )}
                                                onChange={(e) => {
                                                    const newSet = new Set(
                                                        selectedStudents
                                                    )
                                                    if (
                                                        e.target.checked
                                                    ) {
                                                        newSet.add(
                                                            student.id
                                                        )
                                                    } else {
                                                        newSet.delete(
                                                            student.id
                                                        )
                                                    }
                                                    setSelectedStudents(
                                                        newSet
                                                    )
                                                }}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    cursor: "pointer",
                                                }}
                                            />
                                        )}
                                        <img
                                            src={student.avatar}
                                            alt={student.name}
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: "50%",
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <h3
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    color: "#111827",
                                                    margin: 0,
                                                }}
                                            >
                                                {student.name}
                                            </h3>
                                            <p
                                                style={{
                                                    fontSize: 14,
                                                    color: "#6B7280",
                                                    margin: "4px 0 0 0",
                                                }}
                                            >
                                                {student.rollNumber}
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "right",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 24,
                                                    fontWeight: 700,
                                                    color:
                                                        student.attendancePercentage >=
                                                        80
                                                            ? successColor
                                                            : student.attendancePercentage >=
                                                              60
                                                            ? warningColor
                                                            : errorColor,
                                                }}
                                            >
                                                {
                                                    student.attendancePercentage
                                                }
                                                %
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "#6B7280",
                                                    marginTop: 4,
                                                }}
                                            >
                                                Attendance
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bulk Edit Actions */}
                            {bulkEditMode &&
                                selectedStudents.size > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            position: "fixed",
                                            bottom: 24,
                                            left: 24,
                                            right: 24,
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: 16,
                                            padding: 20,
                                            boxShadow:
                                                "0 10px 25px rgba(0,0,0,0.15)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent:
                                                "space-between",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "#111827",
                                            }}
                                        >
                                            {selectedStudents.size} students
                                            selected
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleBulkEdit}
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor:
                                                    primaryColor,
                                                color: "#FFFFFF",
                                                border: "none",
                                                borderRadius: 12,
                                                fontSize: 14,
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Apply Changes
                                        </motion.button>
                                    </motion.div>
                                )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

AttendanceHistory.defaultProps = {
    primaryColor: "#5B47FB",
    successColor: "#10B981",
    errorColor: "#EF4444",
    warningColor: "#F59E0B",
    backgroundColor: "#F9FAFB",
    students: 38,
    showCalendar: true,
    showStudentView: true,
    enableExport: true,
    enableBulkEdit: true,
}

addPropertyControls(AttendanceHistory, {
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#5B47FB",
    },
    successColor: {
        type: ControlType.Color,
        title: "Success Color",
        defaultValue: "#10B981",
    },
    errorColor: {
        type: ControlType.Color,
        title: "Error Color",
        defaultValue: "#EF4444",
    },
    warningColor: {
        type: ControlType.Color,
        title: "Warning Color",
        defaultValue: "#F59E0B",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#F9FAFB",
    },
    students: {
        type: ControlType.Number,
        title: "Students",
        min: 1,
        max: 200,
        defaultValue: 38,
    },
    showCalendar: {
        type: ControlType.Boolean,
        title: "Show Calendar",
        defaultValue: true,
    },
    showStudentView: {
        type: ControlType.Boolean,
        title: "Show Student View",
        defaultValue: true,
    },
    enableExport: {
        type: ControlType.Boolean,
        title: "Enable Export",
        defaultValue: true,
    },
    enableBulkEdit: {
        type: ControlType.Boolean,
        title: "Enable Bulk Edit",
        defaultValue: true,
    },
})
