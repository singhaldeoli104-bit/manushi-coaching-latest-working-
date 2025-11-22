/**
 * SCREEN 34: Class Announcements (Teacher View)
 *
 * Manage and create announcements for classes.
 * Teachers can create, schedule, edit, and track announcement reach.
 *
 * Features:
 * - List of announcements with status badges
 * - Create announcement FAB
 * - Filters: All classes, specific class, status (sent/scheduled/draft)
 * - Announcement cards: title, preview, date, class, read count
 * - Actions: edit, delete, duplicate, view analytics
 * - Draft support
 * - Schedule for later
 *
 * Design System:
 * - Primary: #5B47FB
 * - Sent: #10B981
 * - Scheduled: #F59E0B
 * - Draft: #9CA3AF
 * - Mobile: 390×844px
 * - Accessibility: WCAG AA
 */

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Announcement {
    id: string
    title: string
    preview: string
    status: "sent" | "scheduled" | "draft"
    class: string
    date: string
    readCount?: number
    totalStudents?: number
}

interface AnnouncementsProps {
    primaryColor?: string
    onCreateAnnouncement?: () => void
}

export default function Announcements({
    primaryColor = "#5B47FB",
    onCreateAnnouncement,
}: AnnouncementsProps) {
    const [filter, setFilter] = useState<"all" | "sent" | "scheduled" | "draft">("all")
    const [selectedClass, setSelectedClass] = useState<string>("all")

    const announcements: Announcement[] = [
        {
            id: "1",
            title: "Test Postponed to Next Week",
            preview: "Due to unforeseen circumstances, the Chapter 5 test has been rescheduled...",
            status: "sent",
            class: "Class 10-A",
            date: "2 hours ago",
            readCount: 32,
            totalStudents: 38,
        },
        {
            id: "2",
            title: "Reminder: Submit Homework by Friday",
            preview: "Please ensure all pending homework is submitted by end of day Friday...",
            status: "sent",
            class: "All Classes",
            date: "1 day ago",
            readCount: 145,
            totalStudents: 150,
        },
        {
            id: "3",
            title: "Parent-Teacher Meeting Next Month",
            preview: "We will be conducting PTM on 25th February. Please mark your calendars...",
            status: "scheduled",
            class: "Class 10-A, 10-B",
            date: "Scheduled for Feb 15",
        },
        {
            id: "4",
            title: "New Study Material Available",
            preview: "I've uploaded new practice sets and reference materials in the Resources section...",
            status: "draft",
            class: "Class 10-A",
            date: "Saved 3 days ago",
        },
    ]

    const filteredAnnouncements = announcements.filter(a => {
        if (filter !== "all" && a.status !== filter) return false
        if (selectedClass !== "all" && !a.class.includes(selectedClass)) return false
        return true
    })

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "sent":
                return { color: "#10B981", bg: "#D1FAE5", label: "Sent" }
            case "scheduled":
                return { color: "#F59E0B", bg: "#FEF3C7", label: "Scheduled" }
            case "draft":
                return { color: "#9CA3AF", bg: "#F3F4F6", label: "Draft" }
            default:
                return { color: "#6B7280", bg: "#F9FAFB", label: "Unknown" }
        }
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#F9FAFB",
            overflow: "auto",
            fontFamily: "Inter, -apple-system, sans-serif",
            position: "relative",
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
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
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
                        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827" }}>
                            Announcements
                        </h1>
                        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6B7280" }}>
                            Communicate with your students
                        </p>
                    </div>
                </div>

                {/* Class Filter */}
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF",
                        marginBottom: "12px",
                        boxSizing: "border-box",
                    }}
                    aria-label="Filter by class"
                >
                    <option value="all">All Classes</option>
                    <option value="10-A">Class 10-A</option>
                    <option value="10-B">Class 10-B</option>
                    <option value="11-A">Class 11-A</option>
                </select>

                {/* Status Filter Chips */}
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {[
                        { value: "all", label: "All" },
                        { value: "sent", label: "Sent" },
                        { value: "scheduled", label: "Scheduled" },
                        { value: "draft", label: "Drafts" },
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
                            aria-label={`Filter ${chip.label}`}
                        >
                            {chip.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Announcements List */}
            <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "16px", fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                    {filteredAnnouncements.length} {filteredAnnouncements.length === 1 ? "Announcement" : "Announcements"}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <AnimatePresence>
                        {filteredAnnouncements.map((announcement) => {
                            const statusInfo = getStatusInfo(announcement.status)
                            return (
                                <motion.div
                                    key={announcement.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        padding: "16px",
                                        backgroundColor: "#FFFFFF",
                                        borderRadius: "12px",
                                        border: "1px solid #E5E7EB",
                                        cursor: "pointer",
                                    }}
                                >
                                    {/* Header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                margin: "0 0 4px 0",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                color: "#111827",
                                            }}>
                                                {announcement.title}
                                            </h3>
                                            <p style={{
                                                margin: 0,
                                                fontSize: "13px",
                                                color: "#6B7280",
                                                lineHeight: "1.5",
                                            }}>
                                                {announcement.preview}
                                            </p>
                                        </div>
                                        <div style={{
                                            padding: "4px 10px",
                                            borderRadius: "12px",
                                            backgroundColor: statusInfo.bg,
                                            color: statusInfo.color,
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                            marginLeft: "12px",
                                            flexShrink: 0,
                                        }}>
                                            {statusInfo.label}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #F3F4F6" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>
                                                {announcement.class}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                                                {announcement.date}
                                            </span>
                                        </div>

                                        {announcement.status === "sent" && announcement.readCount !== undefined && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <circle cx="12" cy="12" r="3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <span style={{ fontSize: "12px", fontWeight: 600, color: "#10B981" }}>
                                                    {announcement.readCount}/{announcement.totalStudents}
                                                </span>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                }}
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "6px",
                                                    border: "none",
                                                    backgroundColor: "#F3F4F6",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                aria-label="Edit announcement"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                }}
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "6px",
                                                    border: "none",
                                                    backgroundColor: "#FEE2E2",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                aria-label="Delete announcement"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredAnnouncements.length === 0 && (
                    <div style={{
                        padding: "60px 20px",
                        textAlign: "center",
                        color: "#9CA3AF",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📢</div>
                        <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                            No announcements found
                        </div>
                        <div style={{ fontSize: "14px", marginBottom: "20px" }}>
                            Create your first announcement to communicate with students
                        </div>
                        <button
                            onClick={onCreateAnnouncement}
                            style={{
                                padding: "12px 24px",
                                backgroundColor: primaryColor,
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                            aria-label="Create announcement"
                        >
                            Create Announcement
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onCreateAnnouncement}
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
                aria-label="Create new announcement"
            >
                +
            </motion.button>
        </div>
    )
}

addPropertyControls(Announcements, {
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#5B47FB",
    },
})
