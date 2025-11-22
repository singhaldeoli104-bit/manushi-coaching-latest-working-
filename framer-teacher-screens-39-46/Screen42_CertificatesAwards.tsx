import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * SCREEN 42: Certificates, Achievements & Awards
 *
 * Create and manage certificates and badges:
 * - Two tabs: Certificates | Achievements
 * - Certificate templates grid
 * - Create certificate wizard
 * - Badge/achievement library
 * - Assign achievements modal
 * - Student achievement history
 * - Download and share options
 *
 * Features:
 * - Multiple certificate templates
 * - Custom achievement badges
 * - Auto-generated achievements
 * - Preview and issue
 * - Student selection
 */

interface CertificateTemplate {
    id: string
    name: string
    category: string
    icon: string
    color: string
}

interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    color: string
    criteria: string
}

interface StudentAchievement {
    id: string
    studentName: string
    avatar: string
    achievementType: string
    date: string
}

interface CertificatesAwardsProps {
    className?: string
    onIssueCertificate?: (template: string, studentIds: string[]) => void
    onAssignAchievement?: (achievementId: string, studentId: string) => void
    style?: React.CSSProperties
}

export default function CertificatesAwards({
    className = "Class 10-A",
    onIssueCertificate = () => console.log("Issue certificate"),
    onAssignAchievement = () => console.log("Assign achievement"),
    style
}: CertificatesAwardsProps) {
    const [activeTab, setActiveTab] = useState<"certificates" | "achievements">("certificates")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

    const certificateTemplates: CertificateTemplate[] = [
        {
            id: "graduation",
            name: "Graduation Certificate",
            category: "Academic",
            icon: "🎓",
            color: "#5B47FB"
        },
        {
            id: "completion",
            name: "Course Completion",
            category: "Academic",
            icon: "📜",
            color: "#10B981"
        },
        {
            id: "excellence",
            name: "Academic Excellence",
            category: "Performance",
            icon: "⭐",
            color: "#F59E0B"
        },
        {
            id: "attendance",
            name: "Perfect Attendance",
            category: "Behavior",
            icon: "📅",
            color: "#3B82F6"
        },
        {
            id: "improvement",
            name: "Most Improved",
            category: "Progress",
            icon: "📈",
            color: "#8B5CF6"
        },
        {
            id: "participation",
            name: "Active Participation",
            category: "Engagement",
            icon: "🙋",
            color: "#EC4899"
        }
    ]

    const achievements: Achievement[] = [
        {
            id: "streak_7",
            name: "7-Day Streak",
            description: "Attended 7 classes in a row",
            icon: "🔥",
            color: "#EF4444",
            criteria: "7 consecutive days"
        },
        {
            id: "homework_perfect",
            name: "Perfect Homework",
            description: "100% homework completion rate",
            icon: "✅",
            color: "#10B981",
            criteria: "All homework submitted"
        },
        {
            id: "top_scorer",
            name: "Top Scorer",
            description: "Scored highest in class test",
            icon: "🏆",
            color: "#F59E0B",
            criteria: "Rank #1 in test"
        },
        {
            id: "helpful",
            name: "Helpful Peer",
            description: "Helped 5+ classmates",
            icon: "🤝",
            color: "#3B82F6",
            criteria: "5+ peer interactions"
        },
        {
            id: "curious",
            name: "Curious Mind",
            description: "Asked 10+ questions",
            icon: "💡",
            color: "#8B5CF6",
            criteria: "10+ questions asked"
        },
        {
            id: "punctual",
            name: "Always On Time",
            description: "Never late to class",
            icon: "⏰",
            color: "#06B6D4",
            criteria: "0 late arrivals"
        }
    ]

    const studentAchievements: StudentAchievement[] = [
        {
            id: "1",
            studentName: "Emma Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
            achievementType: "7-Day Streak",
            date: "2025-01-15"
        },
        {
            id: "2",
            studentName: "Liam Chen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
            achievementType: "Top Scorer",
            date: "2025-01-14"
        },
        {
            id: "3",
            studentName: "Olivia Davis",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
            achievementType: "Perfect Homework",
            date: "2025-01-13"
        }
    ]

    const students = [
        { id: "1", name: "Emma Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
        { id: "2", name: "Liam Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam" },
        { id: "3", name: "Olivia Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia" },
        { id: "4", name: "Noah Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah" }
    ]

    const handleCreateCertificate = () => {
        if (selectedTemplate && selectedStudents.size > 0) {
            onIssueCertificate(selectedTemplate, Array.from(selectedStudents))
            setShowCreateModal(false)
            setSelectedTemplate(null)
            setSelectedStudents(new Set())
        }
    }

    const toggleStudent = (studentId: string) => {
        const newSelected = new Set(selectedStudents)
        if (newSelected.has(studentId)) {
            newSelected.delete(studentId)
        } else {
            newSelected.add(studentId)
        }
        setSelectedStudents(newSelected)
    }

    return (
        <div style={{
            width: "390px",
            minHeight: "844px",
            backgroundColor: "#F9FAFB",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            overflow: "auto",
            position: "relative",
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
                    marginBottom: "16px"
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
                            Certificates & Awards
                        </h1>
                        <p style={{
                            margin: "2px 0 0",
                            fontSize: "13px",
                            color: "#6B7280"
                        }}>
                            {className}
                        </p>
                    </div>
                </div>

                {/* Tab Selector */}
                <div style={{
                    display: "flex",
                    gap: "8px",
                    padding: "4px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px"
                }}>
                    <button
                        onClick={() => setActiveTab("certificates")}
                        style={{
                            flex: 1,
                            minHeight: "36px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: activeTab === "certificates" ? "#FFFFFF" : "transparent",
                            color: activeTab === "certificates" ? "#111827" : "#6B7280",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: activeTab === "certificates" ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
                        }}
                        aria-label="Certificates tab"
                    >
                        Certificates
                    </button>
                    <button
                        onClick={() => setActiveTab("achievements")}
                        style={{
                            flex: 1,
                            minHeight: "36px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: activeTab === "achievements" ? "#FFFFFF" : "transparent",
                            color: activeTab === "achievements" ? "#111827" : "#6B7280",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: activeTab === "achievements" ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
                        }}
                        aria-label="Achievements tab"
                    >
                        Achievements
                    </button>
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                {activeTab === "certificates" ? (
                    <>
                        {/* Create Button */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            style={{
                                width: "100%",
                                minHeight: "48px",
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "12px",
                                border: "none",
                                backgroundColor: "#5B47FB",
                                color: "#FFFFFF",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px"
                            }}
                            aria-label="Create certificate"
                        >
                            <span style={{ fontSize: "18px" }}>+</span>
                            Create Certificate
                        </button>

                        {/* Certificate Templates Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "12px"
                        }}>
                            {certificateTemplates.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => {
                                        setSelectedTemplate(template.id)
                                        setShowCreateModal(true)
                                    }}
                                    style={{
                                        padding: "20px 16px",
                                        borderRadius: "12px",
                                        border: "1px solid #E5E7EB",
                                        backgroundColor: "#FFFFFF",
                                        cursor: "pointer",
                                        textAlign: "center"
                                    }}
                                    aria-label={`Create ${template.name}`}
                                >
                                    <div style={{
                                        width: "48px",
                                        height: "48px",
                                        margin: "0 auto 12px",
                                        borderRadius: "12px",
                                        backgroundColor: template.color + "20",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "24px"
                                    }}>
                                        {template.icon}
                                    </div>
                                    <div style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#111827",
                                        marginBottom: "4px"
                                    }}>
                                        {template.name}
                                    </div>
                                    <div style={{
                                        fontSize: "11px",
                                        color: "#6B7280"
                                    }}>
                                        {template.category}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Achievements Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "12px",
                            marginBottom: "24px"
                        }}>
                            {achievements.map(achievement => (
                                <button
                                    key={achievement.id}
                                    onClick={() => console.log("Assign", achievement.id)}
                                    style={{
                                        padding: "16px",
                                        borderRadius: "12px",
                                        border: "1px solid #E5E7EB",
                                        backgroundColor: "#FFFFFF",
                                        cursor: "pointer",
                                        textAlign: "left"
                                    }}
                                    aria-label={`Assign ${achievement.name}`}
                                >
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        marginBottom: "8px",
                                        borderRadius: "10px",
                                        backgroundColor: achievement.color + "20",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px"
                                    }}>
                                        {achievement.icon}
                                    </div>
                                    <div style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: "#111827",
                                        marginBottom: "4px"
                                    }}>
                                        {achievement.name}
                                    </div>
                                    <div style={{
                                        fontSize: "11px",
                                        color: "#6B7280",
                                        lineHeight: "1.4"
                                    }}>
                                        {achievement.description}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Recent Achievements */}
                        <div style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#111827",
                            marginBottom: "12px"
                        }}>
                            Recent Achievements
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            {studentAchievements.map(item => (
                                <div
                                    key={item.id}
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
                                        src={item.avatar}
                                        alt={item.studentName}
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
                                            color: "#111827",
                                            marginBottom: "4px"
                                        }}>
                                            {item.studentName}
                                        </div>
                                        <div style={{
                                            fontSize: "12px",
                                            color: "#6B7280"
                                        }}>
                                            {item.achievementType} • {item.date}
                                        </div>
                                    </div>
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "8px",
                                        backgroundColor: "#F59E0B20",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "18px"
                                    }}>
                                        🏆
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Create Certificate Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "flex-end",
                            zIndex: 100
                        }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            style={{
                                width: "100%",
                                maxHeight: "80vh",
                                backgroundColor: "#FFFFFF",
                                borderRadius: "24px 24px 0 0",
                                padding: "24px 20px",
                                overflow: "auto"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{
                                width: "40px",
                                height: "4px",
                                backgroundColor: "#E5E7EB",
                                borderRadius: "2px",
                                margin: "0 auto 20px"
                            }} />

                            <h2 style={{
                                margin: "0 0 8px",
                                fontSize: "20px",
                                fontWeight: 700,
                                color: "#111827"
                            }}>
                                Create Certificate
                            </h2>
                            <p style={{
                                margin: "0 0 20px",
                                fontSize: "13px",
                                color: "#6B7280"
                            }}>
                                Select template and students
                            </p>

                            {/* Template Selection */}
                            <div style={{ marginBottom: "20px" }}>
                                <div style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#111827",
                                    marginBottom: "12px"
                                }}>
                                    Template
                                </div>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: "12px"
                                }}>
                                    {certificateTemplates.slice(0, 4).map(template => (
                                        <button
                                            key={template.id}
                                            onClick={() => setSelectedTemplate(template.id)}
                                            style={{
                                                padding: "16px 12px",
                                                borderRadius: "12px",
                                                border: selectedTemplate === template.id ? "2px solid #5B47FB" : "1px solid #E5E7EB",
                                                backgroundColor: selectedTemplate === template.id ? "#F5F3FF" : "#FFFFFF",
                                                cursor: "pointer",
                                                textAlign: "center"
                                            }}
                                            aria-label={`Select ${template.name}`}
                                        >
                                            <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                                                {template.icon}
                                            </div>
                                            <div style={{
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                color: "#111827"
                                            }}>
                                                {template.name}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Student Selection */}
                            <div style={{ marginBottom: "20px" }}>
                                <div style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#111827",
                                    marginBottom: "12px"
                                }}>
                                    Select Students ({selectedStudents.size})
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px"
                                }}>
                                    {students.map(student => (
                                        <button
                                            key={student.id}
                                            onClick={() => toggleStudent(student.id)}
                                            style={{
                                                padding: "12px",
                                                borderRadius: "10px",
                                                border: selectedStudents.has(student.id) ? "2px solid #5B47FB" : "1px solid #E5E7EB",
                                                backgroundColor: selectedStudents.has(student.id) ? "#F5F3FF" : "#FFFFFF",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px"
                                            }}
                                            aria-label={`Select ${student.name}`}
                                        >
                                            <div style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "6px",
                                                border: `2px solid ${selectedStudents.has(student.id) ? "#5B47FB" : "#E5E7EB"}`,
                                                backgroundColor: selectedStudents.has(student.id) ? "#5B47FB" : "#FFFFFF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#FFFFFF",
                                                fontSize: "12px"
                                            }}>
                                                {selectedStudents.has(student.id) && "✓"}
                                            </div>
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                style={{
                                                    width: "36px",
                                                    height: "36px",
                                                    borderRadius: "50%"
                                                }}
                                            />
                                            <span style={{
                                                fontSize: "14px",
                                                fontWeight: 500,
                                                color: "#111827"
                                            }}>
                                                {student.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Create Button */}
                            <button
                                onClick={handleCreateCertificate}
                                disabled={!selectedTemplate || selectedStudents.size === 0}
                                style={{
                                    width: "100%",
                                    minHeight: "48px",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "none",
                                    backgroundColor: selectedTemplate && selectedStudents.size > 0 ? "#5B47FB" : "#E5E7EB",
                                    color: selectedTemplate && selectedStudents.size > 0 ? "#FFFFFF" : "#9CA3AF",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    cursor: selectedTemplate && selectedStudents.size > 0 ? "pointer" : "not-allowed"
                                }}
                                aria-label="Create and issue certificate"
                            >
                                Create & Issue Certificate
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

addPropertyControls(CertificatesAwards, {
    className: {
        type: ControlType.String,
        title: "Class Name",
        defaultValue: "Class 10-A"
    }
})
