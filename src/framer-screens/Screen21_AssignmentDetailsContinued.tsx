/**
 * Screen 21: Assignment Details (Continued)
 * Additional grading features, feedback tools, and export options
 *
 * Features:
 * - Advanced grading interface with rubrics
 * - Rich feedback editor with templates
 * - Bulk actions for multiple submissions
 * - Export options (PDF, CSV, Excel)
 * - Grade distribution analytics
 * - Auto-grading for MCQ sections
 */

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface Submission {
  id: string
  studentName: string
  studentAvatar: string
  score: number | null
  maxScore: number
  status: "graded" | "pending" | "resubmitted"
  submittedAt: string
  gradedAt?: string
  feedback?: string
}

interface AssignmentDetailsContinuedProps {
  assignmentTitle?: string
  totalSubmissions?: number
  graded?: number
  pending?: number
  averageScore?: number
  primaryColor?: string
  successColor?: string
  warningColor?: string
  errorColor?: string
  backgroundColor?: string
  onBack?: () => void
  onExport?: (format: string) => void
  onGradeSubmission?: (submissionId: string, score: number, feedback: string) => void
}

export function Screen21_AssignmentDetailsContinued(props: AssignmentDetailsContinuedProps) {
  const {
    assignmentTitle = "Advanced Algebra Assignment",
    totalSubmissions = 38,
    graded = 22,
    pending = 16,
    averageScore = 18.5,
    primaryColor = "#5B47FB",
    successColor = "#10B981",
    warningColor = "#F59E0B",
    errorColor = "#EF4444",
    backgroundColor = "#F9FAFB",
    onBack,
    onExport,
    onGradeSubmission,
  } = props

  const [activeTab, setActiveTab] = useState<"grading" | "feedback" | "analytics" | "export">("grading")
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [bulkFeedback, setBulkFeedback] = useState("")
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "excel">("pdf")
  const [showRubric, setShowRubric] = useState(false)
  const [gradingView, setGradingView] = useState<"list" | "card">("card")

  // Mock data
  const submissions: Submission[] = [
    {
      id: "1",
      studentName: "Riya Sharma",
      studentAvatar: "RS",
      score: 19,
      maxScore: 20,
      status: "graded",
      submittedAt: "2025-01-15 10:30 AM",
      gradedAt: "2025-01-15 02:15 PM",
      feedback: "Excellent work! Minor calculation error in Q4.",
    },
    {
      id: "2",
      studentName: "Arjun Patel",
      studentAvatar: "AP",
      score: null,
      maxScore: 20,
      status: "pending",
      submittedAt: "2025-01-15 11:45 AM",
    },
    {
      id: "3",
      studentName: "Priya Kumar",
      studentAvatar: "PK",
      score: 17,
      maxScore: 20,
      status: "graded",
      submittedAt: "2025-01-15 09:20 AM",
      gradedAt: "2025-01-15 01:30 PM",
      feedback: "Good effort. Review concepts on quadratic equations.",
    },
  ]

  const feedbackTemplates = [
    "Excellent work! Keep it up.",
    "Good effort. Please review the concepts discussed in class.",
    "You're on the right track. Focus on [specific topic].",
    "Please resubmit after correcting the following errors:",
    "Outstanding! Your solution demonstrates deep understanding.",
  ]

  const rubricCriteria = [
    { name: "Problem Understanding", maxPoints: 5, weight: 25 },
    { name: "Solution Approach", maxPoints: 5, weight: 25 },
    { name: "Calculation Accuracy", maxPoints: 5, weight: 25 },
    { name: "Presentation", maxPoints: 5, weight: 25 },
  ]

  const handleSelectSubmission = (id: string) => {
    setSelectedSubmissions((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const handleBulkAction = (action: "approve" | "requestRevision" | "sendFeedback") => {
    console.log(`Bulk ${action} for:`, selectedSubmissions)
    // Implementation would go here
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor,
        fontFamily: "Inter, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #E5E7EB",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#F3F4F6",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12 16L6 10L12 4"
                  stroke="#1F2937"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
            <div>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {assignmentTitle}
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  margin: "2px 0 0 0",
                }}
              >
                {graded}/{totalSubmissions} graded • Avg: {averageScore}/20
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRubric(!showRubric)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                backgroundColor: showRubric ? primaryColor : "white",
                color: showRubric ? "white" : "#374151",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              aria-label="Toggle rubric"
            >
              Rubric
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                backgroundColor: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="More options"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="5" r="1.5" fill="#374151" />
                <circle cx="10" cy="10" r="1.5" fill="#374151" />
                <circle cx="10" cy="15" r="1.5" fill="#374151" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "0 20px",
            overflowX: "auto",
          }}
        >
          {(["grading", "feedback", "analytics", "export"] as const).map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 20px",
                border: "none",
                backgroundColor: "transparent",
                color: activeTab === tab ? primaryColor : "#6B7280",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                borderBottom: activeTab === tab ? `2px solid ${primaryColor}` : "2px solid transparent",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
              }}
              aria-label={`${tab} tab`}
              aria-selected={activeTab === tab}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        <AnimatePresence mode="wait">
          {activeTab === "grading" && (
            <motion.div
              key="grading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Rubric Panel */}
              {showRubric && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>
                    Grading Rubric
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {rubricCriteria.map((criterion, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                        }}
                      >
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 500, margin: 0 }}>
                            {criterion.name}
                          </p>
                          <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0 0" }}>
                            Weight: {criterion.weight}%
                          </p>
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: primaryColor,
                          }}
                        >
                          {criterion.maxPoints} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Bulk Actions Bar */}
              {selectedSubmissions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "white",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>
                    {selectedSubmissions.length} selected
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBulkAction("approve")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Approve All
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBulkAction("sendFeedback")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Send Feedback
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* View Toggle */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "4px",
                    gap: "4px",
                  }}
                >
                  <button
                    onClick={() => setGradingView("card")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: gradingView === "card" ? "#F3F4F6" : "transparent",
                      color: "#374151",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    aria-label="Card view"
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setGradingView("list")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: gradingView === "list" ? "#F3F4F6" : "transparent",
                      color: "#374151",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    aria-label="List view"
                  >
                    List
                  </button>
                </div>
              </div>

              {/* Submissions Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: gradingView === "card" ? "repeat(auto-fill, minmax(320px, 1fr))" : "1fr",
                  gap: "16px",
                }}
              >
                {submissions.map((submission) => (
                  <motion.div
                    key={submission.id}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      padding: "20px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      border: selectedSubmissions.includes(submission.id)
                        ? `2px solid ${primaryColor}`
                        : "2px solid transparent",
                    }}
                    onClick={() => handleSelectSubmission(submission.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          backgroundColor: primaryColor,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          fontWeight: 600,
                        }}
                      >
                        {submission.studentAvatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                          {submission.studentName}
                        </p>
                        <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0 0" }}>
                          {submission.submittedAt}
                        </p>
                      </div>
                      <div
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          backgroundColor:
                            submission.status === "graded"
                              ? "#DCFCE7"
                              : submission.status === "resubmitted"
                              ? "#FEF3C7"
                              : "#FEE2E2",
                          color:
                            submission.status === "graded"
                              ? "#15803D"
                              : submission.status === "resubmitted"
                              ? "#92400E"
                              : "#991B1B",
                          fontSize: "12px",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {submission.status}
                      </div>
                    </div>

                    {submission.score !== null ? (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <span style={{ fontSize: "14px", color: "#6B7280" }}>Score</span>
                          <span style={{ fontSize: "20px", fontWeight: 700, color: successColor }}>
                            {submission.score}/{submission.maxScore}
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
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(submission.score / submission.maxScore) * 100}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={{
                              height: "100%",
                              backgroundColor: successColor,
                            }}
                          />
                        </div>
                        {submission.feedback && (
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#6B7280",
                              margin: "12px 0 0 0",
                              fontStyle: "italic",
                            }}
                          >
                            "{submission.feedback}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <input
                          type="number"
                          placeholder="Enter score"
                          max={submission.maxScore}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "14px",
                            marginBottom: "12px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Score for ${submission.studentName}`}
                        />
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: primaryColor,
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            // Grade submission logic
                          }}
                        >
                          Grade Submission
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
                  Feedback Templates
                </h3>

                <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
                  {feedbackTemplates.map((template, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setBulkFeedback(template)}
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: bulkFeedback === template ? "#F3F4F6" : "white",
                        textAlign: "left",
                        fontSize: "14px",
                        color: "#374151",
                        cursor: "pointer",
                      }}
                    >
                      {template}
                    </motion.button>
                  ))}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Custom Feedback
                  </label>
                  <textarea
                    value={bulkFeedback}
                    onChange={(e) => setBulkFeedback(e.target.value)}
                    placeholder="Write personalized feedback for selected submissions..."
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                    aria-label="Custom feedback"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={!bulkFeedback || selectedSubmissions.length === 0}
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: !bulkFeedback || selectedSubmissions.length === 0 ? "#E5E7EB" : primaryColor,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: !bulkFeedback || selectedSubmissions.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Send Feedback to {selectedSubmissions.length} Student{selectedSubmissions.length !== 1 ? "s" : ""}
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: "grid", gap: "20px" }}>
                {/* Score Distribution */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
                    Score Distribution
                  </h3>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "200px" }}>
                    {[2, 5, 8, 12, 6, 3, 2].map((count, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${(count / 12) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        style={{
                          flex: 1,
                          backgroundColor: primaryColor,
                          borderRadius: "4px 4px 0 0",
                          position: "relative",
                          minHeight: "20px",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "-24px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          {count}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>0-5</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>6-10</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>11-15</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>16-20</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {[
                    { label: "Average Score", value: "18.5/20", color: successColor },
                    { label: "Highest Score", value: "20/20", color: primaryColor },
                    { label: "Lowest Score", value: "12/20", color: errorColor },
                    { label: "Median Score", value: "18/20", color: warningColor },
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "20px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 8px 0" }}>
                        {metric.label}
                      </p>
                      <p style={{ fontSize: "24px", fontWeight: 700, color: metric.color, margin: 0 }}>
                        {metric.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "export" && (
            <motion.div
              key="export"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>
                  Export Options
                </h3>

                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "12px" }}>
                    Select export format:
                  </p>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {(["pdf", "csv", "excel"] as const).map((format) => (
                      <motion.button
                        key={format}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setExportFormat(format)}
                        style={{
                          padding: "20px",
                          borderRadius: "12px",
                          border: `2px solid ${exportFormat === format ? primaryColor : "#E5E7EB"}`,
                          backgroundColor: exportFormat === format ? "#F0EDFF" : "white",
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            backgroundColor: exportFormat === format ? primaryColor : "#F3F4F6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                          }}
                        >
                          {format === "pdf" && "📄"}
                          {format === "csv" && "📊"}
                          {format === "excel" && "📗"}
                        </div>
                        <div>
                          <p style={{ fontSize: "16px", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>
                            {format}
                          </p>
                          <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0 0" }}>
                            {format === "pdf" && "Detailed report with charts and comments"}
                            {format === "csv" && "Spreadsheet with scores and metadata"}
                            {format === "excel" && "Full workbook with multiple sheets"}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "12px" }}>
                    Include in export:
                  </p>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {[
                      "Student names and IDs",
                      "Submission timestamps",
                      "Scores and grades",
                      "Feedback comments",
                      "Rubric breakdown",
                      "Answer attachments",
                    ].map((option, index) => (
                      <label
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px",
                          borderRadius: "8px",
                          backgroundColor: "#F9FAFB",
                          cursor: "pointer",
                        }}
                      >
                        <input type="checkbox" defaultChecked style={{ width: 18, height: 18 }} />
                        <span style={{ fontSize: "14px", color: "#374151" }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onExport?.(exportFormat)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: primaryColor,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 14V4M10 14L6 10M10 14L14 10M3 17H17"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Export as {exportFormat.toUpperCase()}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Framer property controls
addPropertyControls(Screen21_AssignmentDetailsContinued, {
  assignmentTitle: {
    type: ControlType.String,
    title: "Assignment Title",
    defaultValue: "Advanced Algebra Assignment",
  },
  totalSubmissions: {
    type: ControlType.Number,
    title: "Total Submissions",
    defaultValue: 38,
    min: 0,
    step: 1,
  },
  graded: {
    type: ControlType.Number,
    title: "Graded",
    defaultValue: 22,
    min: 0,
    step: 1,
  },
  pending: {
    type: ControlType.Number,
    title: "Pending",
    defaultValue: 16,
    min: 0,
    step: 1,
  },
  averageScore: {
    type: ControlType.Number,
    title: "Average Score",
    defaultValue: 18.5,
    min: 0,
    max: 20,
    step: 0.1,
  },
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
  warningColor: {
    type: ControlType.Color,
    title: "Warning Color",
    defaultValue: "#F59E0B",
  },
  errorColor: {
    type: ControlType.Color,
    title: "Error Color",
    defaultValue: "#EF4444",
  },
  backgroundColor: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#F9FAFB",
  },
})

export default Screen21_AssignmentDetailsContinued
