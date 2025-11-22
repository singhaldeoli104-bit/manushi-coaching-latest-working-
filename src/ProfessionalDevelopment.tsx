import React, { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * Screen 45: Professional Development
 *
 * Training courses and skill development for teachers
 *
 * Features:
 * - Tab navigation (Recommended, All Courses, My Courses, Certifications)
 * - Course cards with thumbnails, ratings, duration, difficulty
 * - Filter section (Category, Duration, Difficulty, Price)
 * - Search bar for courses
 * - My Learning section with progress tracking
 * - Certifications section with earned certificates
 * - Learning goals tracker
 *
 * @framerIntrinsicWidth 390
 * @framerIntrinsicHeight 844
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

type TabType = "recommended" | "all" | "my" | "certifications"
type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced"

interface ProfessionalDevelopmentProps {
    width?: number
    height?: number
}

export default function ProfessionalDevelopment(props: ProfessionalDevelopmentProps) {
    const { width = 390, height = 844 } = props
    const [activeTab, setActiveTab] = useState<TabType>("recommended")
    const [searchQuery, setSearchQuery] = useState("")

    const courses = [
        {
            id: 1,
            title: "Modern Teaching Techniques",
            provider: "EdTech Academy",
            duration: "8 hours",
            difficulty: "Intermediate" as DifficultyLevel,
            rating: 4.8,
            enrollments: 1240,
            status: "New",
            progress: 0,
            thumbnail: "🎓",
            category: "Pedagogy",
        },
        {
            id: 2,
            title: "Digital Classroom Management",
            provider: "Tech Teachers",
            duration: "12 hours",
            difficulty: "Beginner" as DifficultyLevel,
            rating: 4.6,
            enrollments: 890,
            status: "Trending",
            progress: 45,
            thumbnail: "💻",
            category: "Technology",
        },
        {
            id: 3,
            title: "Advanced Mathematics Pedagogy",
            provider: "Math Masters",
            duration: "15 hours",
            difficulty: "Advanced" as DifficultyLevel,
            rating: 4.9,
            enrollments: 567,
            status: "Popular",
            progress: 0,
            thumbnail: "📐",
            category: "Subject-specific",
        },
    ]

    const myLearning = {
        coursesInProgress: 2,
        completedCourses: 8,
        certificatesEarned: 5,
        totalHours: 124,
    }

    const certifications = [
        {
            id: 1,
            name: "Certified Digital Educator",
            issuer: "EdTech Board",
            issueDate: "Jan 2025",
            status: "earned",
        },
        {
            id: 2,
            name: "Advanced Pedagogy Specialist",
            issuer: "Teaching Academy",
            issueDate: "Dec 2024",
            status: "earned",
        },
        {
            id: 3,
            name: "Educational Leadership",
            issuer: "Leadership Institute",
            issueDate: "",
            status: "available",
        },
    ]

    const tabs = [
        { id: "recommended" as TabType, label: "Recommended" },
        { id: "all" as TabType, label: "All Courses" },
        { id: "my" as TabType, label: "My Courses" },
        { id: "certifications" as TabType, label: "Certificates" },
    ]

    const getDifficultyColor = (difficulty: DifficultyLevel) => {
        switch (difficulty) {
            case "Beginner":
                return "#10B981"
            case "Intermediate":
                return "#F59E0B"
            case "Advanced":
                return "#EF4444"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "New":
                return "#5B47FB"
            case "Trending":
                return "#EF4444"
            case "Popular":
                return "#10B981"
            default:
                return "#6B7280"
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
                        Professional Development
                    </h1>
                </div>

                {/* Search Bar */}
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Search courses, topics, providers..."
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
                        aria-label="Search courses"
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

            {/* Tab Navigation */}
            <div
                style={{
                    display: "flex",
                    backgroundColor: "white",
                    borderBottom: "1px solid #E5E7EB",
                    overflowX: "auto",
                    flexShrink: 0,
                }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: "16px",
                            border: "none",
                            background: "none",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: activeTab === tab.id ? "#5B47FB" : "#6B7280",
                            cursor: "pointer",
                            borderBottom: activeTab === tab.id ? "2px solid #5B47FB" : "none",
                            whiteSpace: "nowrap",
                            minHeight: "44px",
                        }}
                        aria-label={tab.label}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                {/* My Learning Stats */}
                {activeTab === "my" && (
                    <div style={{ marginBottom: "24px" }}>
                        <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
                            My Learning Progress
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <StatsCard
                                icon="📚"
                                value={myLearning.coursesInProgress}
                                label="In Progress"
                            />
                            <StatsCard
                                icon="✅"
                                value={myLearning.completedCourses}
                                label="Completed"
                            />
                            <StatsCard
                                icon="🏆"
                                value={myLearning.certificatesEarned}
                                label="Certificates"
                            />
                            <StatsCard
                                icon="⏱️"
                                value={myLearning.totalHours}
                                label="Total Hours"
                            />
                        </div>
                    </div>
                )}

                {/* Certifications View */}
                {activeTab === "certifications" && (
                    <div>
                        <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
                            Your Certifications
                        </h2>
                        {certifications.map((cert) => (
                            <CertificationCard key={cert.id} certification={cert} />
                        ))}
                    </div>
                )}

                {/* Course List */}
                {(activeTab === "recommended" || activeTab === "all" || activeTab === "my") && (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>
                                {activeTab === "recommended"
                                    ? "AI-Recommended for You"
                                    : activeTab === "my"
                                      ? "My Enrolled Courses"
                                      : "All Courses"}
                            </h2>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                    background: "white",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    minHeight: "44px",
                                }}
                                aria-label="Filter courses"
                            >
                                🔽 Filter
                            </button>
                        </div>

                        {courses
                            .filter((course) => {
                                if (activeTab === "my") return course.progress > 0
                                return true
                            })
                            .map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    getDifficultyColor={getDifficultyColor}
                                    getStatusColor={getStatusColor}
                                />
                            ))}
                    </div>
                )}

                {/* Learning Goals */}
                {activeTab === "my" && (
                    <div style={{ marginTop: "24px" }}>
                        <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
                            Monthly Learning Goals
                        </h2>
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "12px",
                                padding: "16px",
                            }}
                        >
                            <div style={{ marginBottom: "16px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                                        Learning Hours Goal
                                    </span>
                                    <span style={{ fontSize: "14px", color: "#5B47FB", fontWeight: 700 }}>
                                        12 / 20 hours
                                    </span>
                                </div>
                                <div
                                    style={{
                                        height: "8px",
                                        backgroundColor: "#F3F4F6",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "60%",
                                            height: "100%",
                                            backgroundColor: "#5B47FB",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                                        Courses Completion Goal
                                    </span>
                                    <span style={{ fontSize: "14px", color: "#10B981", fontWeight: 700 }}>
                                        2 / 3 courses
                                    </span>
                                </div>
                                <div
                                    style={{
                                        height: "8px",
                                        backgroundColor: "#F3F4F6",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "66%",
                                            height: "100%",
                                            backgroundColor: "#10B981",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Helper Components
function StatsCard({ icon, value, label }: any) {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
            }}
        >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
            <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>{value}</div>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>{label}</div>
        </div>
    )
}

function CourseCard({ course, getDifficultyColor, getStatusColor }: any) {
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            <div style={{ display: "flex", gap: "12px" }}>
                {/* Thumbnail */}
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#F3F4F6",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        flexShrink: 0,
                    }}
                >
                    {course.thumbnail}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "white",
                                backgroundColor: getStatusColor(course.status),
                                padding: "2px 8px",
                                borderRadius: "4px",
                            }}
                        >
                            {course.status}
                        </span>
                        <span style={{ fontSize: "14px" }}>⭐ {course.rating}</span>
                    </div>
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "4px",
                            margin: "4px 0",
                        }}
                    >
                        {course.title}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0" }}>
                        {course.provider}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            fontSize: "12px",
                            color: "#6B7280",
                            marginTop: "8px",
                        }}
                    >
                        <span>⏱️ {course.duration}</span>
                        <span
                            style={{
                                color: getDifficultyColor(course.difficulty),
                                fontWeight: 600,
                            }}
                        >
                            {course.difficulty}
                        </span>
                        <span>👥 {course.enrollments}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar (if enrolled) */}
            {course.progress > 0 && (
                <div style={{ marginTop: "12px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "4px",
                        }}
                    >
                        <span style={{ fontSize: "12px", color: "#6B7280" }}>Progress</span>
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>
                            {course.progress}%
                        </span>
                    </div>
                    <div
                        style={{
                            height: "6px",
                            backgroundColor: "#F3F4F6",
                            borderRadius: "3px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${course.progress}%`,
                                height: "100%",
                                backgroundColor: "#5B47FB",
                                borderRadius: "3px",
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Action Button */}
            <button
                style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "10px",
                    backgroundColor: course.progress > 0 ? "#5B47FB" : "white",
                    color: course.progress > 0 ? "white" : "#5B47FB",
                    border: course.progress > 0 ? "none" : "1px solid #5B47FB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    minHeight: "44px",
                }}
                aria-label={course.progress > 0 ? "Continue course" : "Enroll in course"}
            >
                {course.progress > 0 ? "Continue" : "Enroll Now"}
            </button>
        </div>
    )
}

function CertificationCard({ certification }: any) {
    const isEarned = certification.status === "earned"
    return (
        <div
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                borderLeft: `4px solid ${isEarned ? "#10B981" : "#E5E7EB"}`,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px", margin: "0 0 4px 0" }}>
                        {isEarned ? "🏆" : "📜"} {certification.name}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0" }}>
                        {certification.issuer}
                    </p>
                    {isEarned && (
                        <p style={{ fontSize: "12px", color: "#10B981", fontWeight: 600, margin: "4px 0" }}>
                            Issued: {certification.issueDate}
                        </p>
                    )}
                </div>
                {isEarned && (
                    <button
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            background: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            minHeight: "44px",
                            minWidth: "44px",
                        }}
                        aria-label="Download certificate"
                    >
                        📥 Download
                    </button>
                )}
            </div>
            {!isEarned && (
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
                    aria-label="Start certification program"
                >
                    Start Certification
                </button>
            )}
        </div>
    )
}

addPropertyControls(ProfessionalDevelopment, {
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
