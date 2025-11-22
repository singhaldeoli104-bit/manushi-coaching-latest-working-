/**
 * Screen 23: Class Summary (Post-Class Summary & Insights)
 * Shown immediately after live class ends
 */

import React, { useState } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface ClassSummaryProps {
  className?: string
  sessionDuration?: string
  studentsJoined?: number
  totalStudents?: number
  engagementScore?: number
  doubtsResolved?: number
  pollsConducted?: number
  whiteboardPages?: number
  primaryColor?: string
  successColor?: string
  onShareSummary?: () => void
  onDownloadReport?: () => void
  onAssignHomework?: () => void
}

export function Screen23_ClassSummary(props: ClassSummaryProps) {
  const {
    className = "Class 10 Math - Batch A",
    sessionDuration = "42m 15s",
    studentsJoined = 24,
    totalStudents = 38,
    engagementScore = 76,
    doubtsResolved = 11,
    pollsConducted = 2,
    whiteboardPages = 4,
    primaryColor = "#5B47FB",
    successColor = "#10B981",
    onShareSummary,
    onDownloadReport,
    onAssignHomework,
  } = props

  const [showAISummary, setShowAISummary] = useState(true)

  const attendanceData = [
    { label: "Present", count: 24, color: successColor, percentage: 63 },
    { label: "Late", count: 3, color: "#F59E0B", percentage: 8 },
    { label: "Absent", count: 11, color: "#EF4444", percentage: 29 },
  ]

  const students = [
    { name: "Riya Sharma", avatar: "RS", joinTime: "10:30 AM", duration: "42m", status: "Present" },
    { name: "Arjun Patel", avatar: "AP", joinTime: "10:29 AM", duration: "42m", status: "Present" },
    { name: "Priya Kumar", avatar: "PK", joinTime: "10:35 AM", duration: "37m", status: "Late" },
    { name: "Vikram Singh", avatar: "VS", joinTime: "-", duration: "0m", status: "Absent" },
  ]

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB", padding: "20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                backgroundColor: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              ✅
            </div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: 0 }}>
                Class Completed
              </h1>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: "4px 0 0 0" }}>
                {className} • {sessionDuration}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
            {[
              { label: "Attended", value: `${studentsJoined}/${totalStudents}`, icon: "👥" },
              { label: "Engagement", value: `${engagementScore}%`, icon: "📊" },
              { label: "Doubts Resolved", value: doubtsResolved, icon: "💡" },
              { label: "Polls", value: pollsConducted, icon: "📋" },
              { label: "Whiteboard", value: `${whiteboardPages} pages`, icon: "✏️" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{stat.icon}</div>
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: 0 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0 0" }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          {/* Left Column */}
          <div style={{ display: "grid", gap: "20px" }}>
            {/* AI Summary */}
            {showAISummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🤖</span>
                    <h2 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
                      AI-Generated Summary
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAISummary(false)}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "#9CA3AF",
                    }}
                    aria-label="Close AI summary"
                  >
                    ✕
                  </button>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#374151",
                  }}
                >
                  <p><strong>Topics Covered:</strong> Quadratic equations, factorization methods, discriminant analysis</p>
                  <p><strong>Key Explanations:</strong> Demonstrated solving quadratic equations using three methods - factorization, completing the square, and quadratic formula. Emphasized when to use each method.</p>
                  <p><strong>Examples Solved:</strong> 5 problems ranging from basic to advanced difficulty</p>
                  <p><strong>Student Engagement:</strong> High participation with 11 doubts clarified. Most common question: "When to use discriminant?"</p>
                  <p><strong>Recommended Next Steps:</strong> Assign practice problems on discriminant. Schedule revision session for struggling students.</p>
                </div>
              </motion.div>
            )}

            {/* Attendance Summary */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px" }}>
                Attendance Summary
              </h3>

              {/* Pie Chart Visualization */}
              <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ position: "relative", width: "120px", height: "120px" }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {attendanceData.reduce((acc, item, index) => {
                      const previousPercentage = attendanceData.slice(0, index).reduce((sum, d) => sum + d.percentage, 0)
                      const startAngle = (previousPercentage / 100) * 360 - 90
                      const endAngle = ((previousPercentage + item.percentage) / 100) * 360 - 90

                      const startRad = (startAngle * Math.PI) / 180
                      const endRad = (endAngle * Math.PI) / 180

                      const x1 = 60 + 50 * Math.cos(startRad)
                      const y1 = 60 + 50 * Math.sin(startRad)
                      const x2 = 60 + 50 * Math.cos(endRad)
                      const y2 = 60 + 50 * Math.sin(endRad)

                      const largeArc = item.percentage > 50 ? 1 : 0

                      acc.push(
                        <path
                          key={index}
                          d={`M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={item.color}
                        />
                      )
                      return acc
                    }, [] as JSX.Element[])}
                    <circle cx="60" cy="60" r="35" fill="white" />
                    <text x="60" y="60" textAnchor="middle" dy="8" fontSize="24" fontWeight="bold" fill="#111827">
                      {Math.round((studentsJoined / totalStudents) * 100)}%
                    </text>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  {attendanceData.map((item, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: item.color }} />
                      <span style={{ fontSize: "14px", color: "#374151", flex: 1 }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student List */}
              <div style={{ display: "grid", gap: "10px" }}>
                {students.map((student, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: primaryColor,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {student.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>{student.name}</p>
                      <p style={{ fontSize: "12px", color: "#6B7280", margin: "2px 0 0 0" }}>
                        {student.joinTime} • {student.duration}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        backgroundColor:
                          student.status === "Present"
                            ? "#DCFCE7"
                            : student.status === "Late"
                            ? "#FEF3C7"
                            : "#FEE2E2",
                        color:
                          student.status === "Present"
                            ? "#15803D"
                            : student.status === "Late"
                            ? "#92400E"
                            : "#991B1B",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {student.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Analytics */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px" }}>
                Engagement Over Time
              </h3>
              <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "6px" }}>
                {[45, 62, 78, 85, 92, 88, 95, 90, 85, 80, 75, 70].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    style={{
                      flex: 1,
                      backgroundColor: value > 75 ? successColor : value > 50 ? "#F59E0B" : "#EF4444",
                      borderRadius: "4px 4px 0 0",
                      minHeight: "20px",
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <span style={{ fontSize: "12px", color: "#6B7280" }}>Start</span>
                <span style={{ fontSize: "12px", color: "#6B7280" }}>Middle</span>
                <span style={{ fontSize: "12px", color: "#6B7280" }}>End</span>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                position: "sticky",
                top: "20px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "20px" }}>
                Quick Actions
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { label: "Share Summary", icon: "📤", onClick: onShareSummary },
                  { label: "Download Report", icon: "📥", onClick: onDownloadReport },
                  { label: "Assign Homework", icon: "📝", onClick: onAssignHomework },
                  { label: "Export Attendance", icon: "📊", onClick: () => {} },
                  { label: "Send to Parents", icon: "👨‍👩‍👧", onClick: () => {} },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    style={{
                      padding: "16px",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>{action.icon}</span>
                    {action.label}
                  </motion.button>
                ))}
              </div>

              {/* Recording Card */}
              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  backgroundColor: "#F0EDFF",
                  borderRadius: "10px",
                  border: "1px solid #E0D7FF",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "32px" }}>🎥</span>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
                      Recording Available
                    </p>
                    <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0 0" }}>
                      Duration: {sessionDuration}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: primaryColor,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View Recording
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

addPropertyControls(Screen23_ClassSummary, {
  className: { type: ControlType.String, title: "Class Name", defaultValue: "Class 10 Math - Batch A" },
  sessionDuration: { type: ControlType.String, title: "Duration", defaultValue: "42m 15s" },
  studentsJoined: { type: ControlType.Number, title: "Students Joined", defaultValue: 24, min: 0 },
  totalStudents: { type: ControlType.Number, title: "Total Students", defaultValue: 38, min: 0 },
  engagementScore: { type: ControlType.Number, title: "Engagement Score", defaultValue: 76, min: 0, max: 100 },
  doubtsResolved: { type: ControlType.Number, title: "Doubts Resolved", defaultValue: 11, min: 0 },
  pollsConducted: { type: ControlType.Number, title: "Polls Conducted", defaultValue: 2, min: 0 },
  whiteboardPages: { type: ControlType.Number, title: "Whiteboard Pages", defaultValue: 4, min: 0 },
  primaryColor: { type: ControlType.Color, title: "Primary Color", defaultValue: "#5B47FB" },
  successColor: { type: ControlType.Color, title: "Success Color", defaultValue: "#10B981" },
})

export default Screen23_ClassSummary
