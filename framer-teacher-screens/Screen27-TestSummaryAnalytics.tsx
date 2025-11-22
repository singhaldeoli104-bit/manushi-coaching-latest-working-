import * as React from "react"
import { motion } from "framer-motion"

/**
 * Screen 27: Test Summary & Analytics (Post-Test Evaluation)
 *
 * A comprehensive analytics screen showing:
 * - Overall class performance
 * - Score distribution charts
 * - Topic-wise analysis
 * - Question-wise breakdown
 * - Rank list and toppers
 * - Weak students identification
 *
 * @component
 */

interface TestSummary {
  testName: string
  testType: string
  subject: string
  date: string
  duration: string
  assigned: number
  attempted: number
  absent: number
  averageScore: number
  highestScore: number
  lowestScore: number
  passPercentage: number
}

interface TopicPerformance {
  topic: string
  accuracy: number
}

interface StudentRank {
  rank: number
  name: string
  avatar: string
  score: number
  accuracy: number
  timeSpent: string
}

interface QuestionAnalysis {
  questionNo: number
  type: "MCQ" | "Numerical" | "Subjective"
  difficulty: "Easy" | "Medium" | "Hard"
  topic: string
  accuracy: number
  avgTimeSpent: string
}

export interface TestSummaryAnalyticsProps {
  testSummary?: TestSummary
  topicPerformance?: TopicPerformance[]
  topRankers?: StudentRank[]
  questionAnalysis?: QuestionAnalysis[]
  scoreDistribution?: { range: string; count: number }[]
  onExportPDF?: () => void
  onExportExcel?: () => void
  onShareResults?: () => void
  onViewStudent?: (studentId: string) => void
}

const defaultTestSummary: TestSummary = {
  testName: "Unit Test - Algebra",
  testType: "Mock Test",
  subject: "Mathematics",
  date: "Nov 15, 2025",
  duration: "90 min",
  assigned: 38,
  attempted: 32,
  absent: 6,
  averageScore: 64,
  highestScore: 92,
  lowestScore: 24,
  passPercentage: 78,
}

const defaultTopicPerformance: TopicPerformance[] = [
  { topic: "Algebra", accuracy: 68 },
  { topic: "Polynomials", accuracy: 54 },
  { topic: "Linear Equations", accuracy: 72 },
  { topic: "Quadratic Equations", accuracy: 41 },
]

const defaultTopRankers: StudentRank[] = [
  { rank: 1, name: "Priya Sharma", avatar: "PS", score: 92, accuracy: 88, timeSpent: "78 min" },
  { rank: 2, name: "Rahul Kumar", avatar: "RK", score: 88, accuracy: 85, timeSpent: "82 min" },
  { rank: 3, name: "Sneha Patel", avatar: "SP", score: 85, accuracy: 82, timeSpent: "75 min" },
]

const defaultScoreDistribution = [
  { range: "0-10", count: 1 },
  { range: "10-20", count: 2 },
  { range: "20-30", count: 3 },
  { range: "30-40", count: 4 },
  { range: "40-50", count: 6 },
  { range: "50-60", count: 8 },
  { range: "60-70", count: 10 },
  { range: "70-80", count: 12 },
  { range: "80-90", count: 8 },
  { range: "90-100", count: 4 },
]

export default function TestSummaryAnalytics({
  testSummary = defaultTestSummary,
  topicPerformance = defaultTopicPerformance,
  topRankers = defaultTopRankers,
  scoreDistribution = defaultScoreDistribution,
  onExportPDF,
  onExportExcel,
  onShareResults,
  onViewStudent,
}: TestSummaryAnalyticsProps) {
  const maxCount = Math.max(...scoreDistribution.map(d => d.count))

  return (
    <div style={styles.container}>
      {/* Header */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 style={styles.title}>{testSummary.testName}</h1>
          <p style={styles.subtitle}>
            {testSummary.testType} • {testSummary.subject} • {testSummary.date}
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.actionButton}
            onClick={onExportPDF}
            aria-label="Export as PDF"
          >
            📄 Export PDF
          </button>
          <button
            style={styles.actionButton}
            onClick={onExportExcel}
            aria-label="Export as Excel"
          >
            📊 Export Excel
          </button>
          <button
            style={styles.primaryButton}
            onClick={onShareResults}
            aria-label="Share results with students"
          >
            📤 Share Results
          </button>
        </div>
      </motion.div>

      {/* Test Header Summary */}
      <motion.div
        style={styles.summaryCard}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Assigned</span>
            <span style={styles.summaryValue}>{testSummary.assigned}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Attempted</span>
            <span style={styles.summaryValue}>{testSummary.attempted}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Absent</span>
            <span style={styles.summaryValue}>{testSummary.absent}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Duration</span>
            <span style={styles.summaryValue}>{testSummary.duration}</span>
          </div>
        </div>
      </motion.div>

      {/* Overall Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 style={styles.sectionTitle}>Overall Class Performance</h2>
        <div style={styles.performanceGrid}>
          <div style={styles.performanceCard}>
            <div style={styles.performanceLabel}>Average Score</div>
            <div style={styles.performanceValue}>{testSummary.averageScore}%</div>
          </div>
          <div style={styles.performanceCard}>
            <div style={styles.performanceLabel}>Highest Score</div>
            <div style={{...styles.performanceValue, color: '#10B981'}}>{testSummary.highestScore}%</div>
          </div>
          <div style={styles.performanceCard}>
            <div style={styles.performanceLabel}>Lowest Score</div>
            <div style={{...styles.performanceValue, color: '#EF4444'}}>{testSummary.lowestScore}%</div>
          </div>
          <div style={styles.performanceCard}>
            <div style={styles.performanceLabel}>Pass Percentage</div>
            <div style={styles.performanceValue}>{testSummary.passPercentage}%</div>
          </div>
        </div>
      </motion.div>

      {/* Score Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 style={styles.sectionTitle}>Score Distribution</h2>
        <div style={styles.chartCard}>
          <div style={styles.chartContainer}>
            {scoreDistribution.map((item, index) => (
              <motion.div
                key={item.range}
                style={styles.barWrapper}
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
              >
                <motion.div
                  style={{
                    ...styles.bar,
                    height: `${(item.count / maxCount) * 200}px`,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                />
                <div style={styles.barCount}>{item.count}</div>
                <div style={styles.barLabel}>{item.range}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h2 style={styles.sectionTitle}>Top Performers</h2>
        <div style={styles.topperGrid}>
          {topRankers.map((student, index) => (
            <motion.div
              key={student.rank}
              style={{
                ...styles.topperCard,
                ...(student.rank === 1 ? styles.topperCardGold : {}),
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onViewStudent?.(student.name)}
            >
              <div style={styles.rankBadge}>#{student.rank}</div>
              <div style={styles.avatar}>{student.avatar}</div>
              <div style={styles.topperName}>{student.name}</div>
              <div style={styles.topperScore}>{student.score}%</div>
              <div style={styles.topperStats}>
                <span>Accuracy: {student.accuracy}%</span>
                <span>Time: {student.timeSpent}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Topic-wise Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <h2 style={styles.sectionTitle}>Topic-wise Analysis</h2>
        <div style={styles.chartCard}>
          {topicPerformance.map((topic, index) => (
            <motion.div
              key={topic.topic}
              style={styles.topicRow}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            >
              <div style={styles.topicName}>{topic.topic}</div>
              <div style={styles.topicBarContainer}>
                <motion.div
                  style={{
                    ...styles.topicBar,
                    width: `${topic.accuracy}%`,
                    backgroundColor:
                      topic.accuracy >= 70 ? '#10B981' :
                      topic.accuracy >= 50 ? '#F59E0B' : '#EF4444',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.accuracy}%` }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                />
                <span style={styles.topicAccuracy}>{topic.accuracy}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6B7280",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  actionButton: {
    padding: "12px 20px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  primaryButton: {
    padding: "12px 20px",
    backgroundColor: "#5B47FB",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "24px",
  },
  summaryItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#6B7280",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: "32px 0 16px 0",
  },
  performanceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  performanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  performanceLabel: {
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "8px",
  },
  performanceValue: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#5B47FB",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "24px",
  },
  chartContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "300px",
    gap: "8px",
  },
  barWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    minWidth: "40px",
  },
  bar: {
    width: "100%",
    backgroundColor: "#5B47FB",
    borderRadius: "8px 8px 0 0",
    transformOrigin: "bottom",
    minHeight: "20px",
  },
  barCount: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    marginTop: "8px",
  },
  barLabel: {
    fontSize: "12px",
    color: "#6B7280",
    marginTop: "4px",
    textAlign: "center",
  },
  topperGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  topperCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    textAlign: "center",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.3s",
  },
  topperCardGold: {
    border: "2px solid #F59E0B",
    boxShadow: "0 4px 6px rgba(245, 158, 11, 0.2)",
  },
  rankBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#5B47FB",
    color: "#FFFFFF",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#E0E7FF",
    color: "#5B47FB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 auto 12px",
  },
  topperName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  topperScore: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#5B47FB",
    marginBottom: "12px",
  },
  topperStats: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "14px",
    color: "#6B7280",
  },
  topicRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
  },
  topicName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    minWidth: "180px",
  },
  topicBarContainer: {
    flex: 1,
    height: "40px",
    backgroundColor: "#F3F4F6",
    borderRadius: "8px",
    position: "relative",
    overflow: "hidden",
  },
  topicBar: {
    height: "100%",
    borderRadius: "8px",
    transition: "width 0.6s ease",
  },
  topicAccuracy: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
}

// Framer property controls
TestSummaryAnalytics.displayName = "TestSummaryAnalytics"
