/**
 * SCREEN 31: Homework/Practice Set Builder
 *
 * Multi-step wizard for creating practice sets and homework assignments.
 * Supports auto-generation with AI, manual question selection, difficulty control,
 * and targeted assignment to students/groups.
 *
 * Features:
 * - 5-step wizard: Basic Details → Questions → Rules → Schedule → Review
 * - Auto-generate questions from AI + Question Bank
 * - Manual question selection with preview
 * - Difficulty distribution control (Easy/Medium/Hard sliders)
 * - Question shuffling and explanation settings
 * - Target audience selection (class/group/individuals)
 * - Schedule and publish controls
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
 * - Mobile: 390×844px
 * - Animations: Framer Motion
 * - Accessibility: WCAG AA compliant
 */

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Question {
    id: string
    text: string
    difficulty: "easy" | "medium" | "hard"
    type: "mcq" | "short" | "long"
    topic: string
}

interface HomeworkBuilderProps {
    primaryColor?: string
    teacherName?: string
    className?: string
    onPublish?: (data: any) => void
}

export default function HomeworkBuilder({
    primaryColor = "#5B47FB",
    teacherName = "Teacher",
    className = "Class 10-A",
    onPublish,
}: HomeworkBuilderProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [subject, setSubject] = useState("Mathematics")
    const [topics, setTopics] = useState<string[]>([])
    const [easyPercent, setEasyPercent] = useState(40)
    const [mediumPercent, setMediumPercent] = useState(40)
    const [hardPercent, setHardPercent] = useState(20)
    const [questionCount, setQuestionCount] = useState(10)
    const [selectionMode, setSelectionMode] = useState<"auto" | "manual">("auto")
    const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
    const [showExplanations, setShowExplanations] = useState<"after_each" | "after_complete" | "never">("after_complete")
    const [shuffleQuestions, setShuffleQuestions] = useState(false)
    const [targetAudience, setTargetAudience] = useState<"class" | "group" | "individual">("class")
    const [dueDate, setDueDate] = useState("")
    const [publishMode, setPublishMode] = useState<"now" | "schedule">("now")

    const steps = [
        { number: 1, label: "Basic Details" },
        { number: 2, label: "Questions" },
        { number: 3, label: "Rules" },
        { number: 4, label: "Schedule" },
        { number: 5, label: "Review" },
    ]

    const handleNext = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handlePublish = () => {
        const homeworkData = {
            title,
            description,
            subject,
            topics,
            difficulty: { easy: easyPercent, medium: mediumPercent, hard: hardPercent },
            questionCount,
            questions: selectedQuestions,
            settings: { showExplanations, shuffleQuestions },
            targetAudience,
            dueDate,
            publishMode,
        }
        onPublish?.(homeworkData)
    }

    const generateQuestions = () => {
        // Simulate AI generation
        const mockQuestions: Question[] = Array.from({ length: questionCount }, (_, i) => ({
            id: `q${i + 1}`,
            text: `Question ${i + 1}: Sample math problem about ${topics[0] || "algebra"}`,
            difficulty: i < questionCount * (easyPercent / 100) ? "easy" : i < questionCount * ((easyPercent + mediumPercent) / 100) ? "medium" : "hard",
            type: "mcq",
            topic: topics[0] || "Algebra",
        }))
        setSelectedQuestions(mockQuestions)
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#F9FAFB",
            overflow: "auto",
            fontFamily: "Inter, -apple-system, sans-serif",
        }}>
            {/* Header */}
            <div style={{
                padding: "20px",
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid #E5E7EB",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: currentStep === 1 ? "#F3F4F6" : "#F9FAFB",
                            cursor: currentStep === 1 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Go back"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke={currentStep === 1 ? "#9CA3AF" : "#374151"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827" }}>
                            Create Homework
                        </h1>
                        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6B7280" }}>
                            {className}
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto" }}>
                    {steps.map((step, index) => (
                        <div key={step.number} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: "max-content" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: currentStep === step.number ? 1.1 : 1 }}
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        backgroundColor: currentStep >= step.number ? primaryColor : "#E5E7EB",
                                        color: "#FFFFFF",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                    }}
                                >
                                    {currentStep > step.number ? "✓" : step.number}
                                </motion.div>
                                <span style={{
                                    fontSize: "12px",
                                    fontWeight: currentStep === step.number ? 600 : 400,
                                    color: currentStep >= step.number ? "#111827" : "#9CA3AF",
                                }}>
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div style={{
                                    flex: 1,
                                    height: "2px",
                                    backgroundColor: currentStep > step.number ? primaryColor : "#E5E7EB",
                                    marginLeft: "8px",
                                    minWidth: "16px",
                                }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ padding: "20px" }}
                >
                    {/* Step 1: Basic Details */}
                    {currentStep === 1 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Linear Equations Practice Set - Level 1"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #D1D5DB",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
                                    }}
                                    aria-label="Homework title"
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What students should expect..."
                                    rows={3}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #D1D5DB",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        resize: "vertical",
                                        boxSizing: "border-box",
                                    }}
                                    aria-label="Homework description"
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                                    Subject *
                                </label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #D1D5DB",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        backgroundColor: "#FFFFFF",
                                        boxSizing: "border-box",
                                    }}
                                    aria-label="Select subject"
                                >
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Biology">Biology</option>
                                    <option value="English">English</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                                    Difficulty Distribution
                                </label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "14px", color: "#6B7280" }}>Easy</span>
                                            <span style={{ fontSize: "14px", fontWeight: 600, color: "#10B981" }}>{easyPercent}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={easyPercent}
                                            onChange={(e) => setEasyPercent(Number(e.target.value))}
                                            style={{ width: "100%", accentColor: "#10B981" }}
                                            aria-label="Easy questions percentage"
                                        />
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "14px", color: "#6B7280" }}>Medium</span>
                                            <span style={{ fontSize: "14px", fontWeight: 600, color: "#F59E0B" }}>{mediumPercent}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={mediumPercent}
                                            onChange={(e) => setMediumPercent(Number(e.target.value))}
                                            style={{ width: "100%", accentColor: "#F59E0B" }}
                                            aria-label="Medium questions percentage"
                                        />
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "14px", color: "#6B7280" }}>Hard</span>
                                            <span style={{ fontSize: "14px", fontWeight: 600, color: "#EF4444" }}>{hardPercent}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={hardPercent}
                                            onChange={(e) => setHardPercent(Number(e.target.value))}
                                            style={{ width: "100%", accentColor: "#EF4444" }}
                                            aria-label="Hard questions percentage"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                                    Number of Questions *
                                </label>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    {[5, 10, 15, 20].map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => setQuestionCount(count)}
                                            style={{
                                                padding: "10px 20px",
                                                border: questionCount === count ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                                borderRadius: "8px",
                                                backgroundColor: questionCount === count ? `${primaryColor}10` : "#FFFFFF",
                                                color: questionCount === count ? primaryColor : "#6B7280",
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                            aria-label={`Select ${count} questions`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Questions */}
                    {currentStep === 2 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "12px" }}>
                                    Question Selection Mode
                                </label>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        onClick={() => setSelectionMode("auto")}
                                        style={{
                                            flex: 1,
                                            padding: "16px",
                                            border: selectionMode === "auto" ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                            borderRadius: "12px",
                                            backgroundColor: selectionMode === "auto" ? `${primaryColor}10` : "#FFFFFF",
                                            cursor: "pointer",
                                        }}
                                        aria-label="Auto-generate questions"
                                    >
                                        <div style={{ fontSize: "16px", fontWeight: 600, color: selectionMode === "auto" ? primaryColor : "#374151", marginBottom: "4px" }}>
                                            Auto Generate
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#6B7280" }}>
                                            AI + Question Bank
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setSelectionMode("manual")}
                                        style={{
                                            flex: 1,
                                            padding: "16px",
                                            border: selectionMode === "manual" ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                            borderRadius: "12px",
                                            backgroundColor: selectionMode === "manual" ? `${primaryColor}10` : "#FFFFFF",
                                            cursor: "pointer",
                                        }}
                                        aria-label="Manually select questions"
                                    >
                                        <div style={{ fontSize: "16px", fontWeight: 600, color: selectionMode === "manual" ? primaryColor : "#374151", marginBottom: "4px" }}>
                                            Manual Select
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#6B7280" }}>
                                            Choose from bank
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {selectionMode === "auto" && (
                                <div>
                                    <button
                                        onClick={generateQuestions}
                                        style={{
                                            width: "100%",
                                            padding: "16px",
                                            backgroundColor: primaryColor,
                                            color: "#FFFFFF",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                        aria-label="Generate questions"
                                    >
                                        🤖 Generate Questions
                                    </button>
                                </div>
                            )}

                            {selectedQuestions.length > 0 && (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                                            Selected Questions ({selectedQuestions.length})
                                        </span>
                                        <button
                                            onClick={generateQuestions}
                                            style={{
                                                padding: "6px 12px",
                                                border: `1px solid ${primaryColor}`,
                                                borderRadius: "6px",
                                                backgroundColor: "#FFFFFF",
                                                color: primaryColor,
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                            aria-label="Regenerate questions"
                                        >
                                            Regenerate
                                        </button>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {selectedQuestions.slice(0, 3).map((q, index) => (
                                            <div
                                                key={q.id}
                                                style={{
                                                    padding: "16px",
                                                    backgroundColor: "#FFFFFF",
                                                    border: "1px solid #E5E7EB",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                                                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280" }}>
                                                        Q{index + 1}
                                                    </span>
                                                    <span style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "6px",
                                                        fontSize: "10px",
                                                        fontWeight: 600,
                                                        backgroundColor: q.difficulty === "easy" ? "#10B98110" : q.difficulty === "medium" ? "#F59E0B10" : "#EF444410",
                                                        color: q.difficulty === "easy" ? "#10B981" : q.difficulty === "medium" ? "#F59E0B" : "#EF4444",
                                                    }}>
                                                        {q.difficulty.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>
                                                    {q.text}
                                                </p>
                                            </div>
                                        ))}
                                        {selectedQuestions.length > 3 && (
                                            <div style={{ textAlign: "center", padding: "12px", fontSize: "14px", color: "#6B7280" }}>
                                                +{selectedQuestions.length - 3} more questions
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Rules */}
                    {currentStep === 3 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "12px" }}>
                                    Show Explanations
                                </label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {[
                                        { value: "after_each", label: "After each question" },
                                        { value: "after_complete", label: "After completion" },
                                        { value: "never", label: "Don't show explanations" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setShowExplanations(option.value as any)}
                                            style={{
                                                padding: "12px 16px",
                                                border: showExplanations === option.value ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                                borderRadius: "8px",
                                                backgroundColor: showExplanations === option.value ? `${primaryColor}10` : "#FFFFFF",
                                                color: showExplanations === option.value ? primaryColor : "#374151",
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                textAlign: "left",
                                            }}
                                            aria-label={option.label}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={shuffleQuestions}
                                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                                        style={{ width: "20px", height: "20px", accentColor: primaryColor }}
                                        aria-label="Shuffle questions for students"
                                    />
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                                            Shuffle Questions
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#6B7280" }}>
                                            Each student gets questions in random order
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Schedule */}
                    {currentStep === 4 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "12px" }}>
                                    Target Audience
                                </label>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {[
                                        { value: "class", label: "Entire Class", desc: `All students in ${className}` },
                                        { value: "group", label: "Specific Group", desc: "Select student groups" },
                                        { value: "individual", label: "Individual Students", desc: "Choose specific students" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setTargetAudience(option.value as any)}
                                            style={{
                                                padding: "16px",
                                                border: targetAudience === option.value ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                                borderRadius: "12px",
                                                backgroundColor: targetAudience === option.value ? `${primaryColor}10` : "#FFFFFF",
                                                cursor: "pointer",
                                                textAlign: "left",
                                            }}
                                            aria-label={option.label}
                                        >
                                            <div style={{ fontSize: "14px", fontWeight: 600, color: targetAudience === option.value ? primaryColor : "#374151", marginBottom: "4px" }}>
                                                {option.label}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "#6B7280" }}>
                                                {option.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                                    Due Date *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #D1D5DB",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
                                    }}
                                    aria-label="Set due date"
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "12px" }}>
                                    Publish Mode
                                </label>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        onClick={() => setPublishMode("now")}
                                        style={{
                                            flex: 1,
                                            padding: "16px",
                                            border: publishMode === "now" ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                            borderRadius: "12px",
                                            backgroundColor: publishMode === "now" ? `${primaryColor}10` : "#FFFFFF",
                                            cursor: "pointer",
                                        }}
                                        aria-label="Publish immediately"
                                    >
                                        <div style={{ fontSize: "16px", fontWeight: 600, color: publishMode === "now" ? primaryColor : "#374151" }}>
                                            Publish Now
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setPublishMode("schedule")}
                                        style={{
                                            flex: 1,
                                            padding: "16px",
                                            border: publishMode === "schedule" ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                            borderRadius: "12px",
                                            backgroundColor: publishMode === "schedule" ? `${primaryColor}10` : "#FFFFFF",
                                            cursor: "pointer",
                                        }}
                                        aria-label="Schedule for later"
                                    >
                                        <div style={{ fontSize: "16px", fontWeight: 600, color: publishMode === "schedule" ? primaryColor : "#374151" }}>
                                            Schedule
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ padding: "16px", backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px" }}>
                                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600, color: "#111827" }}>
                                    {title || "Untitled Homework"}
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#6B7280" }}>
                                    <div>Subject: <strong style={{ color: "#374151" }}>{subject}</strong></div>
                                    <div>Questions: <strong style={{ color: "#374151" }}>{questionCount}</strong></div>
                                    <div>Target: <strong style={{ color: "#374151" }}>{targetAudience === "class" ? className : targetAudience}</strong></div>
                                    <div>Due: <strong style={{ color: "#374151" }}>{dueDate || "Not set"}</strong></div>
                                </div>
                            </div>

                            <div style={{
                                padding: "16px",
                                backgroundColor: "#10B98110",
                                border: "1px solid #10B981",
                                borderRadius: "12px",
                            }}>
                                <div style={{ fontSize: "14px", fontWeight: 600, color: "#059669", marginBottom: "4px" }}>
                                    Ready to Publish
                                </div>
                                <div style={{ fontSize: "12px", color: "#047857" }}>
                                    Your homework is ready. Students will be notified immediately.
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Footer Actions */}
            <div style={{
                padding: "20px",
                backgroundColor: "#FFFFFF",
                borderTop: "1px solid #E5E7EB",
                position: "sticky",
                bottom: 0,
            }}>
                <div style={{ display: "flex", gap: "12px" }}>
                    {currentStep < 5 ? (
                        <>
                            <button
                                style={{
                                    flex: 1,
                                    padding: "14px",
                                    border: `1px solid ${primaryColor}`,
                                    borderRadius: "12px",
                                    backgroundColor: "#FFFFFF",
                                    color: primaryColor,
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                                aria-label="Save as draft"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={handleNext}
                                style={{
                                    flex: 2,
                                    padding: "14px",
                                    border: "none",
                                    borderRadius: "12px",
                                    backgroundColor: primaryColor,
                                    color: "#FFFFFF",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                                aria-label="Continue to next step"
                            >
                                Continue
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handlePublish}
                            style={{
                                flex: 1,
                                padding: "14px",
                                border: "none",
                                borderRadius: "12px",
                                backgroundColor: "#10B981",
                                color: "#FFFFFF",
                                fontSize: "16px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                            aria-label="Publish homework"
                        >
                            🚀 Publish Homework
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

addPropertyControls(HomeworkBuilder, {
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#5B47FB",
    },
    teacherName: {
        type: ControlType.String,
        title: "Teacher Name",
        defaultValue: "Teacher",
    },
    className: {
        type: ControlType.String,
        title: "Class Name",
        defaultValue: "Class 10-A",
    },
})
