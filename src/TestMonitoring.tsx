/**
 * SCREEN 26: TEST MONITORING (LIVE EXAM MONITORING - TEACHER VIEW)
 *
 * Real-time monitoring dashboard for live exams:
 * - Live student activity grid
 * - Timer countdown
 * - Suspicious activity alerts
 * - Progress tracking per student
 * - Controls: pause, extend time, end test
 * - Student detail drawer
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
 * - Error: #EF4444
 * - Warning: #F59E0B
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface TestMonitoringProps {
  className?: string
  testName?: string
  onPauseTest?: () => void
  onEndTest?: () => void
  onSendAnnouncement?: () => void
}

export function TestMonitoring(props: TestMonitoringProps) {
  const { className = "", testName = "Algebra Unit Test", onPauseTest, onEndTest, onSendAnnouncement } = props

  const [timeRemaining, setTimeRemaining] = React.useState(3262) // 54:22 in seconds
  const [selectedStudent, setSelectedStudent] = React.useState<any>(null)
  const [isPaused, setIsPaused] = React.useState(false)

  const students = [
    { id: 1, name: "Riya Sharma", rollNo: "101", progress: 75, attempted: 30, status: "Attempting", alerts: 2, network: "Good", tabSwitches: 3 },
    { id: 2, name: "Arjun Patel", rollNo: "102", progress: 90, attempted: 36, status: "Attempting", alerts: 0, network: "Excellent", tabSwitches: 0 },
    { id: 3, name: "Priya Singh", rollNo: "103", progress: 45, attempted: 18, status: "Attempting", alerts: 5, network: "Fair", tabSwitches: 8 },
    { id: 4, name: "Karan Mehta", rollNo: "104", progress: 100, attempted: 40, status: "Completed", alerts: 1, network: "Good", tabSwitches: 1 },
    { id: 5, name: "Sneha Gupta", rollNo: "105", progress: 60, attempted: 24, status: "Attempting", alerts: 0, network: "Excellent", tabSwitches: 0 },
    { id: 6, name: "Rahul Kumar", rollNo: "106", progress: 0, attempted: 0, status: "Disconnected", alerts: 15, network: "Poor", tabSwitches: 0 },
  ]

  const stats = {
    inTest: 28,
    total: 32,
    completed: 4,
    attempting: 24,
    disconnected: 3,
    suspiciousAlerts: 11,
    avgProgress: 42,
  }

  React.useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [isPaused])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h > 0 ? String(h).padStart(2, "0") + ":" : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
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
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: "#FFFFFF",
          padding: "16px 20px",
          borderBottom: "1px solid #E5E7EB",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
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
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>{testName}</h1>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>22 Jan, 10:00–11:30 AM</p>
          </div>
          <motion.div
            animate={{ scale: isPaused ? 1 : [1, 1.05, 1] }}
            transition={{ repeat: isPaused ? 0 : Infinity, duration: 2 }}
            style={{
              padding: "6px 14px",
              backgroundColor: isPaused ? "#FEF3C7" : "#FEE2E2",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: isPaused ? "#F59E0B" : "#EF4444",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: isPaused ? "#92400E" : "#991B1B" }}>
              {isPaused ? "PAUSED" : "LIVE"}
            </span>
          </motion.div>
        </div>

        {/* Timer and Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              flex: 1,
              padding: "12px 16px",
              backgroundColor: "#F9FAFB",
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Time Remaining</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: timeRemaining < 600 ? "#EF4444" : "#111827" }}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSendAnnouncement}
            style={{
              padding: "10px 14px",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            📢
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPaused(!isPaused)
              onPauseTest?.()
            }}
            style={{
              padding: "10px 16px",
              backgroundColor: "#F59E0B",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isPaused ? "▶" : "⏸"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEndTest}
            style={{
              padding: "10px 16px",
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            End Test
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: 12,
          padding: "16px 20px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <StatCard label="In Test" value={`${stats.inTest}/${stats.total}`} color="#5B47FB" />
        <StatCard label="Completed" value={stats.completed.toString()} color="#10B981" />
        <StatCard label="Attempting" value={stats.attempting.toString()} color="#3B82F6" />
        <StatCard label="Disconnected" value={stats.disconnected.toString()} color="#EF4444" />
        <StatCard label="Alerts" value={stats.suspiciousAlerts.toString()} color="#F59E0B" />
        <StatCard label="Avg Progress" value={`${stats.avgProgress}%`} color="#8B5CF6" />
      </motion.div>

      {/* Student Grid */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
          Student Monitoring
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => setSelectedStudent(student)}
            />
          ))}
        </div>
      </div>

      {/* Student Detail Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 20,
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                bottom: 0,
                width: "min(400px, 90%)",
                backgroundColor: "#FFFFFF",
                zIndex: 30,
                overflowY: "auto",
                padding: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                  Student Details
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedStudent(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 24,
                    cursor: "pointer",
                    color: "#6B7280",
                  }}
                >
                  ×
                </motion.button>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 16,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#5B47FB",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>
                    {selectedStudent.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>Roll No: {selectedStudent.rollNo}</div>
                </div>
              </div>

              <DetailSection title="Progress">
                <ProgressBar value={selectedStudent.progress} />
                <div style={{ marginTop: 12 }}>
                  <DetailRow label="Questions Attempted" value={`${selectedStudent.attempted}/40`} />
                  <DetailRow label="Time Active" value="38 minutes" />
                  <DetailRow label="Network Quality" value={selectedStudent.network} />
                </div>
              </DetailSection>

              <DetailSection title="Suspicious Activity">
                <div
                  style={{
                    padding: 12,
                    backgroundColor: selectedStudent.tabSwitches > 5 ? "#FEE2E2" : "#F0FDF4",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                    Tab Switches: {selectedStudent.tabSwitches}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {selectedStudent.tabSwitches > 5 ? "⚠️ High - Needs attention" : "✓ Normal behavior"}
                  </div>
                </div>
                <DetailRow label="Camera Issues" value="0" />
                <DetailRow label="Screenshot Attempts" value="0" />
              </DetailSection>

              <DetailSection title="Actions">
                <ActionButton label="Give Extra Time (+10 min)" icon="⏱" />
                <ActionButton label="Issue Warning" icon="⚠️" />
                <ActionButton label="Force Submit" icon="🚫" />
                <ActionButton label="Allow Rejoin" icon="🔄" />
              </DetailSection>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper Components
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function StudentCard({ student, onClick }: { student: any; onClick: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "#10B981"
      case "Attempting":
        return "#3B82F6"
      case "Disconnected":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const getAlertLevel = (alerts: number) => {
    if (alerts === 0) return { bg: "#F0FDF4", color: "#10B981", text: "Safe" }
    if (alerts < 5) return { bg: "#FEF3C7", color: "#F59E0B", text: "Caution" }
    return { bg: "#FEE2E2", color: "#EF4444", text: "Danger" }
  }

  const alertLevel = getAlertLevel(student.alerts)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        cursor: "pointer",
        border: `2px solid ${student.alerts > 5 ? "#EF4444" : "transparent"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 600,
            color: "#6B7280",
          }}
        >
          {student.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{student.name}</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Roll: {student.rollNo}</div>
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: `${getStatusColor(student.status)}15`,
            color: getStatusColor(student.status),
          }}
        >
          {student.status}
        </span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "#6B7280" }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{student.progress}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: 6,
            backgroundColor: "#E5E7EB",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${student.progress}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: "100%",
              backgroundColor: "#5B47FB",
              borderRadius: 3,
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#6B7280" }}>
          {student.attempted}/40 Questions
        </div>
        <div
          style={{
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: alertLevel.bg,
            color: alertLevel.color,
          }}
        >
          {alertLevel.text}
        </div>
      </div>
    </motion.div>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</span>
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#6B7280" }}>Overall Progress</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "#E5E7EB",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
          style={{
            height: "100%",
            backgroundColor: "#10B981",
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  )
}

function ActionButton({ label, icon }: { label: string; icon: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: "100%",
        padding: "12px 16px",
        backgroundColor: "#F9FAFB",
        color: "#374151",
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.button>
  )
}

// Framer Property Controls
addPropertyControls(TestMonitoring, {
  testName: { type: ControlType.String, title: "Test Name" },
})
