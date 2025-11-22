import * as React from "react"
import { motion } from "framer-motion"

/**
 * Screen 31: Homework/Practice Set Builder
 *
 * Step-by-step homework creation interface with:
 * - Auto-generate or manual question selection
 * - Difficulty distribution control
 * - Practice rules configuration
 * - Assignment scheduling
 * - Target audience selection
 *
 * @component
 */

type Step = "details" | "questions" | "rules" | "schedule" | "review"

interface PracticeSet {
  title: string
  description: string
  subject: string
  topics: string[]
  difficultyDistribution: { easy: number; medium: number; hard: number }
  questionCount: number
  attemptLimit: number | "unlimited"
  timeLimit: number | null
  showExplanations: "immediate" | "after-completion" | "never"
  dueDate: string | null
  assignTo: "all" | "groups" | "students"
}

export interface HomeworkBuilderProps {
  initialData?: Partial<PracticeSet>
  availableTopics?: string[]
  availableGroups?: string[]
  onSave?: (homeworkData: PracticeSet) => void
  onCancel?: () => void
}

const defaultTopics = ["Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics"]
const defaultGroups = ["Group A", "Group B", "Advanced", "Remedial"]

export default function HomeworkBuilder({
  initialData,
  availableTopics = defaultTopics,
  availableGroups = defaultGroups,
  onSave,
  onCancel,
}: HomeworkBuilderProps) {
  const [currentStep, setCurrentStep] = React.useState<Step>("details")
  const [title, setTitle] = React.useState(initialData?.title || "")
  const [description, setDescription] = React.useState(initialData?.description || "")
  const [subject, setSubject] = React.useState(initialData?.subject || "Mathematics")
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>(initialData?.topics || [])
  const [difficulty, setDifficulty] = React.useState({ easy: 40, medium: 40, hard: 20 })
  const [questionCount, setQuestionCount] = React.useState(initialData?.questionCount || 10)
  const [attemptLimit, setAttemptLimit] = React.useState<number | "unlimited">(initialData?.attemptLimit || 1)
  const [timeLimit, setTimeLimit] = React.useState<number | null>(initialData?.timeLimit || null)
  const [showExplanations, setShowExplanations] = React.useState<"immediate" | "after-completion" | "never">(
    initialData?.showExplanations || "after-completion"
  )
  const [assignTo, setAssignTo] = React.useState<"all" | "groups" | "students">(initialData?.assignTo || "all")

  const steps: { key: Step; label: string; icon: string }[] = [
    { key: "details", label: "Basic Details", icon: "📝" },
    { key: "questions", label: "Questions", icon: "❓" },
    { key: "rules", label: "Practice Rules", icon: "⚙️" },
    { key: "schedule", label: "Schedule", icon: "📅" },
    { key: "review", label: "Review", icon: "✅" },
  ]

  const stepIndex = steps.findIndex(s => s.key === currentStep)

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  const handleNext = () => {
    const nextIndex = stepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key)
    }
  }

  const handleBack = () => {
    const prevIndex = stepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key)
    }
  }

  const handleSave = () => {
    const homeworkData: PracticeSet = {
      title,
      description,
      subject,
      topics: selectedTopics,
      difficultyDistribution: difficulty,
      questionCount,
      attemptLimit,
      timeLimit,
      showExplanations,
      dueDate: null,
      assignTo,
    }
    onSave?.(homeworkData)
  }

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 style={styles.title}>Create Homework / Practice Set</h1>
        <button style={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        style={styles.progressBar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {steps.map((step, index) => (
          <div
            key={step.key}
            style={{
              ...styles.step,
              ...(index <= stepIndex ? styles.stepActive : {}),
              ...(index === stepIndex ? styles.stepCurrent : {}),
            }}
            onClick={() => setCurrentStep(step.key)}
          >
            <div style={styles.stepIcon}>{step.icon}</div>
            <div style={styles.stepLabel}>{step.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        style={styles.content}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* STEP 1: Basic Details */}
        {currentStep === "details" && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Basic Details</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Practice Set Title *</label>
              <input
                type="text"
                style={styles.input}
                placeholder="e.g., Linear Equations Practice - Level 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Practice set title"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description (Optional)</label>
              <textarea
                style={styles.textArea}
                placeholder="What students should expect..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                aria-label="Practice set description"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Subject *</label>
              <select
                style={styles.select}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                aria-label="Select subject"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Topics *</label>
              <div style={styles.topicChips}>
                {availableTopics.map((topic) => (
                  <motion.button
                    key={topic}
                    style={{
                      ...styles.topicChip,
                      ...(selectedTopics.includes(topic) ? styles.topicChipSelected : {}),
                    }}
                    onClick={() => toggleTopic(topic)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Question Selection */}
        {currentStep === "questions" && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Question Selection</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Questions</label>
              <div style={styles.questionCountButtons}>
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    style={{
                      ...styles.countButton,
                      ...(questionCount === count ? styles.countButtonActive : {}),
                    }}
                    onClick={() => setQuestionCount(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Difficulty Distribution</label>
              <div style={styles.sliderGroup}>
                <div style={styles.sliderRow}>
                  <span style={{...styles.sliderLabel, color: "#10B981"}}>Easy: {difficulty.easy}%</span>
                  <input
                    type="range"
                    style={styles.slider}
                    min="0"
                    max="100"
                    value={difficulty.easy}
                    onChange={(e) => setDifficulty({ ...difficulty, easy: Number(e.target.value) })}
                    aria-label="Easy difficulty percentage"
                  />
                </div>
                <div style={styles.sliderRow}>
                  <span style={{...styles.sliderLabel, color: "#F59E0B"}}>Medium: {difficulty.medium}%</span>
                  <input
                    type="range"
                    style={styles.slider}
                    min="0"
                    max="100"
                    value={difficulty.medium}
                    onChange={(e) => setDifficulty({ ...difficulty, medium: Number(e.target.value) })}
                    aria-label="Medium difficulty percentage"
                  />
                </div>
                <div style={styles.sliderRow}>
                  <span style={{...styles.sliderLabel, color: "#EF4444"}}>Hard: {difficulty.hard}%</span>
                  <input
                    type="range"
                    style={styles.slider}
                    min="0"
                    max="100"
                    value={difficulty.hard}
                    onChange={(e) => setDifficulty({ ...difficulty, hard: Number(e.target.value) })}
                    aria-label="Hard difficulty percentage"
                  />
                </div>
              </div>
            </div>
            <div style={styles.autoGenerateCard}>
              <h3 style={styles.cardTitle}>🤖 Auto-Generate Questions</h3>
              <p style={styles.cardText}>
                AI will select {questionCount} questions based on your topic and difficulty preferences.
              </p>
              <button style={styles.generateButton}>Generate Questions</button>
            </div>
          </div>
        )}

        {/* STEP 3: Practice Rules */}
        {currentStep === "rules" && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Practice Rules</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Attempts Allowed</label>
              <div style={styles.attemptButtons}>
                {[1, 2, 3, "unlimited"].map((attempt) => (
                  <button
                    key={attempt}
                    style={{
                      ...styles.attemptButton,
                      ...(attemptLimit === attempt ? styles.attemptButtonActive : {}),
                    }}
                    onClick={() => setAttemptLimit(attempt as any)}
                  >
                    {attempt === "unlimited" ? "Unlimited" : `${attempt} attempt${attempt > 1 ? "s" : ""}`}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Time Limit</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="timeLimit"
                    checked={timeLimit === null}
                    onChange={() => setTimeLimit(null)}
                  />
                  No time limit
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="timeLimit"
                    checked={timeLimit !== null}
                    onChange={() => setTimeLimit(15)}
                  />
                  Set time limit:
                  {timeLimit !== null && (
                    <input
                      type="number"
                      style={styles.inlineInput}
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      min={5}
                      max={180}
                    />
                  )}
                  minutes
                </label>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Show Explanations</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="explanations"
                    checked={showExplanations === "immediate"}
                    onChange={() => setShowExplanations("immediate")}
                  />
                  After each question
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="explanations"
                    checked={showExplanations === "after-completion"}
                    onChange={() => setShowExplanations("after-completion")}
                  />
                  After completion
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="explanations"
                    checked={showExplanations === "never"}
                    onChange={() => setShowExplanations("never")}
                  />
                  Don't show
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Schedule */}
        {currentStep === "schedule" && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Assignment Schedule</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Assign To</label>
              <div style={styles.assignButtons}>
                {["all", "groups", "students"].map((option) => (
                  <button
                    key={option}
                    style={{
                      ...styles.assignButton,
                      ...(assignTo === option ? styles.assignButtonActive : {}),
                    }}
                    onClick={() => setAssignTo(option as any)}
                  >
                    {option === "all" ? "Whole Class" : option === "groups" ? "Groups" : "Select Students"}
                  </button>
                ))}
              </div>
            </div>
            {assignTo === "groups" && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Groups</label>
                <div style={styles.groupChips}>
                  {availableGroups.map((group) => (
                    <button key={group} style={styles.groupChip}>
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={styles.formGroup}>
              <label style={styles.label}>Due Date (Optional)</label>
              <input
                type="datetime-local"
                style={styles.input}
                aria-label="Due date"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Review */}
        {currentStep === "review" && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Review & Publish</h2>
            <div style={styles.reviewCard}>
              <div style={styles.reviewRow}>
                <strong>Title:</strong> {title || "Untitled"}
              </div>
              <div style={styles.reviewRow}>
                <strong>Subject:</strong> {subject}
              </div>
              <div style={styles.reviewRow}>
                <strong>Topics:</strong> {selectedTopics.join(", ") || "None selected"}
              </div>
              <div style={styles.reviewRow}>
                <strong>Questions:</strong> {questionCount}
              </div>
              <div style={styles.reviewRow}>
                <strong>Difficulty:</strong> Easy {difficulty.easy}%, Medium {difficulty.medium}%, Hard {difficulty.hard}%
              </div>
              <div style={styles.reviewRow}>
                <strong>Attempts:</strong> {attemptLimit === "unlimited" ? "Unlimited" : attemptLimit}
              </div>
              <div style={styles.reviewRow}>
                <strong>Time Limit:</strong> {timeLimit ? `${timeLimit} minutes` : "No limit"}
              </div>
              <div style={styles.reviewRow}>
                <strong>Assign To:</strong> {assignTo === "all" ? "Whole Class" : assignTo === "groups" ? "Selected Groups" : "Selected Students"}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation Footer */}
      <motion.div
        style={styles.footer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <button
          style={styles.backButton}
          onClick={handleBack}
          disabled={stepIndex === 0}
        >
          ← Back
        </button>
        <div style={styles.footerRight}>
          <button style={styles.draftButton}>Save as Draft</button>
          {stepIndex < steps.length - 1 ? (
            <button style={styles.nextButton} onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button style={styles.publishButton} onClick={handleSave}>
              Assign Now
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "1000px",
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
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6B7280",
    cursor: "pointer",
  },
  progressBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "32px",
    position: "relative",
  },
  step: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    opacity: 0.4,
    transition: "opacity 0.3s",
  },
  stepActive: {
    opacity: 1,
  },
  stepCurrent: {
    opacity: 1,
  },
  stepIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  stepLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    minHeight: "500px",
  },
  stepContent: {
    maxWidth: "700px",
  },
  stepTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "24px",
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  textArea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#FFFFFF",
  },
  topicChips: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  topicChip: {
    padding: "8px 16px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#6B7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  topicChipSelected: {
    backgroundColor: "#5B47FB",
    color: "#FFFFFF",
    border: "1px solid #5B47FB",
  },
  questionCountButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  countButton: {
    padding: "12px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  countButtonActive: {
    backgroundColor: "#5B47FB",
    color: "#FFFFFF",
    border: "1px solid #5B47FB",
  },
  sliderGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  sliderLabel: {
    fontSize: "14px",
    fontWeight: "600",
    minWidth: "120px",
  },
  slider: {
    flex: 1,
    height: "8px",
    borderRadius: "4px",
    outline: "none",
    appearance: "none",
    background: "#E5E7EB",
  },
  autoGenerateCard: {
    padding: "20px",
    backgroundColor: "#EFF6FF",
    borderRadius: "12px",
    border: "1px solid #BFDBFE",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1E3A8A",
    margin: "0 0 8px 0",
  },
  cardText: {
    fontSize: "14px",
    color: "#1E40AF",
    marginBottom: "16px",
  },
  generateButton: {
    padding: "10px 20px",
    backgroundColor: "#5B47FB",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  attemptButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  attemptButton: {
    padding: "12px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  attemptButtonActive: {
    backgroundColor: "#5B47FB",
    color: "#FFFFFF",
    border: "1px solid #5B47FB",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#374151",
  },
  inlineInput: {
    width: "80px",
    padding: "4px 8px",
    border: "1px solid #E5E7EB",
    borderRadius: "4px",
    fontSize: "14px",
    margin: "0 8px",
  },
  assignButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  assignButton: {
    padding: "12px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  assignButtonActive: {
    backgroundColor: "#5B47FB",
    color: "#FFFFFF",
    border: "1px solid #5B47FB",
  },
  groupChips: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  groupChip: {
    padding: "8px 16px",
    backgroundColor: "#DCFCE7",
    border: "1px solid #10B981",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#166534",
    cursor: "pointer",
  },
  reviewCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: "12px",
    padding: "20px",
  },
  reviewRow: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "12px",
    display: "flex",
    gap: "8px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  backButton: {
    padding: "12px 24px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
  },
  footerRight: {
    display: "flex",
    gap: "12px",
  },
  draftButton: {
    padding: "12px 24px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6B7280",
    cursor: "pointer",
  },
  nextButton: {
    padding: "12px 24px",
    backgroundColor: "#5B47FB",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  publishButton: {
    padding: "12px 24px",
    backgroundColor: "#10B981",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFFFFF",
    cursor: "pointer",
  },
}

HomeworkBuilder.displayName = "HomeworkBuilder"
