import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Screen 29: Question Bank (Teacher View)
 *
 * A comprehensive question library management system featuring:
 * - Browse and search questions
 * - Filter by type, difficulty, topic
 * - Quick preview and edit
 * - Bulk selection and actions
 * - Import/export functionality
 *
 * @component
 */

interface Question {
  id: string
  type: "MCQ" | "Numerical" | "Subjective" | "Match" | "Assertion"
  stem: string
  options?: string[]
  correctAnswer: string | number
  topic: string
  subtopic: string
  difficulty: "Easy" | "Medium" | "Hard"
  marks: number
  estimatedTime: string
  tags: string[]
  source: "My Questions" | "Institute" | "AI Generated"
  verified: boolean
  createdBy: string
  lastUpdated: string
}

interface TopicNode {
  name: string
  count: number
  children?: TopicNode[]
}

export interface QuestionBankProps {
  questions?: Question[]
  topics?: TopicNode[]
  onAddQuestion?: () => void
  onImportQuestions?: () => void
  onEditQuestion?: (id: string) => void
  onDeleteQuestion?: (id: string) => void
  onAddToTest?: (id: string) => void
  onPreview?: (id: string) => void
}

const defaultQuestions: Question[] = [
  {
    id: "q1",
    type: "MCQ",
    stem: "What is the value of x in the equation 2x + 5 = 15?",
    options: ["5", "10", "7.5", "20"],
    correctAnswer: "5",
    topic: "Algebra",
    subtopic: "Linear Equations",
    difficulty: "Easy",
    marks: 2,
    estimatedTime: "1 min",
    tags: ["Equations", "Basic"],
    source: "My Questions",
    verified: true,
    createdBy: "Teacher",
    lastUpdated: "2 days ago",
  },
  {
    id: "q2",
    type: "Numerical",
    stem: "Find the roots of the equation x² - 5x + 6 = 0",
    correctAnswer: "2, 3",
    topic: "Algebra",
    subtopic: "Quadratic Equations",
    difficulty: "Medium",
    marks: 4,
    estimatedTime: "3 min",
    tags: ["Quadratics", "Roots"],
    source: "Institute",
    verified: true,
    createdBy: "Admin",
    lastUpdated: "1 week ago",
  },
  {
    id: "q3",
    type: "Subjective",
    stem: "Prove that the sum of angles in a triangle is 180 degrees.",
    correctAnswer: "Proof using parallel lines and alternate angles...",
    topic: "Geometry",
    subtopic: "Triangles",
    difficulty: "Hard",
    marks: 5,
    estimatedTime: "5 min",
    tags: ["Proof", "Triangles", "Angles"],
    source: "My Questions",
    verified: false,
    createdBy: "Teacher",
    lastUpdated: "Today",
  },
]

const defaultTopics: TopicNode[] = [
  {
    name: "Mathematics",
    count: 156,
    children: [
      { name: "Algebra", count: 48 },
      { name: "Geometry", count: 32 },
      { name: "Trigonometry", count: 28 },
      { name: "Calculus", count: 48 },
    ],
  },
  {
    name: "Physics",
    count: 98,
    children: [
      { name: "Mechanics", count: 35 },
      { name: "Thermodynamics", count: 22 },
      { name: "Optics", count: 41 },
    ],
  },
]

export default function QuestionBank({
  questions = defaultQuestions,
  topics = defaultTopics,
  onAddQuestion,
  onImportQuestions,
  onEditQuestion,
  onDeleteQuestion,
  onAddToTest,
  onPreview,
}: QuestionBankProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string | null>(null)
  const [selectedSource, setSelectedSource] = React.useState<string | null>(null)
  const [selectedQuestions, setSelectedQuestions] = React.useState<Set<string>>(new Set())
  const [expandedTopic, setExpandedTopic] = React.useState<string | null>(null)
  const [previewQuestion, setPreviewQuestion] = React.useState<Question | null>(null)

  const filteredQuestions = questions.filter(q => {
    if (searchQuery && !q.stem.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !q.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedType && q.type !== selectedType) return false
    if (selectedDifficulty && q.difficulty !== selectedDifficulty) return false
    if (selectedSource && q.source !== selectedSource) return false
    return true
  })

  const toggleQuestionSelection = (id: string) => {
    const newSelection = new Set(selectedQuestions)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedQuestions(newSelection)
  }

  const handlePreview = (question: Question) => {
    setPreviewQuestion(question)
    onPreview?.(question.id)
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 style={styles.title}>Question Bank</h1>
        <div style={styles.headerActions}>
          <button
            style={styles.actionButton}
            onClick={onImportQuestions}
            aria-label="Import questions"
          >
            📥 Import
          </button>
          <button
            style={styles.primaryButton}
            onClick={onAddQuestion}
            aria-label="Add new question"
          >
            ➕ Add Question
          </button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        style={styles.searchSection}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by question, topic, keyword, difficulty..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search questions"
          />
        </div>
        <div style={styles.filterChips}>
          {["MCQ", "Numerical", "Subjective", "Match", "Assertion"].map((type) => (
            <motion.button
              key={type}
              style={{
                ...styles.filterChip,
                ...(selectedType === type ? styles.filterChipActive : {}),
              }}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {type}
            </motion.button>
          ))}
          <div style={styles.filterDivider} />
          {["Easy", "Medium", "Hard"].map((difficulty) => (
            <motion.button
              key={difficulty}
              style={{
                ...styles.filterChip,
                ...(selectedDifficulty === difficulty ? styles.filterChipActive : {}),
              }}
              onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {difficulty}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div style={styles.mainContent}>
        {/* Sidebar - Topics */}
        <motion.div
          style={styles.sidebar}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h3 style={styles.sidebarTitle}>Topics</h3>
          {topics.map((topic) => (
            <div key={topic.name} style={styles.topicNode}>
              <div
                style={styles.topicHeader}
                onClick={() => setExpandedTopic(expandedTopic === topic.name ? null : topic.name)}
              >
                <span style={styles.topicName}>
                  {topic.children && (expandedTopic === topic.name ? "▼" : "▶")} {topic.name}
                </span>
                <span style={styles.topicCount}>{topic.count}</span>
              </div>
              {expandedTopic === topic.name && topic.children && (
                <motion.div
                  style={styles.topicChildren}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {topic.children.map((child) => (
                    <div key={child.name} style={styles.childTopic}>
                      <span>{child.name}</span>
                      <span style={styles.topicCount}>{child.count}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Questions List */}
        <motion.div
          style={styles.questionsArea}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {selectedQuestions.size > 0 && (
            <div style={styles.bulkActions}>
              <span>{selectedQuestions.size} selected</span>
              <div style={styles.bulkButtons}>
                <button style={styles.bulkButton}>Add to Test</button>
                <button style={styles.bulkButton}>Export</button>
                <button style={styles.bulkButton}>Delete</button>
              </div>
            </div>
          )}

          <div style={styles.resultCount}>
            {filteredQuestions.length} questions found
          </div>

          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              style={styles.questionCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
              whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            >
              <div style={styles.questionCardHeader}>
                <input
                  type="checkbox"
                  checked={selectedQuestions.has(question.id)}
                  onChange={() => toggleQuestionSelection(question.id)}
                  style={styles.checkbox}
                  aria-label={`Select question ${question.id}`}
                />
                <div style={styles.questionTypeIcon}>
                  {question.type === "MCQ" ? "📝" :
                   question.type === "Numerical" ? "🔢" :
                   question.type === "Subjective" ? "📄" : "🔗"}
                </div>
                <div style={styles.questionContent}>
                  <div style={styles.questionStem}>{question.stem}</div>
                  {question.options && (
                    <div style={styles.questionOptions}>
                      {question.options.slice(0, 2).map((opt, i) => (
                        <span key={i} style={styles.optionPreview}>
                          {String.fromCharCode(65 + i)}. {opt}
                        </span>
                      ))}
                      {question.options.length > 2 && <span style={styles.moreOptions}>...</span>}
                    </div>
                  )}
                  <div style={styles.questionMeta}>
                    <span style={styles.metaTag}>{question.topic}</span>
                    <span style={styles.metaTag}>{question.subtopic}</span>
                    <span style={{
                      ...styles.difficultyBadge,
                      backgroundColor:
                        question.difficulty === "Easy" ? "#DCFCE7" :
                        question.difficulty === "Medium" ? "#FEF3C7" : "#FEE2E2",
                      color:
                        question.difficulty === "Easy" ? "#166534" :
                        question.difficulty === "Medium" ? "#92400E" : "#991B1B",
                    }}>
                      {question.difficulty}
                    </span>
                    <span style={styles.metaTag}>{question.marks} marks</span>
                    <span style={styles.metaTag}>{question.estimatedTime}</span>
                    {question.verified && <span style={styles.verifiedBadge}>✓ Verified</span>}
                  </div>
                </div>
                <div style={styles.questionActions}>
                  <button
                    style={styles.iconButton}
                    onClick={() => handlePreview(question)}
                    aria-label="Preview question"
                    title="Preview"
                  >
                    👁️
                  </button>
                  <button
                    style={styles.iconButton}
                    onClick={() => onEditQuestion?.(question.id)}
                    aria-label="Edit question"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.iconButton}
                    onClick={() => onAddToTest?.(question.id)}
                    aria-label="Add to test"
                    title="Add to Test"
                  >
                    ➕
                  </button>
                  <button
                    style={styles.iconButton}
                    onClick={() => onDeleteQuestion?.(question.id)}
                    aria-label="Delete question"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredQuestions.length === 0 && (
            <motion.div
              style={styles.emptyState}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div style={styles.emptyIcon}>📚</div>
              <h3 style={styles.emptyTitle}>No questions found</h3>
              <p style={styles.emptyText}>Try changing your filters or create a new question</p>
              <button style={styles.primaryButton} onClick={onAddQuestion}>
                Create Question
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewQuestion && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewQuestion(null)}
          >
            <motion.div
              style={styles.modalContent}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Question Preview</h2>
                <button
                  style={styles.closeButton}
                  onClick={() => setPreviewQuestion(null)}
                  aria-label="Close preview"
                >
                  ✕
                </button>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.previewQuestion}>{previewQuestion.stem}</div>
                {previewQuestion.options && (
                  <div style={styles.previewOptions}>
                    {previewQuestion.options.map((opt, i) => (
                      <div key={i} style={styles.previewOption}>
                        <span style={styles.optionLabel}>{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                <div style={styles.previewMeta}>
                  <strong>Correct Answer:</strong> {previewQuestion.correctAnswer}
                </div>
                <div style={styles.previewMeta}>
                  <strong>Topic:</strong> {previewQuestion.topic} → {previewQuestion.subtopic}
                </div>
                <div style={styles.previewMeta}>
                  <strong>Difficulty:</strong> {previewQuestion.difficulty}
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button style={styles.actionButton} onClick={() => onEditQuestion?.(previewQuestion.id)}>
                  Edit Question
                </button>
                <button style={styles.primaryButton} onClick={() => onAddToTest?.(previewQuestion.id)}>
                  Add to Test
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "1600px",
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
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
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
  searchSection: {
    marginBottom: "24px",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  searchIcon: {
    fontSize: "20px",
    marginRight: "12px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    fontFamily: "inherit",
  },
  filterChips: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  filterChip: {
    padding: "8px 16px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterChipActive: {
    backgroundColor: "#5B47FB",
    color: "#FFFFFF",
    border: "1px solid #5B47FB",
  },
  filterDivider: {
    width: "1px",
    height: "24px",
    backgroundColor: "#E5E7EB",
    margin: "0 8px",
  },
  mainContent: {
    display: "flex",
    gap: "24px",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    height: "fit-content",
    position: "sticky",
    top: "24px",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    marginTop: 0,
    marginBottom: "16px",
  },
  topicNode: {
    marginBottom: "8px",
  },
  topicHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  topicName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  topicCount: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#9CA3AF",
    backgroundColor: "#F3F4F6",
    padding: "2px 8px",
    borderRadius: "12px",
  },
  topicChildren: {
    marginLeft: "20px",
    marginTop: "8px",
  },
  childTopic: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 12px",
    fontSize: "14px",
    color: "#6B7280",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background-color 0.2s",
  },
  questionsArea: {
    flex: 1,
  },
  bulkActions: {
    backgroundColor: "#E0E7FF",
    padding: "12px 20px",
    borderRadius: "12px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "600",
    color: "#5B47FB",
  },
  bulkButtons: {
    display: "flex",
    gap: "8px",
  },
  bulkButton: {
    padding: "6px 12px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #5B47FB",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#5B47FB",
    cursor: "pointer",
  },
  resultCount: {
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "16px",
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.3s",
  },
  questionCardHeader: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
    marginTop: "4px",
  },
  questionTypeIcon: {
    fontSize: "24px",
  },
  questionContent: {
    flex: 1,
  },
  questionStem: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "12px",
    lineHeight: "1.5",
  },
  questionOptions: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  optionPreview: {
    fontSize: "14px",
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  moreOptions: {
    fontSize: "14px",
    color: "#9CA3AF",
  },
  questionMeta: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  metaTag: {
    fontSize: "12px",
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  difficultyBadge: {
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  verifiedBadge: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#10B981",
    backgroundColor: "#D1FAE5",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  questionActions: {
    display: "flex",
    gap: "8px",
    flexDirection: "column",
  },
  iconButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#6B7280",
    marginBottom: "24px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #E5E7EB",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  closeButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background-color 0.2s",
  },
  modalBody: {
    padding: "24px",
  },
  previewQuestion: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  previewOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  previewOption: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#374151",
  },
  optionLabel: {
    fontWeight: "600",
    color: "#5B47FB",
    minWidth: "24px",
  },
  previewMeta: {
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "8px",
  },
  modalFooter: {
    display: "flex",
    gap: "12px",
    padding: "24px",
    borderTop: "1px solid #E5E7EB",
    justifyContent: "flex-end",
  },
}

QuestionBank.displayName = "QuestionBank"
