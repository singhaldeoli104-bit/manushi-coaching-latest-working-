/**
 * SCREEN 25: CREATE TEST / EXAM (Teacher View)
 *
 * Multi-step wizard for creating tests/exams:
 * - Step 1: Basic Information (title, type, subject, syllabus)
 * - Step 2: Pattern & Questions (sections, question types, marks)
 * - Step 3: Schedule & Delivery (date, time, mode, assign to)
 * - Step 4: Security & Rules (anti-cheat, proctoring, negative marking)
 * - Step 5: Result Settings (visibility, ranking, analytics)
 * - Step 6: Review & Publish
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
 * - Typography: Inter (700/600/regular)
 * - Mobile: 390×844px
 */

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface CreateTestProps {
  className?: string
  onSaveDraft?: () => void
  onPublish?: () => void
}

type TestType = "Chapter Test" | "Unit Test" | "Term Exam" | "Mock Test" | "Practice Test"
type QuestionType = "MCQ" | "Numerical" | "Subjective" | "Match" | "Assertion-Reason"

export function CreateTest(props: CreateTestProps) {
  const { className = "", onSaveDraft, onPublish } = props

  const [currentStep, setCurrentStep] = React.useState(1)
  const [testData, setTestData] = React.useState({
    name: "",
    type: "Chapter Test" as TestType,
    subject: "Mathematics",
    topics: [] as string[],
    description: "",
    sections: [] as any[],
    date: "",
    startTime: "",
    duration: 90,
    mode: "Online",
    assignedTo: "Entire Class",
    negativeMark: false,
    shuffle: true,
    proctoring: false,
    showResults: "After Submit",
  })

  const totalSteps = 6

  const updateData = (key: string, value: any) => {
    setTestData((prev) => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
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
      {/* Header with Stepper */}
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
            onClick={prevStep}
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
              Create Test
            </h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSaveDraft}
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
            Save Draft
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: 4,
            backgroundColor: "#E5E7EB",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: "100%",
              backgroundColor: "#5B47FB",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Step Indicators */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {[
            "Basic Info",
            "Questions",
            "Schedule",
            "Security",
            "Results",
            "Review",
          ].map((label, idx) => (
            <StepIndicator
              key={idx}
              label={label}
              number={idx + 1}
              active={currentStep === idx + 1}
              completed={currentStep > idx + 1}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div style={{ padding: "24px 20px" }}>
        <AnimatePresence mode="wait">
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <StepCard title="Basic Information">
                <InputField
                  label="Test Name"
                  placeholder="e.g., Algebra Unit Test – Linear & Quadratic Equations"
                  value={testData.name}
                  onChange={(v) => updateData("name", v)}
                  required
                />

                <SelectField
                  label="Test Type"
                  value={testData.type}
                  options={[
                    "Chapter Test",
                    "Unit Test",
                    "Term Exam",
                    "Mock Test",
                    "Practice Test",
                  ]}
                  onChange={(v) => updateData("type", v)}
                />

                <SelectField
                  label="Subject"
                  value={testData.subject}
                  options={[
                    "Mathematics",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "English",
                  ]}
                  onChange={(v) => updateData("subject", v)}
                />

                <div style={{ marginTop: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Syllabus / Topics Covered
                  </label>
                  <TopicSelector
                    selected={testData.topics}
                    onChange={(v) => updateData("topics", v)}
                  />
                </div>

                <TextArea
                  label="Description / Instructions (Optional)"
                  placeholder="Provide any additional instructions or information..."
                  value={testData.description}
                  onChange={(v) => updateData("description", v)}
                  rows={4}
                />
              </StepCard>
            </motion.div>
          )}

          {/* STEP 2: Pattern & Questions */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <StepCard title="Test Pattern & Questions">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>
                    Sections ({testData.sections.length})
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newSection = {
                        id: Date.now(),
                        name: `Section ${testData.sections.length + 1}`,
                        type: "MCQ",
                        count: 10,
                        marks: 1,
                        negativeMarks: 0,
                      }
                      updateData("sections", [...testData.sections, newSection])
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#5B47FB",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    + Add Section
                  </motion.button>
                </div>

                {testData.sections.length === 0 ? (
                  <EmptyState
                    icon="📝"
                    title="No sections added yet"
                    description="Add sections to structure your test (e.g., MCQ, Subjective, Numerical)"
                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {testData.sections.map((section) => (
                      <SectionCard key={section.id} section={section} />
                    ))}
                  </div>
                )}

                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    backgroundColor: "#F0F9FF",
                    borderRadius: 12,
                    borderLeft: "4px solid #3B82F6",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                    Total Questions: {testData.sections.reduce((sum, s) => sum + s.count, 0)}
                  </div>
                  <div style={{ fontSize: 14, color: "#6B7280" }}>
                    Total Marks:{" "}
                    {testData.sections.reduce((sum, s) => sum + s.count * s.marks, 0)}
                  </div>
                </div>
              </StepCard>
            </motion.div>
          )}

          {/* STEP 3: Schedule & Delivery */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <StepCard title="Schedule & Delivery">
                <InputField
                  label="Test Date"
                  type="date"
                  value={testData.date}
                  onChange={(v) => updateData("date", v)}
                  required
                />

                <InputField
                  label="Start Time"
                  type="time"
                  value={testData.startTime}
                  onChange={(v) => updateData("startTime", v)}
                  required
                />

                <InputField
                  label="Duration (minutes)"
                  type="number"
                  value={testData.duration.toString()}
                  onChange={(v) => updateData("duration", parseInt(v))}
                  required
                />

                <div style={{ marginTop: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Test Mode
                  </label>
                  <div style={{ display: "flex", gap: 12 }}>
                    {["Online", "Offline", "Hybrid"].map((mode) => (
                      <RadioButton
                        key={mode}
                        label={mode}
                        selected={testData.mode === mode}
                        onClick={() => updateData("mode", mode)}
                      />
                    ))}
                  </div>
                </div>

                <SelectField
                  label="Assign To"
                  value={testData.assignedTo}
                  options={[
                    "Entire Class",
                    "Specific Groups",
                    "Specific Students",
                  ]}
                  onChange={(v) => updateData("assignedTo", v)}
                />
              </StepCard>
            </motion.div>
          )}

          {/* STEP 4: Security & Rules */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <StepCard title="Security & Rules">
                <ToggleOption
                  label="Negative Marking"
                  description="Deduct marks for incorrect answers"
                  checked={testData.negativeMark}
                  onChange={(v) => updateData("negativeMark", v)}
                />

                <ToggleOption
                  label="Shuffle Questions"
                  description="Randomize question order for each student"
                  checked={testData.shuffle}
                  onChange={(v) => updateData("shuffle", v)}
                />

                <ToggleOption
                  label="Enable Proctoring"
                  description="Monitor students via camera and tab-switching detection"
                  checked={testData.proctoring}
                  onChange={(v) => updateData("proctoring", v)}
                />

                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    backgroundColor: "#FEF3C7",
                    borderRadius: 12,
                    borderLeft: "4px solid #F59E0B",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
                    ⚠️ <strong>Anti-Cheat Features:</strong> Tab switching detection, screenshot
                    prevention, and copy-paste blocking are enabled by default for online tests.
                  </div>
                </div>
              </StepCard>
            </motion.div>
          )}

          {/* STEP 5: Result Settings */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <StepCard title="Result & Analytics Settings">
                <div style={{ marginTop: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    When to show results?
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      "Immediately After Submit",
                      "After All Students Complete",
                      "Manual Release by Teacher",
                      "Scheduled Date/Time",
                    ].map((option) => (
                      <RadioButton
                        key={option}
                        label={option}
                        selected={testData.showResults === option}
                        onClick={() => updateData("showResults", option)}
                      />
                    ))}
                  </div>
                </div>

                <ToggleOption
                  label="Show Correct Answers"
                  description="Display correct answers after test completion"
                  checked={true}
                  onChange={() => {}}
                />

                <ToggleOption
                  label="Show Rank List"
                  description="Display student rankings to all students"
                  checked={true}
                  onChange={() => {}}
                />

                <ToggleOption
                  label="Generate Analytics Report"
                  description="Create detailed performance analytics for teacher"
                  checked={true}
                  onChange={() => {}}
                />
              </StepCard>
            </motion.div>
          )}

          {/* STEP 6: Review & Publish */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <StepCard title="Review & Publish">
                <ReviewItem label="Test Name" value={testData.name || "Not set"} />
                <ReviewItem label="Type" value={testData.type} />
                <ReviewItem label="Subject" value={testData.subject} />
                <ReviewItem
                  label="Topics"
                  value={testData.topics.join(", ") || "Not selected"}
                />
                <ReviewItem label="Date" value={testData.date || "Not set"} />
                <ReviewItem label="Duration" value={`${testData.duration} minutes`} />
                <ReviewItem label="Mode" value={testData.mode} />
                <ReviewItem
                  label="Sections"
                  value={`${testData.sections.length} section(s)`}
                />
                <ReviewItem
                  label="Total Questions"
                  value={testData.sections.reduce((sum, s) => sum + s.count, 0).toString()}
                />
                <ReviewItem
                  label="Total Marks"
                  value={testData.sections
                    .reduce((sum, s) => sum + s.count * s.marks, 0)
                    .toString()}
                />

                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    backgroundColor: "#F0FDF4",
                    borderRadius: 12,
                    borderLeft: "4px solid #10B981",
                  }}
                >
                  <div style={{ fontSize: 14, color: "#065F46", lineHeight: 1.5 }}>
                    ✓ Your test is ready to publish. Students will be notified once you publish.
                  </div>
                </div>
              </StepCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
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
        {currentStep > 1 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevStep}
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
            Previous
          </motion.button>
        )}
        {currentStep < totalSteps ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            style={{
              flex: 2,
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
            Next Step
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPublish}
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
            Publish Test
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}

// Helper Components
function StepIndicator({
  label,
  number,
  active,
  completed,
}: {
  label: string
  number: number
  active: boolean
  completed: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        backgroundColor: active ? "#EEF2FF" : completed ? "#F0FDF4" : "#F9FAFB",
        borderRadius: 8,
        border: active ? "1px solid #5B47FB" : "1px solid transparent",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: active ? "#5B47FB" : completed ? "#10B981" : "#D1D5DB",
          color: "#FFFFFF",
          fontSize: 11,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {completed ? "✓" : number}
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: active ? "#5B47FB" : completed ? "#10B981" : "#6B7280",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  )
}

function StepCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginTop: 0, marginBottom: 24 }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{children}</div>
    </motion.div>
  )
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 600,
          color: "#374151",
          marginBottom: 8,
        }}
      >
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: 14,
          color: "#111827",
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          outline: "none",
          fontFamily: "inherit",
        }}
      />
    </div>
  )
}

function TextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 600,
          color: "#374151",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: 14,
          color: "#111827",
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          outline: "none",
          fontFamily: "inherit",
          resize: "vertical",
        }}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 600,
          color: "#374151",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: 14,
          color: "#111827",
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          outline: "none",
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

function TopicSelector({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (topics: string[]) => void
}) {
  const topics = [
    "Linear Equations",
    "Quadratic Equations",
    "Polynomials",
    "Trigonometry",
    "Algebra Basics",
  ]

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {topics.map((topic) => {
        const isSelected = selected.includes(topic)
        return (
          <motion.button
            key={topic}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isSelected) {
                onChange(selected.filter((t) => t !== topic))
              } else {
                onChange([...selected, topic])
              }
            }}
            style={{
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: isSelected ? "#5B47FB" : "#F3F4F6",
              color: isSelected ? "#FFFFFF" : "#6B7280",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {isSelected && "✓ "}
            {topic}
          </motion.button>
        )
      })}
    </div>
  )
}

function RadioButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 16px",
        fontSize: 14,
        fontWeight: 600,
        backgroundColor: selected ? "#EEF2FF" : "#F9FAFB",
        color: selected ? "#5B47FB" : "#6B7280",
        border: selected ? "2px solid #5B47FB" : "1px solid #E5E7EB",
        borderRadius: 10,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      {label}
    </motion.button>
  )
}

function ToggleOption({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 16,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>{description}</div>
      </div>
      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!checked)}
        style={{
          width: 48,
          height: 28,
          backgroundColor: checked ? "#10B981" : "#D1D5DB",
          borderRadius: 14,
          padding: 2,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: checked ? "flex-end" : "flex-start",
        }}
      >
        <motion.div
          layout
          style={{
            width: 24,
            height: 24,
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
          }}
        />
      </motion.div>
    </div>
  )
}

function SectionCard({ section }: { section: any }) {
  return (
    <div
      style={{
        padding: 16,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{section.name}</div>
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: 18,
            color: "#6B7280",
            cursor: "pointer",
          }}
        >
          ⋮
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Type</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{section.type}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Questions</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{section.count}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Marks Each</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{section.marks}</div>
        </div>
      </div>
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      <span style={{ fontSize: 14, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", textAlign: "right" }}>
        {value}
      </span>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: "#6B7280" }}>{description}</div>
    </div>
  )
}

// Framer Property Controls
addPropertyControls(CreateTest, {})
