/**
 * SCREEN 28: STUDENT TEST REPORT (INDIVIDUAL SCORECARD - TEACHER VIEW)
 *
 * Individual student performance report showing:
 * - Overall score, rank, accuracy
 * - Topic-wise performance
 * - Difficulty-level breakdown
 * - Comparison with class average
 * - Question-by-question analysis
 * - Time spent metrics
 */

import * as React from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface StudentTestReportProps {
  className?: string
  studentName?: string
  rollNo?: string
  score?: number
  totalMarks?: number
  rank?: number
  totalStudents?: number
}

export function StudentTestReport(props: StudentTestReportProps) {
  const {
    className = "",
    studentName = "Riya Sharma",
    rollNo = "101",
    score = 56,
    totalMarks = 80,
    rank = 12,
    totalStudents = 38,
  } = props

  const percentage = Math.round((score / totalMarks) * 100)
  const accuracy = 64

  const topicPerformance = [
    { topic: "Linear Equations", score: 78, status: "Strong" },
    { topic: "Quadratic Equations", score: 44, status: "Weak" },
    { topic: "Polynomials", score: 51, status: "Moderate" },
    { topic: "Algebra Basics", score: 62, status: "Moderate" },
  ]

  const questionBreakdown = [
    { qNo: 1, topic: "Linear Eq", difficulty: "Easy", status: "Correct", time: "1.2 min", studentAnswer: "B", correctAnswer: "B" },
    { qNo: 2, topic: "Quadratics", difficulty: "Medium", status: "Incorrect", time: "2.5 min", studentAnswer: "C", correctAnswer: "A" },
    { qNo: 3, topic: "Polynomials", difficulty: "Hard", status: "Skipped", time: "0 min", studentAnswer: "-", correctAnswer: "D" },
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
              Student Test Report
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Detailed Performance Analysis</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#F3F4F6",
              color: "#374151",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📤 Share
          </motion.button>
        </div>
      </motion.div>

      <div style={{ padding: "24px 20px" }}>
        {/* Student Profile Card */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
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
              {studentName.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                {studentName}
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Roll No: {rollNo}</p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 16,
            }}
          >
            <ScoreMetric label="Score" value={`${score}/${totalMarks}`} color="#5B47FB" />
            <ScoreMetric label="Percentage" value={`${percentage}%`} color="#10B981" />
            <ScoreMetric label="Rank" value={`${rank}/${totalStudents}`} color="#F59E0B" />
            <ScoreMetric label="Accuracy" value={`${accuracy}%`} color="#8B5CF6" />
          </div>
        </motion.div>

        {/* Performance Summary */}
        <Card title="Performance Overview">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginTop: 16,
            }}
          >
            <SummaryCard label="Correct" value="24" color="#10B981" />
            <SummaryCard label="Incorrect" value="10" color="#EF4444" />
            <SummaryCard label="Skipped" value="6" color="#6B7280" />
            <SummaryCard label="Review" value="3" color="#F59E0B" />
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
              Average Time per Question
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>1.7 minutes</div>
          </div>
        </Card>

        {/* Topic-wise Performance */}
        <Card title="Topic-wise Performance">
          <div style={{ marginTop: 16 }}>
            {topicPerformance.map((topic) => (
              <TopicPerformanceRow key={topic.topic} topic={topic} />
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              padding: 16,
              backgroundColor: "#FEE2E2",
              borderRadius: 12,
              borderLeft: "4px solid #EF4444",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: "#991B1B", marginBottom: 4 }}>
              Weak Topics Identified
            </div>
            <div style={{ fontSize: 12, color: "#991B1B" }}>
              Quadratics, Polynomials - Recommend additional practice
            </div>
          </div>
        </Card>

        {/* Comparison with Class */}
        <Card title="Comparison with Class Average">
          <ComparisonChart studentValue={percentage} classAverage={63} label="Overall Score" />
          <ComparisonChart studentValue={accuracy} classAverage={58} label="Accuracy" />
          <ComparisonChart studentValue={78} classAverage={65} label="Time Taken (min)" isInverse />
          <div
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: "#F0F9FF",
              borderRadius: 8,
              fontSize: 13,
              color: "#1E40AF",
              lineHeight: 1.5,
            }}
          >
            ✓ Student performed <strong>above class average</strong> but took longer time. Indicates
            thorough approach.
          </div>
        </Card>

        {/* Difficulty Breakdown */}
        <Card title="Difficulty-Level Breakdown">
          <DifficultyRow label="Easy Questions" attempted={12} correct={10} accuracy={83} />
          <DifficultyRow label="Medium Questions" attempted={15} correct={8} accuracy={53} />
          <DifficultyRow label="Hard Questions" attempted={5} correct={1} accuracy={20} />
        </Card>

        {/* Question-by-Question */}
        <Card title="Question-by-Question Analysis">
          <div style={{ marginTop: 16 }}>
            {questionBreakdown.map((q) => (
              <QuestionDetailCard key={q.qNo} question={q} />
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
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
          Assign Practice
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
          Share with Parent
        </motion.button>
      </motion.div>
    </div>
  )
}

// Helper Components
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

function ScoreMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center", padding: 12, backgroundColor: "#F9FAFB", borderRadius: 10 }}>
      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function TopicPerformanceRow({ topic }: { topic: any }) {
  const getColor = (status: string) => {
    if (status === "Strong") return "#10B981"
    if (status === "Weak") return "#EF4444"
    return "#F59E0B"
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: "#111827" }}>{topic.topic}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: getColor(topic.status) }}>
            {topic.score}%
          </span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: `${getColor(topic.status)}15`,
              color: getColor(topic.status),
            }}
          >
            {topic.status}
          </span>
        </div>
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
          animate={{ width: `${topic.score}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: "100%",
            backgroundColor: getColor(topic.status),
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  )
}

function ComparisonChart({
  studentValue,
  classAverage,
  label,
  isInverse = false,
}: {
  studentValue: number
  classAverage: number
  label: string
  isInverse?: boolean
}) {
  const isBetter = isInverse ? studentValue < classAverage : studentValue > classAverage

  return (
    <div style={{ marginBottom: 16, marginTop: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Student</div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: isBetter ? "#10B981" : "#F59E0B",
              width: `${(studentValue / 100) * 100}%`,
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 4 }}>
            {studentValue}
            {!isInverse ? "%" : " min"}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Class Avg</div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#D1D5DB",
              width: `${(classAverage / 100) * 100}%`,
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginTop: 4 }}>
            {classAverage}
            {!isInverse ? "%" : " min"}
          </div>
        </div>
      </div>
    </div>
  )
}

function DifficultyRow({
  label,
  attempted,
  correct,
  accuracy,
}: {
  label: string
  attempted: number
  correct: number
  accuracy: number
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
          {correct}/{attempted}
        </div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{accuracy}% accuracy</div>
      </div>
    </div>
  )
}

function QuestionDetailCard({ question }: { question: any }) {
  const statusColor =
    question.status === "Correct" ? "#10B981" : question.status === "Incorrect" ? "#EF4444" : "#6B7280"

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
          <span style={{ marginLeft: 8, fontSize: 12, color: "#6B7280" }}>{question.topic}</span>
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: `${statusColor}15`,
            color: statusColor,
          }}
        >
          {question.status}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>Student Answer</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
            {question.studentAnswer}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>Correct Answer</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#10B981" }}>
            {question.correctAnswer}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>Difficulty</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{question.difficulty}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>Time Spent</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{question.time}</div>
        </div>
      </div>
    </div>
  )
}

addPropertyControls(StudentTestReport, {
  studentName: { type: ControlType.String, title: "Student Name" },
  rollNo: { type: ControlType.String, title: "Roll Number" },
  score: { type: ControlType.Number, title: "Score" },
  totalMarks: { type: ControlType.Number, title: "Total Marks" },
  rank: { type: ControlType.Number, title: "Rank" },
  totalStudents: { type: ControlType.Number, title: "Total Students" },
})
