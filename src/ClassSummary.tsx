/**
 * SCREEN 23: CLASS SUMMARY (POST-CLASS SUMMARY & INSIGHTS)
 *
 * Shows comprehensive post-class analytics including:
 * - Attendance summary with charts
 * - Engagement analytics and graphs
 * - Doubts, chat, polls summary
 * - Whiteboard exports
 * - AI-generated class notes
 * - Recommended next actions
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
 * - Error: #EF4444
 * - Warning: #F59E0B
 * - Background: #F9FAFB
 * - Font: Inter
 */

import * as React from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface ClassSummaryProps {
  className?: string
  sessionId?: string
  sessionTitle?: string
  subject?: string
  duration?: string
  studentsJoined?: number
  totalStudents?: number
  engagementScore?: number
  doubtsAsked?: number
  pollsConducted?: number
  whiteboardPages?: number
  onShareWithClass?: () => void
  onAssignHomework?: () => void
  onExportPDF?: () => void
}

export function ClassSummary(props: ClassSummaryProps) {
  const {
    className = "",
    sessionTitle = "Algebra - Linear & Quadratic Equations",
    subject = "Mathematics",
    duration = "42m 12s",
    studentsJoined = 24,
    totalStudents = 38,
    engagementScore = 78,
    doubtsAsked = 11,
    pollsConducted = 2,
    whiteboardPages = 4,
    onShareWithClass,
    onAssignHomework,
    onExportPDF,
  } = props

  const [activeTab, setActiveTab] = React.useState<
    "attendance" | "engagement" | "doubts" | "chat" | "polls"
  >("attendance")

  const attendanceData = [
    { status: "Present", count: 24, color: "#10B981", percentage: 63 },
    { status: "Late", count: 4, color: "#F59E0B", percentage: 11 },
    { status: "Absent", count: 6, color: "#EF4444", percentage: 16 },
    { status: "Left Early", count: 4, color: "#F97316", percentage: 10 },
  ]

  const attendanceList = [
    { id: 1, name: "Riya Sharma", joinTime: "10:02 AM", duration: "40m", status: "Present" },
    { id: 2, name: "Arjun Patel", joinTime: "10:05 AM", duration: "37m", status: "Late" },
    { id: 3, name: "Priya Singh", joinTime: "10:01 AM", duration: "28m", status: "Left Early" },
    { id: 4, name: "Karan Mehta", joinTime: "-", duration: "0m", status: "Absent" },
    { id: 5, name: "Sneha Gupta", joinTime: "10:00 AM", duration: "42m", status: "Present" },
  ]

  const doubts = [
    {
      id: 1,
      student: "Riya Sharma",
      doubt: "How to solve quadratic equations with complex roots?",
      time: "10:15 AM",
      status: "Resolved",
    },
    {
      id: 2,
      student: "Arjun Patel",
      doubt: "What is the discriminant formula?",
      time: "10:28 AM",
      status: "Unresolved",
    },
  ]

  const engagementInsights = [
    "Peak engagement at 17th minute during whiteboard explanation.",
    "Participation dropped after 30 minutes—consider a short break.",
    "Students struggled with concept X (based on doubts asked).",
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div
      className={className}
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        fontFamily: "Inter, -apple-system, sans-serif",
        position: "relative",
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px 24px",
          borderBottom: "1px solid #E5E7EB",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
              color: "#374151",
            }}
          >
            ←
          </motion.button>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
            Class Summary
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          {subject} • {new Date().toLocaleDateString()} • {duration}
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ padding: "24px 20px" }}
      >
        {/* Session Overview Card */}
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginTop: 0 }}>
            {sessionTitle}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 16,
              marginTop: 20,
            }}
          >
            <MetricCard
              label="Students Joined"
              value={`${studentsJoined}/${totalStudents}`}
              color="#5B47FB"
            />
            <MetricCard
              label="Engagement Score"
              value={`${engagementScore}%`}
              color="#10B981"
            />
            <MetricCard label="Doubts Asked" value={doubtsAsked.toString()} color="#F59E0B" />
            <MetricCard label="Polls" value={pollsConducted.toString()} color="#8B5CF6" />
            <MetricCard label="Whiteboard" value={`${whiteboardPages} pages`} color="#3B82F6" />
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            marginBottom: 24,
            padding: "0 4px",
          }}
        >
          {["attendance", "engagement", "doubts", "chat", "polls"].map((tab) => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab as any)}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            />
          ))}
        </motion.div>

        {/* Attendance Section */}
        {activeTab === "attendance" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Attendance Chart */}
            <motion.div
              variants={itemVariants}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0 }}>
                Attendance Breakdown
              </h3>
              <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                <div style={{ flex: 1 }}>
                  <DonutChart data={attendanceData} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  {attendanceData.map((item) => (
                    <div key={item.status} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 3,
                          backgroundColor: item.color,
                        }}
                      />
                      <span style={{ fontSize: 14, color: "#374151", flex: 1 }}>
                        {item.status}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Attendance List */}
            <motion.div
              variants={itemVariants}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0 }}>
                Student Attendance
              </h3>
              <div style={{ marginTop: 16 }}>
                {attendanceList.map((student) => (
                  <AttendanceRow key={student.id} student={student} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <ActionButton label="Mark Corrections" variant="secondary" />
                <ActionButton label="Export Attendance" variant="secondary" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Engagement Section */}
        {activeTab === "engagement" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.div
              variants={itemVariants}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <CircularProgress value={engagementScore} size={120} />
                <p style={{ fontSize: 14, color: "#6B7280", marginTop: 12 }}>
                  Overall Engagement Score
                </p>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                AI Insights
              </h3>
              {engagementInsights.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Doubts Section */}
        {activeTab === "doubts" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.div
              variants={itemVariants}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0 }}>
                Doubts Summary ({doubts.length})
              </h3>
              <div style={{ marginTop: 16 }}>
                {doubts.map((doubt) => (
                  <DoubtCard key={doubt.id} doubt={doubt} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <ActionButton label="Resolve All" variant="primary" />
                <ActionButton label="Export Doubts" variant="secondary" />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* AI-Generated Notes */}
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "2px solid #5B47FB",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>✨</span>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#5B47FB", margin: 0 }}>
              AI-Generated Class Summary
            </h3>
          </div>
          <div
            style={{
              padding: 16,
              backgroundColor: "#F9FAFB",
              borderRadius: 8,
              fontSize: 14,
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: "0 0 12px 0" }}>
              <strong>Topics Covered:</strong> Linear equations basics, solving methods, quadratic
              formula derivation
            </p>
            <p style={{ margin: "0 0 12px 0" }}>
              <strong>Key Examples:</strong> Solved 5 problems on quadratic equations with
              discriminant approach
            </p>
            <p style={{ margin: 0 }}>
              <strong>Recommended Homework:</strong> Practice 10 problems from Chapter 4, Focus on
              discriminant method
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <ActionButton label="Edit Notes" variant="secondary" />
            <ActionButton label="Share with Students" variant="primary" />
          </div>
        </motion.div>

        {/* Recommended Actions */}
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0 }}>
            Recommended Next Actions
          </h3>
          <ActionRecommendation
            icon="📝"
            title="Assign Homework"
            description="5 questions on Algebra (Medium difficulty)"
            action="Assign Now"
          />
          <ActionRecommendation
            icon="⚠️"
            title="Students Needing Attention"
            description="3 students showed low attention & poor attendance"
            action="View List"
          />
          <ActionRecommendation
            icon="📚"
            title="Next Class Preparation"
            description="Continue with Trigonometry basics"
            action="Plan Class"
          />
        </motion.div>
      </motion.div>

      {/* Sticky Bottom Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          padding: "16px 20px",
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          gap: 12,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShareWithClass}
          style={{
            flex: 1,
            padding: "14px 20px",
            backgroundColor: "#5B47FB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Share with Class
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAssignHomework}
          style={{
            flex: 1,
            padding: "14px 20px",
            backgroundColor: "#FFFFFF",
            color: "#5B47FB",
            border: "2px solid #5B47FB",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Assign Homework
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExportPDF}
          style={{
            padding: "14px 16px",
            backgroundColor: "#F3F4F6",
            color: "#374151",
            border: "none",
            borderRadius: 12,
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          📥
        </motion.button>
      </motion.div>
    </div>
  )
}

// Helper Components
function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 20, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        padding: "10px 20px",
        backgroundColor: active ? "#5B47FB" : "#F3F4F6",
        color: active ? "#FFFFFF" : "#6B7280",
        border: "none",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </motion.button>
  )
}

function DonutChart({ data }: { data: Array<{ status: string; percentage: number; color: string }> }) {
  return (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: `conic-gradient(
          ${data.map((item, idx) => {
            const prevPercentage = data.slice(0, idx).reduce((sum, d) => sum + d.percentage, 0)
            return `${item.color} ${prevPercentage}% ${prevPercentage + item.percentage}%`
          }).join(", ")}
        )`,
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {data.reduce((sum, d) => sum + d.count, 0)}
      </div>
    </div>
  )
}

function CircularProgress({ value, size }: { value: number; size: number }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 28,
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {value}%
      </div>
    </div>
  )
}

function AttendanceRow({ student }: { student: any }) {
  const statusColors: Record<string, string> = {
    Present: "#10B981",
    Late: "#F59E0B",
    Absent: "#EF4444",
    "Left Early": "#F97316",
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "#E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 600,
          color: "#6B7280",
        }}
      >
        {student.name.charAt(0)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{student.name}</div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>
          {student.joinTime} • {student.duration}
        </div>
      </div>
      <span
        style={{
          padding: "4px 12px",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          backgroundColor: `${statusColors[student.status]}15`,
          color: statusColors[student.status],
        }}
      >
        {student.status}
      </span>
    </div>
  )
}

function DoubtCard({ doubt }: { doubt: any }) {
  return (
    <div
      style={{
        padding: 16,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{doubt.student}</span>
        <span style={{ fontSize: 12, color: "#6B7280" }}>{doubt.time}</span>
      </div>
      <p style={{ fontSize: 14, color: "#374151", margin: "0 0 12px 0" }}>{doubt.doubt}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: doubt.status === "Resolved" ? "#10B98115" : "#F59E0B15",
            color: doubt.status === "Resolved" ? "#10B981" : "#F59E0B",
          }}
        >
          {doubt.status}
        </span>
      </div>
    </div>
  )
}

function InsightCard({ insight }: { insight: string }) {
  return (
    <div
      style={{
        padding: 16,
        backgroundColor: "#F0F9FF",
        borderRadius: 12,
        marginBottom: 12,
        borderLeft: "4px solid #3B82F6",
      }}
    >
      <p style={{ fontSize: 14, color: "#374151", margin: 0 }}>{insight}</p>
    </div>
  )
}

function ActionRecommendation({
  icon,
  title,
  description,
  action,
}: {
  icon: string
  title: string
  description: string
  action: string
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 32 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: "#6B7280" }}>{description}</div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: "8px 16px",
          backgroundColor: "#5B47FB",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {action}
      </motion.button>
    </div>
  )
}

function ActionButton({ label, variant }: { label: string; variant: "primary" | "secondary" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        flex: 1,
        padding: "10px 16px",
        backgroundColor: variant === "primary" ? "#5B47FB" : "#F3F4F6",
        color: variant === "primary" ? "#FFFFFF" : "#374151",
        border: "none",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </motion.button>
  )
}

// Framer Property Controls
addPropertyControls(ClassSummary, {
  sessionTitle: { type: ControlType.String, title: "Session Title" },
  subject: { type: ControlType.String, title: "Subject" },
  duration: { type: ControlType.String, title: "Duration" },
  studentsJoined: { type: ControlType.Number, title: "Students Joined" },
  totalStudents: { type: ControlType.Number, title: "Total Students" },
  engagementScore: { type: ControlType.Number, title: "Engagement Score", min: 0, max: 100 },
  doubtsAsked: { type: ControlType.Number, title: "Doubts Asked" },
  pollsConducted: { type: ControlType.Number, title: "Polls Conducted" },
  whiteboardPages: { type: ControlType.Number, title: "Whiteboard Pages" },
})
