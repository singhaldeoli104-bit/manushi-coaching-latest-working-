import * as React from "react"
import { motion } from "framer-motion"

/**
 * Screen 28: Student Test Report (Individual Scorecard)
 *
 * Detailed individual student performance view showing:
 * - Student profile and overall score
 * - Question-by-question breakdown
 * - Topic-wise performance
 * - Comparison with class average
 * - Time analysis
 * - Teacher feedback section
 *
 * @component
 */

interface StudentInfo {
  name: string
  rollNumber: string
  class: string
  avatar: string
  photo?: string
}

interface TestScore {
  score: number
  totalMarks: number
  percentage: number
  rank: number
  totalStudents: number
  accuracy: number
  timeSpent: string
}

interface QuestionDetail {
  questionNo: number
  type: "MCQ" | "Numerical" | "Subjective"
  marks: number
  studentAnswer: string | number
  correctAnswer: string | number
  isCorrect: boolean
  timeSpent: string
  topic: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface TopicAnalysis {
  topic: string
  attempted: number
  correct: number
  accuracy: number
}

interface ComparisonData {
  studentScore: number
  classAverage: number
  studentTime: string
  classAvgTime: string
}

export interface StudentTestReportProps {
  student?: StudentInfo
  testScore?: TestScore
  questions?: QuestionDetail[]
  topicAnalysis?: TopicAnalysis[]
  comparison?: ComparisonData
  onAssignHomework?: () => void
  onShareReport?: () => void
  onExportPDF?: () => void
  onNotifyParent?: () => void
}

const defaultStudent: StudentInfo = {
  name: "Priya Sharma",
  rollNumber: "A-12",
  class: "Class 10-A",
  avatar: "PS",
}

const defaultTestScore: TestScore = {
  score: 56,
  totalMarks: 80,
  percentage: 70,
  rank: 12,
  totalStudents: 38,
  accuracy: 64,
  timeSpent: "78 min",
}

const defaultQuestions: QuestionDetail[] = [
  { questionNo: 1, type: "MCQ", marks: 2, studentAnswer: "B", correctAnswer: "B", isCorrect: true, timeSpent: "1.2 min", topic: "Algebra", difficulty: "Easy" },
  { questionNo: 2, type: "MCQ", marks: 2, studentAnswer: "C", correctAnswer: "A", isCorrect: false, timeSpent: "2.1 min", topic: "Polynomials", difficulty: "Medium" },
  { questionNo: 3, type: "Numerical", marks: 4, studentAnswer: 12, correctAnswer: 12, isCorrect: true, timeSpent: "3.5 min", topic: "Quadratics", difficulty: "Hard" },
  { questionNo: 4, type: "MCQ", marks: 2, studentAnswer: "", correctAnswer: "D", isCorrect: false, timeSpent: "0 min", topic: "Linear Equations", difficulty: "Easy" },
]

const defaultTopicAnalysis: TopicAnalysis[] = [
  { topic: "Algebra", attempted: 8, correct: 5, accuracy: 62 },
  { topic: "Linear Equations", attempted: 10, correct: 8, accuracy: 80 },
  { topic: "Quadratics", attempted: 6, correct: 3, accuracy: 50 },
  { topic: "Polynomials", attempted: 8, correct: 4, accuracy: 50 },
]

const defaultComparison: ComparisonData = {
  studentScore: 70,
  classAverage: 63,
  studentTime: "78 min",
  classAvgTime: "65 min",
}

export default function StudentTestReport({
  student = defaultStudent,
  testScore = defaultTestScore,
  questions = defaultQuestions,
  topicAnalysis = defaultTopicAnalysis,
  comparison = defaultComparison,
  onAssignHomework,
  onShareReport,
  onExportPDF,
  onNotifyParent,
}: StudentTestReportProps) {
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(null)

  return (
    <div style={styles.container}>
      {/* Header with Student Info */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={styles.studentInfo}>
          <div style={styles.avatar}>{student.avatar}</div>
          <div>
            <h1 style={styles.studentName}>{student.name}</h1>
            <p style={styles.studentDetails}>
              {student.rollNumber} • {student.class}
            </p>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.actionButton} onClick={onExportPDF} aria-label="Export PDF">
            📄 Export
          </button>
          <button style={styles.primaryButton} onClick={onShareReport} aria-label="Share report">
            📤 Share Report
          </button>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        style={styles.scoreCard}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div style={styles.scoreHeader}>
          <div>
            <div style={styles.scoreValue}>
              {testScore.score}/{testScore.totalMarks}
            </div>
            <div style={styles.scoreLabel}>Total Score</div>
          </div>
          <div style={styles.scoreStats}>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{testScore.percentage}%</span>
              <span style={styles.statLabel}>Percentage</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>#{testScore.rank}/{testScore.totalStudents}</span>
              <span style={styles.statLabel}>Rank</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{testScore.accuracy}%</span>
              <span style={styles.statLabel}>Accuracy</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{testScore.timeSpent}</span>
              <span style={styles.statLabel}>Time Spent</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        style={styles.summaryGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div style={styles.summaryCard}>
          <div style={{...styles.summaryIcon, backgroundColor: '#DCFCE7'}}>✓</div>
          <div style={styles.summaryValue}>{questions.filter(q => q.isCorrect).length}</div>
          <div style={styles.summaryLabel}>Correct</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={{...styles.summaryIcon, backgroundColor: '#FEE2E2'}}>✗</div>
          <div style={styles.summaryValue}>{questions.filter(q => !q.isCorrect && q.studentAnswer).length}</div>
          <div style={styles.summaryLabel}>Incorrect</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={{...styles.summaryIcon, backgroundColor: '#FEF3C7'}}>−</div>
          <div style={styles.summaryValue}>{questions.filter(q => !q.studentAnswer).length}</div>
          <div style={styles.summaryLabel}>Skipped</div>
        </div>
      </motion.div>

      {/* Comparison with Class */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 style={styles.sectionTitle}>Comparison with Class Average</h2>
        <div style={styles.comparisonCard}>
          <div style={styles.comparisonRow}>
            <span style={styles.comparisonLabel}>Score</span>
            <div style={styles.comparisonBars}>
              <div style={styles.comparisonBarGroup}>
                <span style={styles.comparisonBarLabel}>Student: {comparison.studentScore}%</span>
                <motion.div
                  style={{...styles.comparisonBar, backgroundColor: '#5B47FB'}}
                  initial={{ width: 0 }}
                  animate={{ width: `${comparison.studentScore}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
              <div style={styles.comparisonBarGroup}>
                <span style={styles.comparisonBarLabel}>Class Avg: {comparison.classAverage}%</span>
                <motion.div
                  style={{...styles.comparisonBar, backgroundColor: '#94A3B8'}}
                  initial={{ width: 0 }}
                  animate={{ width: `${comparison.classAverage}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </div>
            </div>
          </div>
          <div style={styles.comparisonInsight}>
            {comparison.studentScore > comparison.classAverage
              ? `🎉 Student performed ${comparison.studentScore - comparison.classAverage}% above class average!`
              : `Student scored ${comparison.classAverage - comparison.studentScore}% below class average. Consider assigning additional practice.`
            }
          </div>
        </div>
      </motion.div>

      {/* Topic-wise Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h2 style={styles.sectionTitle}>Topic-wise Performance</h2>
        <div style={styles.topicCard}>
          {topicAnalysis.map((topic, index) => (
            <motion.div
              key={topic.topic}
              style={styles.topicRow}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            >
              <div style={styles.topicInfo}>
                <div style={styles.topicName}>{topic.topic}</div>
                <div style={styles.topicStats}>
                  {topic.correct}/{topic.attempted} correct
                </div>
              </div>
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
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                />
                <span style={styles.topicAccuracy}>{topic.accuracy}%</span>
              </div>
            </motion.div>
          ))}
          {topicAnalysis.filter(t => t.accuracy < 50).length > 0 && (
            <div style={styles.weakTopicBanner}>
              <strong>Weak Topics:</strong> {topicAnalysis.filter(t => t.accuracy < 50).map(t => t.topic).join(', ')}
              <button style={styles.assignButton} onClick={onAssignHomework}>
                Assign Practice
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Question-by-Question Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <h2 style={styles.sectionTitle}>Question-by-Question Analysis</h2>
        <div style={styles.questionsCard}>
          {questions.map((question, index) => (
            <motion.div
              key={question.questionNo}
              style={styles.questionRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
            >
              <div
                style={styles.questionHeader}
                onClick={() => setExpandedQuestion(expandedQuestion === question.questionNo ? null : question.questionNo)}
              >
                <div style={styles.questionNumber}>Q{question.questionNo}</div>
                <div style={styles.questionMeta}>
                  <span style={styles.questionType}>{question.type}</span>
                  <span style={styles.questionTopic}>{question.topic}</span>
                  <span style={{
                    ...styles.questionDifficulty,
                    color: question.difficulty === 'Easy' ? '#10B981' :
                           question.difficulty === 'Medium' ? '#F59E0B' : '#EF4444'
                  }}>
                    {question.difficulty}
                  </span>
                </div>
                <div style={styles.questionStatus}>
                  {!question.studentAnswer ? (
                    <span style={{...styles.statusBadge, backgroundColor: '#FEF3C7', color: '#92400E'}}>
                      Skipped
                    </span>
                  ) : question.isCorrect ? (
                    <span style={{...styles.statusBadge, backgroundColor: '#DCFCE7', color: '#166534'}}>
                      ✓ Correct
                    </span>
                  ) : (
                    <span style={{...styles.statusBadge, backgroundColor: '#FEE2E2', color: '#991B1B'}}>
                      ✗ Incorrect
                    </span>
                  )}
                  <span style={styles.questionTime}>{question.timeSpent}</span>
                  <span style={styles.questionMarks}>{question.marks} marks</span>
                </div>
              </div>
              {expandedQuestion === question.questionNo && (
                <motion.div
                  style={styles.questionDetails}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={styles.answerRow}>
                    <strong>Student's Answer:</strong>{' '}
                    <span style={question.isCorrect ? styles.correctAnswer : styles.incorrectAnswer}>
                      {question.studentAnswer || "Not attempted"}
                    </span>
                  </div>
                  <div style={styles.answerRow}>
                    <strong>Correct Answer:</strong>{' '}
                    <span style={styles.correctAnswer}>{question.correctAnswer}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Footer */}
      <motion.div
        style={styles.footer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <button style={styles.footerButton} onClick={onAssignHomework}>
          📝 Assign Homework
        </button>
        <button style={styles.footerButton} onClick={onNotifyParent}>
          👪 Notify Parent
        </button>
        <button style={styles.footerButton} onClick={onExportPDF}>
          📄 Export PDF
        </button>
        <button style={styles.footerPrimaryButton} onClick={onShareReport}>
          📤 Share Report
        </button>
      </motion.div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  studentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
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
  },
  studentName: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  studentDetails: {
    fontSize: "14px",
    color: "#6B7280",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  actionButton: {
    padding: "10px 20px",
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
    padding: "10px 20px",
    backgroundColor: "#5B47FB",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  scoreCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  scoreHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
  },
  scoreValue: {
    fontSize: "56px",
    fontWeight: "700",
    color: "#5B47FB",
    lineHeight: "1",
  },
  scoreLabel: {
    fontSize: "16px",
    color: "#6B7280",
    marginTop: "8px",
  },
  scoreStats: {
    display: "flex",
    gap: "32px",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6B7280",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  summaryIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    fontSize: "24px",
  },
  summaryValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px",
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    margin: "32px 0 16px 0",
  },
  comparisonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  comparisonRow: {
    marginBottom: "16px",
  },
  comparisonLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    display: "block",
    marginBottom: "12px",
  },
  comparisonBars: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  comparisonBarGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  comparisonBarLabel: {
    fontSize: "14px",
    color: "#6B7280",
  },
  comparisonBar: {
    height: "32px",
    borderRadius: "8px",
    transition: "width 0.8s ease",
  },
  comparisonInsight: {
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#F3F4F6",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#374151",
  },
  topicCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  topicRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  topicInfo: {
    minWidth: "200px",
  },
  topicName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px",
  },
  topicStats: {
    fontSize: "14px",
    color: "#6B7280",
  },
  topicBarContainer: {
    flex: 1,
    height: "36px",
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
  weakTopicBanner: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#FEF3C7",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#92400E",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  assignButton: {
    padding: "8px 16px",
    backgroundColor: "#5B47FB",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  questionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  questionRow: {
    borderBottom: "1px solid #E5E7EB",
    marginBottom: "16px",
    paddingBottom: "16px",
  },
  questionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
    flexWrap: "wrap",
  },
  questionNumber: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#5B47FB",
    minWidth: "40px",
  },
  questionMeta: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    flex: 1,
  },
  questionType: {
    fontSize: "12px",
    padding: "4px 8px",
    backgroundColor: "#E0E7FF",
    color: "#5B47FB",
    borderRadius: "4px",
    fontWeight: "600",
  },
  questionTopic: {
    fontSize: "14px",
    color: "#6B7280",
  },
  questionDifficulty: {
    fontSize: "14px",
    fontWeight: "600",
  },
  questionStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  questionTime: {
    fontSize: "14px",
    color: "#6B7280",
  },
  questionMarks: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
  questionDetails: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
  },
  answerRow: {
    marginBottom: "8px",
    fontSize: "14px",
    color: "#374151",
  },
  correctAnswer: {
    color: "#10B981",
    fontWeight: "600",
  },
  incorrectAnswer: {
    color: "#EF4444",
    fontWeight: "600",
  },
  footer: {
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: "20px 24px",
    boxShadow: "0 -4px 6px rgba(0,0,0,0.1)",
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    borderRadius: "16px 16px 0 0",
  },
  footerButton: {
    padding: "12px 24px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  footerPrimaryButton: {
    padding: "12px 24px",
    backgroundColor: "#5B47FB",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    cursor: "pointer",
    transition: "all 0.2s",
  },
}

StudentTestReport.displayName = "StudentTestReport"
