import React, { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * Screen 46: Help & Support Center
 *
 * Comprehensive help and support system for teachers
 *
 * Features:
 * - Search bar for help articles
 * - Quick actions cards (Contact Support, Report Bug, Request Feature, FAQs, Tutorials, System Status)
 * - Categories section (expandable help topics)
 * - Popular help articles with view counts
 * - Contact support form with issue type and priority
 * - My support tickets with status tracking
 * - Tutorial videos section
 * - System status indicator
 * - App version and build info
 *
 * @framerIntrinsicWidth 390
 * @framerIntrinsicHeight 844
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

type IssueType = "technical" | "account" | "feature" | "other"
type Priority = "low" | "medium" | "high" | "urgent"
type TicketStatus = "open" | "in_progress" | "resolved" | "closed"

interface HelpSupportCenterProps {
    width?: number
    height?: number
}

export default function HelpSupportCenter(props: HelpSupportCenterProps) {
    const { width = 390, height = 844 } = props
    const [searchQuery, setSearchQuery] = useState("")
    const [showContactForm, setShowContactForm] = useState(false)
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

    const quickActions = [
        { id: 1, icon: "💬", label: "Contact Support", color: "#5B47FB" },
        { id: 2, icon: "🐛", label: "Report a Bug", color: "#EF4444" },
        { id: 3, icon: "✨", label: "Request Feature", color: "#10B981" },
        { id: 4, icon: "❓", label: "View FAQs", color: "#F59E0B" },
        { id: 5, icon: "📺", label: "Watch Tutorials", color: "#8B5CF6" },
        { id: 6, icon: "🟢", label: "System Status", color: "#10B981" },
    ]

    const categories = [
        {
            id: 1,
            name: "Getting Started",
            icon: "🚀",
            articles: ["First time setup", "Basic navigation", "Account setup"],
        },
        {
            id: 2,
            name: "Class Management",
            icon: "📚",
            articles: ["Creating classes", "Managing students", "Attendance tracking"],
        },
        {
            id: 3,
            name: "Assignments & Tests",
            icon: "📝",
            articles: ["Creating assignments", "Grading", "Test creation"],
        },
        {
            id: 4,
            name: "Communication",
            icon: "💬",
            articles: ["Messaging parents", "Announcements", "Chat features"],
        },
        {
            id: 5,
            name: "Technical Issues",
            icon: "⚙️",
            articles: ["Login problems", "App crashes", "Performance issues"],
        },
    ]

    const popularArticles = [
        {
            id: 1,
            title: "How to create your first class",
            views: 2450,
            helpful: 156,
            lastUpdated: "2 days ago",
            readTime: "3 min",
        },
        {
            id: 2,
            title: "Managing student attendance effectively",
            views: 1890,
            helpful: 142,
            lastUpdated: "1 week ago",
            readTime: "5 min",
        },
        {
            id: 3,
            title: "Setting up parent communication",
            views: 1567,
            helpful: 98,
            lastUpdated: "3 days ago",
            readTime: "4 min",
        },
    ]

    const myTickets = [
        {
            id: "TKT-1234",
            subject: "Unable to upload attendance",
            status: "in_progress" as TicketStatus,
            created: "2 days ago",
            lastUpdated: "1 day ago",
            responses: 3,
        },
        {
            id: "TKT-1189",
            subject: "Feature request: Bulk grading",
            status: "open" as TicketStatus,
            created: "1 week ago",
            lastUpdated: "5 days ago",
            responses: 1,
        },
    ]

    const tutorials = [
        {
            id: 1,
            title: "Getting Started with Teacher Dashboard",
            thumbnail: "🎥",
            duration: "8:45",
            views: 5600,
        },
        {
            id: 2,
            title: "Creating and Managing Assignments",
            thumbnail: "📹",
            duration: "12:30",
            views: 4200,
        },
        {
            id: 3,
            title: "Using Live Class Features",
            thumbnail: "🎬",
            duration: "15:20",
            views: 3800,
        },
    ]

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case "open":
                return "#F59E0B"
            case "in_progress":
                return "#5B47FB"
            case "resolved":
                return "#10B981"
            case "closed":
                return "#6B7280"
        }
    }

    const getStatusLabel = (status: TicketStatus) => {
        switch (status) {
            case "open":
                return "Open"
            case "in_progress":
                return "In Progress"
            case "resolved":
                return "Resolved"
            case "closed":
                return "Closed"
        }
    }

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
            {/* Header */}
            <div
                style={{
                    backgroundColor: "#5B47FB",
                    padding: "16px",
                    color: "white",
                    flexShrink: 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
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
                        Help & Support
                    </h1>
                </div>

                {/* Search Bar */}
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Search help articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 40px 12px 16px",
                            borderRadius: "12px",
                            border: "none",
                            fontSize: "14px",
                            outline: "none",
                        }}
                        aria-label="Search help articles"
                    />
                    <span
                        style={{
                            position: "absolute",
                            right: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "18px",
                        }}
                    >
                        🔍
                    </span>
                </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                {/* Quick Actions */}
                <Section title="Quick Actions">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        {quickActions.map((action) => (
                            <QuickActionCard
                                key={action.id}
                                action={action}
                                onClick={() => {
                                    if (action.label === "Contact Support") {
                                        setShowContactForm(true)
                                    }
                                }}
                            />
                        ))}
                    </div>
                </Section>

                {/* System Status */}
                <div
                    style={{
                        backgroundColor: "#ECFDF5",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <div style={{ fontSize: "24px" }}>🟢</div>
                    <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#047857" }}>
                            All Systems Operational
                        </div>
                        <div style={{ fontSize: "12px", color: "#065F46" }}>
                            No issues reported
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <Section title="Help Categories">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            isExpanded={expandedCategory === category.name}
                            onToggle={() =>
                                setExpandedCategory(
                                    expandedCategory === category.name ? null : category.name
                                )
                            }
                        />
                    ))}
                </Section>

                {/* Popular Articles */}
                <Section title="Popular Help Articles">
                    {popularArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </Section>

                {/* My Support Tickets */}
                <Section title="My Support Tickets">
                    {myTickets.length === 0 ? (
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "12px",
                                padding: "24px",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                            <div style={{ fontSize: "14px", color: "#6B7280" }}>
                                No support tickets yet
                            </div>
                        </div>
                    ) : (
                        myTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                getStatusColor={getStatusColor}
                                getStatusLabel={getStatusLabel}
                            />
                        ))
                    )}
                </Section>

                {/* Tutorial Videos */}
                <Section title="Tutorial Videos">
                    {tutorials.map((tutorial) => (
                        <TutorialCard key={tutorial.id} tutorial={tutorial} />
                    ))}
                </Section>

                {/* App Info */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "16px",
                        marginTop: "24px",
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>
                        App Version
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
                        v2.5.1 (Build 2501)
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        Last updated: Jan 15, 2025
                    </div>
                </div>
            </div>

            {/* Contact Form Modal */}
            {showContactForm && (
                <ContactFormModal onClose={() => setShowContactForm(false)} />
            )}
        </div>
    )
}

// Helper Components
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

function QuickActionCard({ action, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                minHeight: "44px",
            }}
            aria-label={action.label}
        >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{action.icon}</div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: action.color }}>
                {action.label}
            </div>
        </button>
    )
}

function CategoryCard({ category, isExpanded, onToggle }: any) {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            <button
                onClick={onToggle}
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    minHeight: "44px",
                }}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name}`}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ fontSize: "24px" }}>{category.icon}</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, textAlign: "left" }}>
                        {category.name}
                    </div>
                </div>
                <div style={{ fontSize: "18px", color: "#6B7280" }}>
                    {isExpanded ? "▲" : "▼"}
                </div>
            </button>
            {isExpanded && (
                <div style={{ marginTop: "12px", paddingLeft: "36px" }}>
                    {category.articles.map((article: string, index: number) => (
                        <div
                            key={index}
                            style={{
                                fontSize: "14px",
                                color: "#5B47FB",
                                padding: "8px 0",
                                cursor: "pointer",
                            }}
                        >
                            • {article}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function ArticleCard({ article }: any) {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                cursor: "pointer",
            }}
        >
            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", margin: "0 0 8px 0" }}>
                📄 {article.title}
            </h3>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#6B7280",
                }}
            >
                <div style={{ display: "flex", gap: "16px" }}>
                    <span>👁️ {article.views} views</span>
                    <span>👍 {article.helpful} helpful</span>
                    <span>⏱️ {article.readTime} read</span>
                </div>
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
                Updated {article.lastUpdated}
            </div>
        </div>
    )
}

function TicketCard({ ticket, getStatusColor, getStatusLabel }: any) {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                    <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>
                        {ticket.id}
                    </div>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px 0" }}>
                        {ticket.subject}
                    </h3>
                </div>
                <span
                    style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "white",
                        backgroundColor: getStatusColor(ticket.status),
                        padding: "4px 8px",
                        borderRadius: "4px",
                        height: "fit-content",
                    }}
                >
                    {getStatusLabel(ticket.status)}
                </span>
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>
                Created {ticket.created} • {ticket.responses} responses
            </div>
            <button
                style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "10px",
                    backgroundColor: "white",
                    color: "#5B47FB",
                    border: "1px solid #5B47FB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    minHeight: "44px",
                }}
                aria-label="View ticket details"
            >
                View Details
            </button>
        </div>
    )
}

function TutorialCard({ tutorial }: any) {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                display: "flex",
                gap: "12px",
            }}
        >
            {/* Thumbnail */}
            <div
                style={{
                    width: "100px",
                    height: "70px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    flexShrink: 0,
                    position: "relative",
                }}
            >
                {tutorial.thumbnail}
                <div
                    style={{
                        position: "absolute",
                        bottom: "4px",
                        right: "4px",
                        backgroundColor: "rgba(0,0,0,0.8)",
                        color: "white",
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                    }}
                >
                    {tutorial.duration}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px", margin: "0 0 4px 0" }}>
                    {tutorial.title}
                </h3>
                <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px" }}>
                    👁️ {tutorial.views.toLocaleString()} views
                </div>
                <button
                    style={{
                        padding: "6px 16px",
                        backgroundColor: "#5B47FB",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        minHeight: "44px",
                        minWidth: "44px",
                    }}
                    aria-label="Play tutorial video"
                >
                    ▶️ Play
                </button>
            </div>
        </div>
    )
}

function ContactFormModal({ onClose }: any) {
    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    maxWidth: "400px",
                    width: "100%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                    }}
                >
                    <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
                        Contact Support
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                            padding: 0,
                            width: "44px",
                            height: "44px",
                        }}
                        aria-label="Close form"
                    >
                        ×
                    </button>
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                        Issue Type
                    </label>
                    <select
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "14px",
                        }}
                        aria-label="Select issue type"
                    >
                        <option>Technical Issue</option>
                        <option>Account Problem</option>
                        <option>Feature Request</option>
                        <option>Other</option>
                    </select>
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                        Priority
                    </label>
                    <select
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "14px",
                        }}
                        aria-label="Select priority"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                    </select>
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                        Subject
                    </label>
                    <input
                        type="text"
                        placeholder="Brief description of your issue"
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "14px",
                        }}
                        aria-label="Enter subject"
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                        Description
                    </label>
                    <textarea
                        placeholder="Please describe your issue in detail..."
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "14px",
                            minHeight: "100px",
                            resize: "vertical",
                        }}
                        aria-label="Enter description"
                    />
                </div>

                <button
                    style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        background: "white",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginBottom: "16px",
                        minHeight: "44px",
                    }}
                    aria-label="Attach screenshot"
                >
                    📎 Attach Screenshot
                </button>

                <button
                    onClick={() => {
                        alert("Support ticket submitted!")
                        onClose()
                    }}
                    style={{
                        width: "100%",
                        padding: "14px",
                        backgroundColor: "#5B47FB",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        minHeight: "44px",
                    }}
                    aria-label="Submit ticket"
                >
                    Submit Ticket
                </button>
            </div>
        </div>
    )
}

addPropertyControls(HelpSupportCenter, {
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
