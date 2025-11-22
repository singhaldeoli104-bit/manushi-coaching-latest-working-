import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * SCREEN 41: Report Cards & Academic Reports
 *
 * Generate and manage report cards:
 * - Term selector (Q1, Q2, Annual)
 * - Class and student selector
 * - Report template picker
 * - Preview modal
 * - Download/print options
 * - Batch generation
 * - Report history list
 *
 * Features:
 * - Multiple report templates
 * - Individual and bulk generation
 * - PDF export
 * - Progress tracking
 * - Report history
 */

interface ReportTemplate {
    id: string
    name: string
    description: string
    icon: string
}

interface Report {
    id: string
    studentName: string
    avatar: string
    term: string
    status: "draft" | "generated" | "published"
    date: string
    avgScore: number
}

interface ReportCardsProps {
    className?: string
    selectedTerm?: string
    onGenerate?: (template: string) => void
    onPreview?: (reportId: string) => void
    style?: React.CSSProperties
}

export default function ReportCards({
    className = "Class 10-A",
    selectedTerm = "Q2",
    onGenerate = () => console.log("Generate"),
    onPreview = () => console.log("Preview"),
    style
}: ReportCardsProps) {
    const [term, setTerm] = useState(selectedTerm)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [showTemplates, setShowTemplates] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
    const [generating, setGenerating] = useState(false)
    const [progress, setProgress] = useState(0)

    const templates: ReportTemplate[] = [
        {
            id: "standard",
            name: "Standard Report Card",
            description: "Traditional format with subject marks, grades, and remarks",
            icon: "📝"
        },
        {
            id: "detailed",
            name: "Detailed Progress Report",
            description: "Comprehensive analysis with topic-wise breakdown",
            icon: "📊"
        },
        {
            id: "parent",
            name: "Parent-Friendly Report",
            description: "Simplified format with visual progress indicators",
            icon: "👨‍👩‍👧"
        },
        {
            id: "transcript",
            name: "Academic Transcript",
            description: "Official format for records and transfers",
            icon: "🎓"
        }
    ]

    const reports: Report[] = [
        {
            id: "1",
            studentName: "Emma Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
            term: "Q2",
            status: "published",
            date: "2025-01-10",
            avgScore: 92
        },
        {
            id: "2",
            studentName: "Liam Chen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
            term: "Q2",
            status: "generated",
            date: "2025-01-12",
            avgScore: 88
        },
        {
            id: "3",
            studentName: "Olivia Davis",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
            term: "Q2",
            status: "draft",
            date: "2025-01-14",
            avgScore: 85
        },
        {
            id: "4",
            studentName: "Noah Kumar",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
            term: "Q2",
            status: "published",
            date: "2025-01-11",
            avgScore: 90
        }
    ]

    const handleGenerateReports = () => {
        if (!selectedTemplate) return

        setGenerating(true)
        setProgress(0)

        // Simulate generation progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setGenerating(false)
                    setShowTemplates(false)
                    return 100
                }
                return prev + 10
            })
        }, 200)

        onGenerate(selectedTemplate)
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

    const selectAll = () => {
        if (selectedStudents.size === reports.length) {
            setSelectedStudents(new Set())
        } else {
            setSelectedStudents(new Set(reports.map(r => r.id)))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published": return "#10B981"
            case "generated": return "#F59E0B"
            case "draft": return "#6B7280"
            default: return "#E5E7EB"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "published": return "Published"
            case "generated": return "Ready"
            case "draft": return "Draft"
            default: return status
        }
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
                            Report Cards
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

                {/* Term Selector */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    padding: "4px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px"
                }}>
                    {["Q1", "Q2", "Term 1", "Annual"].map(termOption => (
                        <button
                            key={termOption}
                            onClick={() => setTerm(termOption)}
                            style={{
                                minHeight: "36px",
                                padding: "8px 4px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: term === termOption ? "#FFFFFF" : "transparent",
                                color: term === termOption ? "#111827" : "#6B7280",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: term === termOption ? "0 1px 2px rgba(0,0,0,0.05)" : "none"
                            }}
                            aria-label={`Select ${termOption}`}
                        >
                            {termOption}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                {/* Actions Bar */}
                <div style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "20px"
                }}>
                    <button
                        onClick={() => setShowTemplates(true)}
                        style={{
                            flex: 1,
                            minHeight: "48px",
                            padding: "12px",
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
                        aria-label="Generate report cards"
                    >
                        <span style={{ fontSize: "18px" }}>+</span>
                        Generate Reports
                    </button>
                    <button
                        onClick={selectAll}
                        style={{
                            minHeight: "48px",
                            padding: "0 16px",
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "#FFFFFF",
                            color: "#6B7280",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                        aria-label="Select all students"
                    >
                        {selectedStudents.size === reports.length ? "Deselect All" : "Select All"}
                    </button>
                </div>

                {/* Selected Actions */}
                {selectedStudents.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            backgroundColor: "#5B47FB",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <span style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#FFFFFF"
                        }}>
                            {selectedStudents.size} selected
                        </span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                onClick={() => console.log("Download selected")}
                                style={{
                                    minHeight: "36px",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    color: "#FFFFFF",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                                aria-label="Download selected"
                            >
                                Download
                            </button>
                            <button
                                onClick={() => console.log("Publish selected")}
                                style={{
                                    minHeight: "36px",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "#FFFFFF",
                                    color: "#5B47FB",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                                aria-label="Publish selected"
                            >
                                Publish
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Report List */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    {reports.map(report => (
                        <div
                            key={report.id}
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "12px",
                                padding: "16px",
                                border: selectedStudents.has(report.id) ? "2px solid #5B47FB" : "1px solid #E5E7EB",
                                cursor: "pointer"
                            }}
                            onClick={() => toggleStudent(report.id)}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                {/* Checkbox */}
                                <div style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "6px",
                                    border: `2px solid ${selectedStudents.has(report.id) ? "#5B47FB" : "#E5E7EB"}`,
                                    backgroundColor: selectedStudents.has(report.id) ? "#5B47FB" : "#FFFFFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#FFFFFF",
                                    fontSize: "12px"
                                }}>
                                    {selectedStudents.has(report.id) && "✓"}
                                </div>

                                {/* Avatar */}
                                <img
                                    src={report.avatar}
                                    alt={report.studentName}
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                />

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "#111827",
                                        marginBottom: "4px"
                                    }}>
                                        {report.studentName}
                                    </div>
                                    <div style={{
                                        fontSize: "12px",
                                        color: "#6B7280",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <span>{report.term}</span>
                                        <span>•</span>
                                        <span>{report.date}</span>
                                    </div>
                                </div>

                                {/* Score & Status */}
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: "4px"
                                }}>
                                    <div style={{
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        color: "#111827"
                                    }}>
                                        {report.avgScore}%
                                    </div>
                                    <span style={{
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        color: getStatusColor(report.status),
                                        backgroundColor: getStatusColor(report.status) + "20",
                                        padding: "4px 8px",
                                        borderRadius: "6px"
                                    }}>
                                        {getStatusLabel(report.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Template Selection Modal */}
            <AnimatePresence>
                {showTemplates && (
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
                        onClick={() => !generating && setShowTemplates(false)}
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
                                Choose Report Template
                            </h2>
                            <p style={{
                                margin: "0 0 20px",
                                fontSize: "13px",
                                color: "#6B7280"
                            }}>
                                Select a template for {selectedStudents.size || "all"} student(s)
                            </p>

                            {/* Templates */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                marginBottom: "20px"
                            }}>
                                {templates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        disabled={generating}
                                        style={{
                                            padding: "16px",
                                            borderRadius: "12px",
                                            border: selectedTemplate === template.id ? "2px solid #5B47FB" : "1px solid #E5E7EB",
                                            backgroundColor: selectedTemplate === template.id ? "#F5F3FF" : "#FFFFFF",
                                            cursor: generating ? "not-allowed" : "pointer",
                                            textAlign: "left",
                                            opacity: generating ? 0.6 : 1
                                        }}
                                        aria-label={`Select ${template.name}`}
                                    >
                                        <div style={{
                                            display: "flex",
                                            gap: "12px",
                                            alignItems: "flex-start"
                                        }}>
                                            <span style={{ fontSize: "24px" }}>{template.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontSize: "15px",
                                                    fontWeight: 600,
                                                    color: "#111827",
                                                    marginBottom: "4px"
                                                }}>
                                                    {template.name}
                                                </div>
                                                <div style={{
                                                    fontSize: "13px",
                                                    color: "#6B7280",
                                                    lineHeight: "1.4"
                                                }}>
                                                    {template.description}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Progress */}
                            {generating && (
                                <div style={{ marginBottom: "20px" }}>
                                    <div style={{
                                        fontSize: "13px",
                                        color: "#6B7280",
                                        marginBottom: "8px"
                                    }}>
                                        Generating reports... {progress}%
                                    </div>
                                    <div style={{
                                        height: "8px",
                                        backgroundColor: "#E5E7EB",
                                        borderRadius: "4px",
                                        overflow: "hidden"
                                    }}>
                                        <motion.div
                                            animate={{ width: `${progress}%` }}
                                            style={{
                                                height: "100%",
                                                backgroundColor: "#5B47FB",
                                                borderRadius: "4px"
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerateReports}
                                disabled={!selectedTemplate || generating}
                                style={{
                                    width: "100%",
                                    minHeight: "48px",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "none",
                                    backgroundColor: selectedTemplate && !generating ? "#5B47FB" : "#E5E7EB",
                                    color: selectedTemplate && !generating ? "#FFFFFF" : "#9CA3AF",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    cursor: selectedTemplate && !generating ? "pointer" : "not-allowed"
                                }}
                                aria-label="Generate report cards"
                            >
                                {generating ? "Generating..." : "Generate Report Cards"}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

addPropertyControls(ReportCards, {
    className: {
        type: ControlType.String,
        title: "Class Name",
        defaultValue: "Class 10-A"
    },
    selectedTerm: {
        type: ControlType.Enum,
        title: "Term",
        options: ["Q1", "Q2", "Term 1", "Annual"],
        defaultValue: "Q2"
    }
})
