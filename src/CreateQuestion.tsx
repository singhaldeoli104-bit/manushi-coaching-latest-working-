/**
 * SCREEN 30: CREATE QUESTION (FULL QUESTION BUILDER - TEACHER VIEW)
 *
 * Comprehensive question creation tool:
 * - Question type selector (MCQ, Numerical, Subjective, etc.)
 * - Rich text editor with LaTeX support
 * - Image upload
 * - Options builder (for MCQ)
 * - Answer marking
 * - Metadata: difficulty, topic, marks
 * - Explanation field
 * - Live preview
 */

import * as React from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface CreateQuestionProps {
  className?: string
  onSave?: () => void
  onPreview?: () => void
}

type QuestionType = "MCQ Single" | "MCQ Multiple" | "Numerical" | "Subjective" | "Match" | "Assertion-Reason"

export function CreateQuestion(props: CreateQuestionProps) {
  const { className = "", onSave, onPreview } = props

  const [questionType, setQuestionType] = React.useState<QuestionType>("MCQ Single")
  const [questionText, setQuestionText] = React.useState("")
  const [options, setOptions] = React.useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = React.useState<number[]>([])
  const [difficulty, setDifficulty] = React.useState("Medium")
  const [topic, setTopic] = React.useState("Linear Equations")
  const [marks, setMarks] = React.useState(1)
  const [explanation, setExplanation] = React.useState("")
  const [showPreview, setShowPreview] = React.useState(false)

  const questionTypes: QuestionType[] = [
    "MCQ Single",
    "MCQ Multiple",
    "Numerical",
    "Subjective",
    "Match",
    "Assertion-Reason",
  ]

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const toggleCorrectAnswer = (index: number) => {
    if (questionType === "MCQ Single") {
      setCorrectAnswer([index])
    } else {
      if (correctAnswer.includes(index)) {
        setCorrectAnswer(correctAnswer.filter((i) => i !== index))
      } else {
        setCorrectAnswer([...correctAnswer, index])
      }
    }
  }

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
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
              Create Question
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Build your question step by step</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPreview(!showPreview)}
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
            👁 Preview
          </motion.button>
        </div>
      </motion.div>

      <div style={{ display: "flex", gap: 24, padding: "24px 20px" }}>
        {/* Main Editor (Left Column) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Question Type Selector */}
          <Card title="Question Type">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 8,
                marginTop: 16,
              }}
            >
              {questionTypes.map((type) => (
                <TypeButton
                  key={type}
                  label={type}
                  active={questionType === type}
                  onClick={() => setQuestionType(type)}
                />
              ))}
            </div>
          </Card>

          {/* Question Text Editor */}
          <Card title="Question Text">
            <div style={{ marginTop: 16 }}>
              <EditorToolbar />
              <textarea
                placeholder="Enter your question here... Use LaTeX for math: e.g., $x^2 + 5x + 6$"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={6}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: 14,
                  color: "#111827",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  outline: "none",
                  fontFamily: "inherit",
                  resize: "vertical",
                  marginTop: 8,
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <ToolButton icon="📷" label="Image" />
                <ToolButton icon="∑" label="LaTeX" />
                <ToolButton icon="📊" label="Table" />
              </div>
            </div>
          </Card>

          {/* Options Builder (for MCQ) */}
          {(questionType === "MCQ Single" || questionType === "MCQ Multiple") && (
            <Card title="Options">
              <div style={{ marginTop: 16 }}>
                {options.map((option, index) => (
                  <OptionRow
                    key={index}
                    index={index}
                    value={option}
                    isCorrect={correctAnswer.includes(index)}
                    isSingleSelect={questionType === "MCQ Single"}
                    onChange={(value) => updateOption(index, value)}
                    onToggleCorrect={() => toggleCorrectAnswer(index)}
                    onRemove={() => removeOption(index)}
                  />
                ))}
                {options.length < 6 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addOption}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#F9FAFB",
                      color: "#6B7280",
                      border: "1px dashed #D1D5DB",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      marginTop: 8,
                    }}
                  >
                    + Add Option
                  </motion.button>
                )}
              </div>
            </Card>
          )}

          {/* Numerical Answer */}
          {questionType === "Numerical" && (
            <Card title="Correct Answer">
              <div style={{ marginTop: 16 }}>
                <InputField
                  label="Answer"
                  type="number"
                  placeholder="Enter numerical answer"
                  value=""
                  onChange={() => {}}
                />
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontSize: 13, color: "#6B7280", marginBottom: 8, display: "block" }}>
                    Accepted Range (Optional)
                  </label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <InputField label="Min" type="number" placeholder="Min" value="" onChange={() => {}} />
                    <InputField label="Max" type="number" placeholder="Max" value="" onChange={() => {}} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Subjective Answer */}
          {questionType === "Subjective" && (
            <Card title="Model Answer">
              <textarea
                placeholder="Enter the expected answer or marking scheme..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: 14,
                  color: "#111827",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  outline: "none",
                  fontFamily: "inherit",
                  resize: "vertical",
                  marginTop: 16,
                }}
              />
            </Card>
          )}

          {/* Explanation */}
          <Card title="Explanation (Optional)">
            <textarea
              placeholder="Provide detailed explanation or solution steps..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: 14,
                color: "#111827",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                outline: "none",
                fontFamily: "inherit",
                resize: "vertical",
                marginTop: 16,
              }}
            />
          </Card>
        </div>

        {/* Right Sidebar */}
        <div style={{ width: 320, flexShrink: 0 }}>
          {/* Metadata */}
          <Card title="Metadata">
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: 14,
                    color: "#111827",
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option>Linear Equations</option>
                  <option>Quadratic Equations</option>
                  <option>Polynomials</option>
                  <option>Trigonometry</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>
                  Difficulty
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <DifficultyButton
                      key={level}
                      label={level}
                      active={difficulty === level}
                      onClick={() => setDifficulty(level)}
                    />
                  ))}
                </div>
              </div>

              <InputField
                label="Marks"
                type="number"
                placeholder="Marks"
                value={marks.toString()}
                onChange={(v) => setMarks(parseInt(v) || 1)}
              />
            </div>
          </Card>

          {/* Live Preview */}
          {showPreview && (
            <Card title="Live Preview">
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 12,
                  minHeight: 200,
                }}
              >
                <p style={{ fontSize: 14, color: "#111827", lineHeight: 1.6, margin: 0 }}>
                  {questionText || "Your question will appear here..."}
                </p>
                {(questionType === "MCQ Single" || questionType === "MCQ Multiple") && (
                  <div style={{ marginTop: 12 }}>
                    {options.map((option, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: correctAnswer.includes(idx) ? "#D1FAE5" : "#FFFFFF",
                          borderRadius: 8,
                          marginBottom: 8,
                          fontSize: 13,
                          color: "#111827",
                        }}
                      >
                        {String.fromCharCode(65 + idx)}. {option || "(Empty option)"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
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
            backgroundColor: "#F3F4F6",
            color: "#374151",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save as Draft
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          style={{
            flex: 2,
            padding: "14px 20px",
            backgroundColor: "#10B981",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save to Question Bank
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
        padding: 20,
        marginBottom: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 0 }}>
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

function TypeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        padding: "10px 14px",
        backgroundColor: active ? "#5B47FB" : "#F3F4F6",
        color: active ? "#FFFFFF" : "#6B7280",
        border: active ? "2px solid #5B47FB" : "1px solid #E5E7EB",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      {label}
    </motion.button>
  )
}

function EditorToolbar() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 12px", backgroundColor: "#F9FAFB", borderRadius: 8 }}>
      {["B", "I", "U", "•", "1.", "🔗"].map((icon) => (
        <motion.button
          key={icon}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 32,
            height: 32,
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: icon === "B" ? 700 : 400,
            fontStyle: icon === "I" ? "italic" : "normal",
            textDecoration: icon === "U" ? "underline" : "none",
            cursor: "pointer",
            color: "#374151",
          }}
        >
          {icon}
        </motion.button>
      ))}
    </div>
  )
}

function ToolButton({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: "8px 12px",
        backgroundColor: "#F3F4F6",
        border: "none",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        color: "#6B7280",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.button>
  )
}

function OptionRow({
  index,
  value,
  isCorrect,
  isSingleSelect,
  onChange,
  onToggleCorrect,
  onRemove,
}: {
  index: number
  value: string
  isCorrect: boolean
  isSingleSelect: boolean
  onChange: (value: string) => void
  onToggleCorrect: () => void
  onRemove: () => void
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggleCorrect}
        style={{
          width: 24,
          height: 24,
          borderRadius: isSingleSelect ? "50%" : 6,
          backgroundColor: isCorrect ? "#10B981" : "#E5E7EB",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {isCorrect && "✓"}
      </motion.button>
      <div
        style={{
          flex: 1,
          padding: "10px 12px",
          backgroundColor: "#F9FAFB",
          borderRadius: 8,
          fontSize: 13,
          color: "#6B7280",
          fontWeight: 600,
        }}
      >
        {String.fromCharCode(65 + index)}
      </div>
      <input
        type="text"
        placeholder={`Option ${String.fromCharCode(65 + index)}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 4,
          padding: "10px 12px",
          fontSize: 14,
          color: "#111827",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          outline: "none",
        }}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        style={{
          width: 32,
          height: 32,
          backgroundColor: "#FEE2E2",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          color: "#EF4444",
          fontSize: 16,
        }}
      >
        ×
      </motion.button>
    </div>
  )
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label?: string
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          color: "#111827",
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          outline: "none",
        }}
      />
    </div>
  )
}

function DifficultyButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const colors: Record<string, string> = {
    Easy: "#10B981",
    Medium: "#F59E0B",
    Hard: "#EF4444",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        flex: 1,
        padding: "8px 12px",
        backgroundColor: active ? colors[label] : "#F3F4F6",
        color: active ? "#FFFFFF" : "#6B7280",
        border: "none",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </motion.button>
  )
}

addPropertyControls(CreateQuestion, {})
