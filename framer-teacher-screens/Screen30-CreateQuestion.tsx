import * as React from "react"
import { motion } from "framer-motion"

/**
 * Screen 30: Create Question (Full Question Builder)
 *
 * Advanced question creation interface supporting:
 * - Multiple question types (MCQ, Numerical, Subjective, etc.)
 * - Rich text editor with LaTeX support
 * - Image upload
 * - Topic mapping and metadata
 * - Live preview
 * - AI assistance
 *
 * @component
 */

type QuestionType = "MCQ-Single" | "MCQ-Multiple" | "Numerical" | "Subjective" | "Assertion-Reason" | "Match"

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

export interface CreateQuestionProps {
  initialData?: {
    type?: QuestionType
    stem?: string
    options?: Option[]
    correctAnswer?: string
    explanation?: string
    topic?: string
    difficulty?: "Easy" | "Medium" | "Hard"
    marks?: number
  }
  onSave?: (questionData: any) => void
  onCancel?: () => void
  onPreview?: () => void
}

export default function CreateQuestion({
  initialData,
  onSave,
  onCancel,
  onPreview,
}: CreateQuestionProps) {
  const [questionType, setQuestionType] = React.useState<QuestionType>(initialData?.type || "MCQ-Single")
  const [stem, setStem] = React.useState(initialData?.stem || "")
  const [options, setOptions] = React.useState<Option[]>(initialData?.options || [
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
    { id: "3", text: "", isCorrect: false },
    { id: "4", text: "", isCorrect: false },
  ])
  const [explanation, setExplanation] = React.useState(initialData?.explanation || "")
  const [topic, setTopic] = React.useState(initialData?.topic || "")
  const [difficulty, setDifficulty] = React.useState<"Easy" | "Medium" | "Hard">(initialData?.difficulty || "Medium")
  const [marks, setMarks] = React.useState(initialData?.marks || 2)
  const [showPreview, setShowPreview] = React.useState(false)

  const questionTypes: QuestionType[] = ["MCQ-Single", "MCQ-Multiple", "Numerical", "Subjective", "Assertion-Reason", "Match"]

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt))
  }

  const toggleCorrectAnswer = (id: string) => {
    if (questionType === "MCQ-Single") {
      setOptions(options.map(opt => ({ ...opt, isCorrect: opt.id === id })))
    } else {
      setOptions(options.map(opt => opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt))
    }
  }

  const addOption = () => {
    setOptions([...options, { id: String(options.length + 1), text: "", isCorrect: false }])
  }

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id))
    }
  }

  const handleSave = () => {
    const questionData = {
      type: questionType,
      stem,
      options: questionType.startsWith("MCQ") ? options : undefined,
      explanation,
      topic,
      difficulty,
      marks,
    }
    onSave?.(questionData)
  }

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 style={styles.title}>Create Question</h1>
        <div style={styles.headerActions}>
          <button style={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.previewButton} onClick={() => setShowPreview(!showPreview)}>
            👁️ Preview
          </button>
          <button style={styles.saveButton} onClick={handleSave}>
            💾 Save to Bank
          </button>
        </div>
      </motion.div>

      <div style={styles.content}>
        {/* Left Column - Builder */}
        <div style={styles.leftColumn}>
          {/* Question Type Selector */}
          <motion.div
            style={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h3 style={styles.sectionTitle}>Question Type</h3>
            <div style={styles.typeSelector}>
              {questionTypes.map((type) => (
                <motion.button
                  key={type}
                  style={{
                    ...styles.typeButton,
                    ...(questionType === type ? styles.typeButtonActive : {}),
                  }}
                  onClick={() => setQuestionType(type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Question Text */}
          <motion.div
            style={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 style={styles.sectionTitle}>Question Text</h3>
            <div style={styles.editorToolbar}>
              <button style={styles.toolButton} title="Bold">𝐁</button>
              <button style={styles.toolButton} title="Italic">𝐼</button>
              <button style={styles.toolButton} title="Math">∑</button>
              <button style={styles.toolButton} title="Image">🖼️</button>
            </div>
            <textarea
              style={styles.textArea}
              placeholder="Enter your question here..."
              value={stem}
              onChange={(e) => setStem(e.target.value)}
              rows={6}
              aria-label="Question text"
            />
          </motion.div>

          {/* Options (for MCQ) */}
          {questionType.startsWith("MCQ") && (
            <motion.div
              style={styles.section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <h3 style={styles.sectionTitle}>
                Options {questionType === "MCQ-Multiple" && "(Multiple correct answers allowed)"}
              </h3>
              {options.map((option, index) => (
                <div key={option.id} style={styles.optionRow}>
                  <input
                    type={questionType === "MCQ-Single" ? "radio" : "checkbox"}
                    checked={option.isCorrect}
                    onChange={() => toggleCorrectAnswer(option.id)}
                    style={styles.optionCheckbox}
                    name="correct-answer"
                    aria-label={`Mark option ${index + 1} as correct`}
                  />
                  <span style={styles.optionLabel}>{String.fromCharCode(65 + index)}.</span>
                  <input
                    type="text"
                    style={styles.optionInput}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    aria-label={`Option ${index + 1} text`}
                  />
                  {options.length > 2 && (
                    <button
                      style={styles.removeButton}
                      onClick={() => removeOption(option.id)}
                      aria-label={`Remove option ${index + 1}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button style={styles.addOptionButton} onClick={addOption}>
                ➕ Add Option
              </button>
            </motion.div>
          )}

          {/* Explanation */}
          <motion.div
            style={styles.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <h3 style={styles.sectionTitle}>Explanation (Optional)</h3>
            <textarea
              style={styles.textArea}
              placeholder="Provide step-by-step explanation..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={4}
              aria-label="Question explanation"
            />
          </motion.div>
        </div>

        {/* Right Column - Metadata & Preview */}
        <div style={styles.rightColumn}>
          {/* Metadata */}
          <motion.div
            style={styles.section}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 style={styles.sectionTitle}>Metadata</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Topic</label>
              <select
                style={styles.select}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                aria-label="Select topic"
              >
                <option value="">Select topic...</option>
                <option value="Algebra">Algebra</option>
                <option value="Geometry">Geometry</option>
                <option value="Trigonometry">Trigonometry</option>
                <option value="Calculus">Calculus</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Difficulty</label>
              <div style={styles.difficultyButtons}>
                {(["Easy", "Medium", "Hard"] as const).map((level) => (
                  <button
                    key={level}
                    style={{
                      ...styles.difficultyButton,
                      ...(difficulty === level ? styles.difficultyButtonActive : {}),
                      ...(level === "Easy" ? { color: "#10B981", borderColor: "#10B981" } : {}),
                      ...(level === "Medium" ? { color: "#F59E0B", borderColor: "#F59E0B" } : {}),
                      ...(level === "Hard" ? { color: "#EF4444", borderColor: "#EF4444" } : {}),
                    }}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Marks</label>
              <input
                type="number"
                style={styles.input}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                min={1}
                max={10}
                aria-label="Question marks"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tags (Optional)</label>
              <input
                type="text"
                style={styles.input}
                placeholder="e.g., JEE 2021, NEET"
                aria-label="Question tags"
              />
            </div>
          </motion.div>

          {/* Live Preview */}
          {showPreview && (
            <motion.div
              style={styles.previewCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <h3 style={styles.sectionTitle}>Live Preview</h3>
              <div style={styles.previewContent}>
                {stem && (
                  <div style={styles.previewQuestion}>{stem}</div>
                )}
                {questionType.startsWith("MCQ") && options.some(o => o.text) && (
                  <div style={styles.previewOptions}>
                    {options.filter(o => o.text).map((option, index) => (
                      <div
                        key={option.id}
                        style={{
                          ...styles.previewOption,
                          ...(option.isCorrect ? styles.previewOptionCorrect : {}),
                        }}
                      >
                        <span style={styles.previewOptionLabel}>
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option.text}
                        {option.isCorrect && <span style={styles.correctBadge}>✓ Correct</span>}
                      </div>
                    ))}
                  </div>
                )}
                <div style={styles.previewMeta}>
                  {topic && <span style={styles.metaBadge}>{topic}</span>}
                  <span style={{
                    ...styles.metaBadge,
                    backgroundColor:
                      difficulty === "Easy" ? "#DCFCE7" :
                      difficulty === "Medium" ? "#FEF3C7" : "#FEE2E2",
                    color:
                      difficulty === "Easy" ? "#166534" :
                      difficulty === "Medium" ? "#92400E" : "#991B1B",
                  }}>
                    {difficulty}
                  </span>
                  <span style={styles.metaBadge}>{marks} marks</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Suggestions */}
          <motion.div
            style={styles.aiPanel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <h3 style={styles.sectionTitle}>🤖 AI Assistance</h3>
            <div style={styles.aiButtons}>
              <button style={styles.aiButton}>Generate Similar</button>
              <button style={styles.aiButton}>Improve Question</button>
              <button style={styles.aiButton}>Add Distractors</button>
              <button style={styles.aiButton}>Fix Grammar</button>
            </div>
          </motion.div>
        </div>
      </div>
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
  cancelButton: {
    padding: "12px 20px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6B7280",
    cursor: "pointer",
  },
  previewButton: {
    padding: "12px 20px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
  },
  saveButton: {
    padding: "12px 20px",
    backgroundColor: "#5B47FB",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 16px 0",
  },
  typeSelector: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  typeButton: {
    padding: "8px 16px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6B7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  typeButtonActive: {
    backgroundColor: "#5B47FB",
    color: "#FFFFFF",
    border: "1px solid #5B47FB",
  },
  editorToolbar: {
    display: "flex",
    gap: "4px",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #E5E7EB",
  },
  toolButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  textArea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "16px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  },
  optionRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  optionCheckbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  optionLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#5B47FB",
    minWidth: "24px",
  },
  optionInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  removeButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    border: "none",
    borderRadius: "6px",
    color: "#991B1B",
    cursor: "pointer",
    fontSize: "16px",
  },
  addOptionButton: {
    padding: "10px",
    backgroundColor: "#F9FAFB",
    border: "1px dashed #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6B7280",
    cursor: "pointer",
    width: "100%",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#FFFFFF",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  difficultyButtons: {
    display: "flex",
    gap: "8px",
  },
  difficultyButton: {
    flex: 1,
    padding: "8px",
    backgroundColor: "#FFFFFF",
    border: "2px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  difficultyButtonActive: {
    backgroundColor: "currentColor",
    color: "#FFFFFF !important" as any,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  previewContent: {
    padding: "16px",
    backgroundColor: "#F9FAFB",
    borderRadius: "12px",
  },
  previewQuestion: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "16px",
    lineHeight: "1.6",
  },
  previewOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  previewOption: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#374151",
  },
  previewOptionCorrect: {
    backgroundColor: "#DCFCE7",
    border: "2px solid #10B981",
  },
  previewOptionLabel: {
    fontWeight: "600",
    color: "#5B47FB",
    minWidth: "20px",
  },
  correctBadge: {
    marginLeft: "auto",
    fontSize: "12px",
    fontWeight: "600",
    color: "#10B981",
  },
  previewMeta: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  metaBadge: {
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 12px",
    backgroundColor: "#E0E7FF",
    color: "#5B47FB",
    borderRadius: "12px",
  },
  aiPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  aiButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  aiButton: {
    padding: "10px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6B7280",
    cursor: "pointer",
  },
}

CreateQuestion.displayName = "CreateQuestion"
