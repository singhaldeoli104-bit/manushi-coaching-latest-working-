/**
 * SCREEN 29: QUESTION BANK (TEACHER VIEW)
 *
 * Comprehensive question management system:
 * - Browse, filter, search questions
 * - Grid/list view toggle
 * - Question cards with preview
 * - Filters: type, difficulty, topic, status
 * - Bulk selection
 * - Actions: edit, duplicate, delete, add to test
 * - Create new question FAB
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface QuestionBankProps {
  className?: string
  onCreateQuestion?: () => void
  onAddToTest?: (questionId: string) => void
}

export function QuestionBank(props: QuestionBankProps) {
  const { className = "", onCreateQuestion, onAddToTest } = props

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All")
  const [selectedQuestions, setSelectedQuestions] = React.useState<Set<number>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = React.useState(false)

  const questions = [
    {
      id: 1,
      question: "Solve the equation: 2x + 5 = 15",
      type: "MCQ",
      difficulty: "Easy",
      topic: "Linear Equations",
      marks: 1,
      options: ["x = 5", "x = 10", "x = 15", "x = 20"],
      correctAnswer: "A",
      usedInTests: 5,
      accuracy: 88,
      status: "Verified",
    },
    {
      id: 2,
      question: "Find the roots of x² - 5x + 6 = 0",
      type: "MCQ",
      difficulty: "Medium",
      topic: "Quadratic Equations",
      marks: 2,
      options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 3, 4"],
      correctAnswer: "A",
      usedInTests: 8,
      accuracy: 62,
      status: "Verified",
    },
    {
      id: 3,
      question: "What is the discriminant of ax² + bx + c = 0?",
      type: "Subjective",
      difficulty: "Easy",
      topic: "Quadratic Equations",
      marks: 2,
      usedInTests: 3,
      accuracy: 75,
      status: "Draft",
    },
  ]

  const filters = [
    { label: "All", count: 156 },
    { label: "MCQ", count: 98 },
    { label: "Subjective", count: 42 },
    { label: "Numerical", count: 16 },
  ]

  const toggleSelection = (id: number) => {
    const newSelection = new Set(selectedQuestions)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedQuestions(newSelection)
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
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
              Question Bank
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
              {questions.length} questions total
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "8px 12px",
              backgroundColor: "#F3F4F6",
              color: "#374151",
              border: "none",
              borderRadius: 8,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            📥
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateQuestion}
            style={{
              padding: "8px 16px",
              backgroundColor: "#5B47FB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add
          </motion.button>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Search by question, topic, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 44px",
              fontSize: 14,
              color: "#111827",
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 18,
            }}
          >
            🔍
          </span>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {filters.map((filter) => (
            <FilterChip
              key={filter.label}
              label={filter.label}
              count={filter.count}
              active={selectedFilter === filter.label}
              onClick={() => setSelectedFilter(filter.label)}
            />
          ))}
        </div>

        {/* View Toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            {isSelectionMode
              ? `${selectedQuestions.size} selected`
              : `${questions.length} questions`}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <ViewToggleButton
              icon="☰"
              active={viewMode === "list"}
              onClick={() => setViewMode("list")}
            />
            <ViewToggleButton
              icon="▦"
              active={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
            />
          </div>
        </div>
      </motion.div>

      {/* Question List/Grid */}
      <div style={{ padding: "20px" }}>
        {isSelectionMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: "#EEF2FF",
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              display: "flex",
              gap: 12,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                padding: "10px 16px",
                backgroundColor: "#5B47FB",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Add to Test
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                padding: "10px 16px",
                backgroundColor: "#FFFFFF",
                color: "#374151",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsSelectionMode(false)
                setSelectedQuestions(new Set())
              }}
              style={{
                padding: "10px 16px",
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </motion.button>
          </motion.div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              viewMode === "grid"
                ? "repeat(auto-fill, minmax(300px, 1fr))"
                : "1fr",
            gap: 16,
          }}
        >
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              viewMode={viewMode}
              isSelected={selectedQuestions.has(question.id)}
              isSelectionMode={isSelectionMode}
              onToggleSelection={() => toggleSelection(question.id)}
              onLongPress={() => {
                setIsSelectionMode(true)
                toggleSelection(question.id)
              }}
              onAddToTest={() => onAddToTest?.(question.id.toString())}
            />
          ))}
        </div>
      </div>

      {/* FAB */}
      {!isSelectionMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCreateQuestion}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#5B47FB",
            color: "#FFFFFF",
            border: "none",
            fontSize: 28,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(91, 71, 251, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </motion.button>
      )}
    </div>
  )
}

// Helper Components
function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: "8px 14px",
        backgroundColor: active ? "#5B47FB" : "#F3F4F6",
        color: active ? "#FFFFFF" : "#6B7280",
        border: "none",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          padding: "2px 6px",
          backgroundColor: active ? "#FFFFFF25" : "#E5E7EB",
          borderRadius: 4,
          fontSize: 11,
        }}
      >
        {count}
      </span>
    </motion.button>
  )
}

function ViewToggleButton({
  icon,
  active,
  onClick,
}: {
  icon: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: "8px 12px",
        backgroundColor: active ? "#5B47FB" : "#F3F4F6",
        color: active ? "#FFFFFF" : "#6B7280",
        border: "none",
        borderRadius: 8,
        fontSize: 16,
        cursor: "pointer",
      }}
    >
      {icon}
    </motion.button>
  )
}

function QuestionCard({
  question,
  viewMode,
  isSelected,
  isSelectionMode,
  onToggleSelection,
  onLongPress,
  onAddToTest,
}: {
  question: any
  viewMode: "grid" | "list"
  isSelected: boolean
  isSelectionMode: boolean
  onToggleSelection: () => void
  onLongPress: () => void
  onAddToTest: () => void
}) {
  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "Easy") return "#10B981"
    if (difficulty === "Medium") return "#F59E0B"
    return "#EF4444"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseDown={() => {
        let timer = setTimeout(onLongPress, 500)
        const cleanup = () => clearTimeout(timer)
        window.addEventListener("mouseup", cleanup, { once: true })
      }}
      onClick={isSelectionMode ? onToggleSelection : undefined}
      style={{
        backgroundColor: isSelected ? "#EEF2FF" : "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        cursor: "pointer",
        border: isSelected ? "2px solid #5B47FB" : "1px solid #E5E7EB",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isSelectionMode && (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: isSelected ? "#5B47FB" : "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {isSelected && "✓"}
            </div>
          )}
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: "#F3F4F6",
              color: "#6B7280",
            }}
          >
            {question.type}
          </span>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: `${getDifficultyColor(question.difficulty)}15`,
              color: getDifficultyColor(question.difficulty),
            }}
          >
            {question.difficulty}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            color: "#6B7280",
          }}
        >
          ⋮
        </motion.button>
      </div>

      <p
        style={{
          fontSize: 14,
          color: "#111827",
          marginBottom: 12,
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: viewMode === "grid" ? 3 : 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {question.question}
      </p>

      {question.type === "MCQ" && (
        <div style={{ marginBottom: 12 }}>
          {question.options.slice(0, 2).map((option: string, idx: number) => (
            <div
              key={idx}
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 4,
                paddingLeft: 16,
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0 }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {option}
            </div>
          ))}
          {question.options.length > 2 && (
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
              +{question.options.length - 2} more options
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 12,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#6B7280" }}>
          <span>📚 {question.topic}</span>
          <span>📊 {question.accuracy}%</span>
          <span>⚡ {question.marks}m</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onAddToTest()
          }}
          style={{
            padding: "6px 12px",
            backgroundColor: "#5B47FB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Test
        </motion.button>
      </div>
    </motion.div>
  )
}

addPropertyControls(QuestionBank, {})
