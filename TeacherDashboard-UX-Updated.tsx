// Teacher Dashboard - Updated to WF-HOME-01 UX Wireframe
// Following: C:\PC\Teaher_Wireframe specification

import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import { type CSSProperties } from "react"

interface TeacherDashboardProps {
    teacherName: string
    taskCount: number
    upcomingClasses: number
    toReview: number
    liveTests: number
    unreadChats: number
    backgroundColor: string
    cardBackground: string
    primaryColor: string
    textColor: string
    mutedColor: string
    style?: CSSProperties
}

// SVG Icons
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
)

const MessageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

const MegaphoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 11 18-5v12L3 13v-2z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
)

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

const HelpCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)

/**
 * Teacher Dashboard - WF-HOME-01
 * Following official UX wireframe specification
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function TeacherDashboard(props: TeacherDashboardProps) {
    const {
        teacherName = "Sarah",
        taskCount = 5,
        upcomingClasses = 3,
        toReview = 12,
        liveTests = 2,
        unreadChats = 5,
        backgroundColor = "#F7F7F7",
        cardBackground = "#FFFFFF",
        primaryColor = "#8B5CF6",
        textColor = "#1A1A1A",
        mutedColor = "#6B7280",
    } = props

    const cardStyle: CSSProperties = {
        backgroundColor: cardBackground,
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }

    return (
        <div
            style={{
                width: 390,
                height: 844,
                backgroundColor,
                fontFamily: "Inter, -apple-system, sans-serif",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* ========== 1. APP BAR ========== */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    backgroundColor: cardBackground,
                    borderBottom: `1px solid ${backgroundColor}`,
                }}
            >
                <motion.div whileTap={{ scale: 0.95 }} style={{ cursor: "pointer" }}>
                    <MenuIcon />
                </motion.div>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: textColor }}>
                    Home
                </h1>
                <motion.div
                    whileTap={{ scale: 0.95 }}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: primaryColor,
                        cursor: "pointer",
                    }}
                />
            </motion.div>

            {/* ========== SCROLLABLE CONTENT ========== */}
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>

                {/* ========== 2. WELCOME STRIP ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ marginBottom: 20 }}
                >
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: textColor }}>
                        Good morning, {teacherName}! 👋
                    </h2>
                    <p style={{ margin: "4px 0 0", fontSize: 14, color: mutedColor }}>
                        You have {taskCount} things to do today.
                    </p>
                </motion.div>

                {/* ========== 3. TODAY SNAPSHOT PILLS ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                        marginBottom: 20,
                    }}
                >
                    {[
                        { label: "Upcoming classes", value: upcomingClasses, color: "#DBEAFE", icon: <ClockIcon /> },
                        { label: "To review", value: toReview, color: "#FEF3C7", icon: <CheckIcon /> },
                        { label: "Live tests", value: liveTests, color: "#DCFCE7", icon: <PlayIcon /> },
                        { label: "Unread chats", value: unreadChats, color: "#FCE7F3", icon: <MessageIcon /> },
                    ].map((pill, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                ...cardStyle,
                                padding: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                cursor: "pointer",
                                backgroundColor: pill.color,
                            }}
                        >
                            <div style={{ color: textColor, opacity: 0.6 }}>{pill.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 20, fontWeight: 700, color: textColor }}>
                                    {pill.value}
                                </div>
                                <div style={{ fontSize: 11, color: mutedColor }}>{pill.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ========== 4. TODAY'S TASKS STRIP ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ marginBottom: 20 }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: textColor }}>
                            Today's tasks
                        </h3>
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: primaryColor }}
                        >
                            <span style={{ fontSize: 13, fontWeight: 500 }}>View all</span>
                            <ChevronRightIcon />
                        </motion.div>
                    </div>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                        {["Review Class 10A homework (14)", "Create test for JEE batch", "Grade Physics papers"].map((task, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    ...cardStyle,
                                    padding: "8px 12px",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: textColor,
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                }}
                            >
                                {task}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ========== 5. UPCOMING CLASSES ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{ marginBottom: 20 }}
                >
                    <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 600, color: textColor }}>
                        Upcoming classes
                    </h3>
                    {[
                        { time: "2:00 PM", subject: "Grade 11 Mathematics", students: 28, canStart: false },
                        { time: "4:00 PM", subject: "Grade 12 Calculus", students: 15, canStart: false },
                    ].map((cls, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                            style={{ ...cardStyle, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: textColor }}>{cls.subject}</div>
                                <div style={{ fontSize: 12, color: mutedColor, marginTop: 4 }}>
                                    {cls.time} · {cls.students} students
                                </div>
                            </div>
                            {cls.canStart && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: primaryColor,
                                        color: "#FFF",
                                        border: "none",
                                        borderRadius: 8,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                    }}
                                >
                                    Start
                                </motion.button>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* ========== 6. PENDING REVIEWS ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ marginBottom: 20 }}
                >
                    <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 600, color: textColor }}>
                        Pending review
                    </h3>
                    {[
                        { type: "Homework", title: "Class 10A Physics", count: 14 },
                        { type: "Test", title: "Grade 11 Math Test", count: 8 },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                            style={{ ...cardStyle, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}
                        >
                            <div
                                style={{
                                    padding: "4px 10px",
                                    backgroundColor: `${primaryColor}20`,
                                    color: primaryColor,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    borderRadius: 6,
                                }}
                            >
                                {item.type}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 500, color: textColor }}>{item.title}</div>
                                <div style={{ fontSize: 12, color: mutedColor, marginTop: 2 }}>
                                    {item.count} submissions
                                </div>
                            </div>
                            <ChevronRightIcon />
                        </motion.div>
                    ))}
                </motion.div>

                {/* ========== 7. COMMUNICATION ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{ marginBottom: 80 }}
                >
                    <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 600, color: textColor }}>
                        Communication
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        {[
                            { icon: <MegaphoneIcon />, label: "Announcements", color: "#3B82F6" },
                            { icon: <UsersIcon />, label: "Class chat", color: "#22C55E" },
                            { icon: <HelpCircleIcon />, label: "Doubts", color: "#EC4899" },
                        ].map((tile, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    ...cardStyle,
                                    padding: 16,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        backgroundColor: `${tile.color}20`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: tile.color,
                                    }}
                                >
                                    {tile.icon}
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 500, color: textColor, textAlign: "center" }}>
                                    {tile.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ========== 8. FAB (+) ========== */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    position: "absolute",
                    bottom: 80,
                    right: 20,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: primaryColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFF",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                }}
            >
                <PlusIcon />
            </motion.div>

            {/* ========== 9. BOTTOM NAV ========== */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: "8px 0",
                    backgroundColor: cardBackground,
                    borderTop: `1px solid ${backgroundColor}`,
                }}
            >
                {[
                    { label: "Home", active: true },
                    { label: "Classes", active: false },
                    { label: "Teach", active: false },
                    { label: "Assess", active: false },
                    { label: "More", active: false },
                ].map((tab, i) => (
                    <motion.div
                        key={i}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                            cursor: "pointer",
                        }}
                    >
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                backgroundColor: tab.active ? primaryColor : mutedColor,
                            }}
                        />
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 500,
                                color: tab.active ? primaryColor : mutedColor,
                            }}
                        >
                            {tab.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

addPropertyControls(TeacherDashboard, {
    teacherName: {
        type: ControlType.String,
        title: "Teacher Name",
        defaultValue: "Sarah",
    },
    taskCount: {
        type: ControlType.Number,
        title: "Task Count",
        defaultValue: 5,
        min: 0,
    },
    upcomingClasses: {
        type: ControlType.Number,
        title: "Upcoming Classes",
        defaultValue: 3,
        min: 0,
    },
    toReview: {
        type: ControlType.Number,
        title: "To Review",
        defaultValue: 12,
        min: 0,
    },
    liveTests: {
        type: ControlType.Number,
        title: "Live Tests",
        defaultValue: 2,
        min: 0,
    },
    unreadChats: {
        type: ControlType.Number,
        title: "Unread Chats",
        defaultValue: 5,
        min: 0,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#F7F7F7",
    },
    cardBackground: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#FFFFFF",
    },
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#8B5CF6",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#1A1A1A",
    },
    mutedColor: {
        type: ControlType.Color,
        title: "Muted Text",
        defaultValue: "#6B7280",
    },
})
