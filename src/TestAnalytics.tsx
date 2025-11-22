/**
 * SCREEN 27: TEST ANALYTICS (POST-TEST EVALUATION - TEACHER VIEW)
 *
 * Comprehensive post-test analytics dashboard:
 * - Overall class performance metrics
 * - Score distribution chart (histogram)
 * - Top performers / rank list
 * - Topic-wise analysis
 * - Difficulty-level breakdown
 * - Question-wise analysis
 * - Exportable reports
 */

import * as React from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface TestAnalyticsProps {
  className?: string
  testName?: string
  avgScore?: number
  highestScore?: number
  lowestScore?: number
}

export function TestAnalytics(props: TestAnalyticsProps) {
  const {
    className = "",
    testName = "Algebra Unit Test",
    avgScore = 64,
    highestScore = 92,
    lowestScore = 24,
  } = props

  const [activeTab, setActiveTab] = React.useState<"overview" | "topics" | "questions">("overview")

  const scoreDistribution = [
    { range: "0-10", count: 1 },
    { range: "10-20", count: 2 },
    { range: "20-30", count: 3 },
    { range: "30-40", count: 4 },
    { range: "40-50", count: 5 },
    { range: "50-60", count: 7 },
    { range: "60-70", count: 9 },
    { range: "70-80", count: 6 },
    { range: "80-90", count: 4 },
    { range: "90-100", count: 3 },
  ]

  const toppers = [
    { rank: 1, name: "Priya Singh", score: 92, accuracy: 95 },
    { rank: 2, name: "Arjun Patel", score: 88, accuracy: 92 },
    { rank: 3, name: "Riya Sharma", score: 86, accuracy: 90 },
  ]

  const topicAnalysis = [
    { topic: "Linear Equations", score: 72, color: "#10B981" },
    { topic: "Quadratic Equations", score: 41, color: "#EF4444" },
    { topic: "Polynomials", score: 54, color: "#F59E0B" },
    { topic: "Algebra Basics", score: 68, color: "#10B981" },
  ]

  const questions = [
    { qNo: 1, type: "MCQ", topic: "Linear Eq", difficulty: "Easy", accuracy: 88, avgTime: "1.2 min", status: "Good" },
    { qNo: 2, type: "MCQ", topic: "Quadratics", difficulty: "Medium", accuracy: 42, avgTime: "2.5 min", status: "Confusing" },
    { qNo: 3, type: "Numerical", topic: "Polynomials", difficulty: "Hard", accuracy: 25, avgTime: "4.1 min", status: "Too Difficult" },
  ]

  return (
    <div
      className={className}
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        fontFamily: "Inter, -apple-system, sans-serif",
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
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
              Test Analytics
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{testName}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#5B47FB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>📥</span>
            <span>Export PDF</span>
          </motion.button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {["overview", "topics", "questions"].map((tab) => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab as any)}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            />
          ))}
        </div>
      </motion.div>

      <div style={{ padding: "24px 20px" }}>
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Performance Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <MetricCard label="Average Score" value={`${avgScore}%`} trend="+5%" color="#5B47FB" />
              <MetricCard label="Highest Score" value={`${highestScore}%`} color="#10B981" />
              <MetricCard label="Lowest Score" value={`${lowestScore}%`} color="#EF4444" />
              <MetricCard label="Pass Rate" value="78%" trend="+3%" color="#8B5CF6" />
            </motion.div>

            {/* Score Distribution */}
            <Card title="Score Distribution">
              <div style={{ marginTop: 16 }}>
                {scoreDistribution.map((item) => (
                  <BarChartRow key={item.range} label={item.range} value={item.count} max={10} />
                ))}
              </div>
            </Card>

            {/* Top Performers */}
            <Card title="Top Performers">
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {toppers.map((topper) => (
                  <TopperCard key={topper.rank} topper={topper} />
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Topics Tab */}
        {activeTab === "topics" && (
          <>
            <Card title="Topic-wise Performance">
              <div style={{ marginTop: 20 }}>
                {topicAnalysis.map((topic) => (
                  <TopicRow key={topic.topic} topic={topic} />
                ))}
              </div>
            </Card>

            <Card title="Weak Areas Identified">
              <div
                style={{
                  padding: 16,
                  backgroundColor: "#FEE2E2",
                  borderRadius: 12,
                  borderLeft: "4px solid #EF4444",
                  marginTop: 16,
                }}
              >
                <p style={{ fontSize: 14, color: "#991B1B", margin: 0, lineHeight: 1.6 }}>
                  <strong>Quadratic Equations</strong> - Only 41% average score. Recommend extra
                  practice sessions and revision.
                </p>
              </div>
              <div
                style={{
                  padding: 16,
                  backgroundColor: "#FEF3C7",
                  borderRadius: 12,
                  borderLeft: "4px solid #F59E0B",
                  marginTop: 12,
                }}
              >
                <p style={{ fontSize: 14, color: "#92400E", margin: 0, lineHeight: 1.6 }}>
                  <strong>Polynomials</strong> - 54% average score. Consider assigning targeted homework.
                </p>
              </div>
            </Card>
          </>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <Card title="Question-wise Analysis">
            <div style={{ marginTop: 16 }}>
              {questions.map((q) => (
                <QuestionCard key={q.qNo} question={q} />
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
          Share Results
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
          Plan Revision
        </motion.button>
      </motion.div>
    </div>
  )
}

// Helper Components
function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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
      }}
    >
      {label}
    </motion.button>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 0 }}>
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

function MetricCard({
  label,
  value,
  trend,
  color,
}: {
  label: string
  value: string
  trend?: string
  color: string
}) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color }}>{value}</span>
        {trend && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: trend.startsWith("+") ? "#10B981" : "#EF4444",
            }}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}

function BarChartRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</span>
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
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: "100%",
            backgroundColor: "#5B47FB",
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  )
}

function TopperCard({ topper }: { topper: any }) {
  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"]
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: medalColors[topper.rank - 1] || "#E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 700,
          color: "#FFFFFF",
        }}
      >
        {topper.rank}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{topper.name}</div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>Accuracy: {topper.accuracy}%</div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>{topper.score}%</div>
    </div>
  )
}

function TopicRow({ topic }: { topic: any }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{topic.topic}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: topic.color }}>{topic.score}%</span>
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
          animate={{ width: `${topic.score}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: "100%",
            backgroundColor: topic.color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  )
}

function QuestionCard({ question }: { question: any }) {
  return (
    <div
      style={{
        padding: 16,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        marginBottom: 12,
        border: "1px solid #E5E7EB",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Q{question.qNo}</span>
          <span
            style={{
              marginLeft: 8,
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: "#E5E7EB",
              color: "#6B7280",
            }}
          >
            {question.type}
          </span>
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor:
              question.status === "Good"
                ? "#F0FDF4"
                : question.status === "Confusing"
                ? "#FEF3C7"
                : "#FEE2E2",
            color:
              question.status === "Good"
                ? "#10B981"
                : question.status === "Confusing"
                ? "#F59E0B"
                : "#EF4444",
          }}
        >
          {question.status}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Topic</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{question.topic}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Accuracy</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{question.accuracy}%</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Avg Time</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{question.avgTime}</div>
        </div>
      </div>
    </div>
  )
}

addPropertyControls(TestAnalytics, {
  testName: { type: ControlType.String, title: "Test Name" },
  avgScore: { type: ControlType.Number, title: "Average Score", min: 0, max: 100 },
  highestScore: { type: ControlType.Number, title: "Highest Score", min: 0, max: 100 },
  lowestScore: { type: ControlType.Number, title: "Lowest Score", min: 0, max: 100 },
})
