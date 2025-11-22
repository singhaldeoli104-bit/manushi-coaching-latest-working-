import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * CreateClassForm Component (Screen 16)
 *
 * Comprehensive class creation form with subject selection, teaching mode,
 * schedule setup, language preferences, and student admission configuration.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

interface Schedule {
    id: string
    days: string[]
    startTime: string
    endTime: string
    location: string
    mode: "online" | "offline"
}

export function CreateClassForm(props) {
    const {
        className,
        primaryColor,
        backgroundColor,
        successColor,
        enableSchedule,
        enableCoTeachers,
        enableCustomSubjects,
    } = props

    const [formData, setFormData] = useState({
        className: "",
        classType: "K-12",
        grade: "",
        board: "CBSE",
        subjects: [] as string[],
        mode: "online" as "online" | "offline" | "hybrid",
        location: "",
        languages: [] as string[],
        admissionMode: "manual" as "manual" | "joincode" | "institute",
    })

    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [customSubject, setCustomSubject] = useState("")
    const [isValid, setIsValid] = useState(false)

    const classTypes = ["K-12", "JEE", "NEET", "Foundation", "Skill Learning"]
    const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)
    const boards = ["CBSE", "ICSE", "State Board", "IGCSE"]
    const commonSubjects = [
        "Math",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "Hindi",
        "Social Science",
        "Commerce",
    ]
    const languages = ["English", "Hindi", "Hinglish"]
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const validateForm = () => {
        const valid =
            formData.className.trim() !== "" &&
            formData.grade !== "" &&
            formData.subjects.length > 0 &&
            formData.languages.length > 0 &&
            (formData.mode !== "offline" || formData.location.trim() !== "")

        setIsValid(valid)
        return valid
    }

    const handleSubmit = () => {
        if (validateForm()) {
            console.log("Creating class:", formData, schedules)
            // Implementation would save to backend
        }
    }

    const toggleSubject = (subject: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter((s) => s !== subject)
                : [...prev.subjects, subject],
        }))
    }

    const toggleLanguage = (language: string) => {
        setFormData((prev) => ({
            ...prev,
            languages: prev.languages.includes(language)
                ? prev.languages.filter((l) => l !== language)
                : [...prev.languages, language],
        }))
    }

    const addCustomSubject = () => {
        if (
            customSubject.trim() &&
            !formData.subjects.includes(customSubject)
        ) {
            setFormData((prev) => ({
                ...prev,
                subjects: [...prev.subjects, customSubject],
            }))
            setCustomSubject("")
        }
    }

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor,
                display: "flex",
                flexDirection: "column",
                fontFamily: "Inter, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #E5E7EB",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: "1px solid #E5E7EB",
                            backgroundColor: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: 18,
                        }}
                    >
                        ×
                    </motion.button>
                    <h1
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#111827",
                            margin: 0,
                        }}
                    >
                        Create Class
                    </h1>
                </div>
                <motion.button
                    whileHover={{ scale: isValid ? 1.05 : 1 }}
                    whileTap={{ scale: isValid ? 0.95 : 1 }}
                    onClick={handleSubmit}
                    disabled={!isValid}
                    style={{
                        padding: "10px 24px",
                        backgroundColor: isValid
                            ? primaryColor
                            : "#E5E7EB",
                        color: isValid ? "#FFFFFF" : "#9CA3AF",
                        border: "none",
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: isValid ? "pointer" : "not-allowed",
                    }}
                >
                    Save
                </motion.button>
            </motion.div>

            {/* Form Content */}
            <div
                style={{
                    flex: 1,
                    padding: 24,
                    overflowY: "auto",
                }}
            >
                {/* Section A: Basic Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 20,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: 20,
                        }}
                    >
                        Basic Information
                    </h2>

                    {/* Class Name */}
                    <div style={{ marginBottom: 20 }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 8,
                            }}
                        >
                            Class / Batch Name *
                        </label>
                        <input
                            type="text"
                            value={formData.className}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    className: e.target.value,
                                }))
                                validateForm()
                            }}
                            placeholder="e.g., Class 10 Math — Batch A"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                fontSize: 14,
                                border: "1px solid #E5E7EB",
                                borderRadius: 12,
                                outline: "none",
                            }}
                        />
                        <p
                            style={{
                                fontSize: 12,
                                color: "#6B7280",
                                marginTop: 6,
                            }}
                        >
                            Students and parents will see this name
                        </p>
                    </div>

                    {/* Class Type */}
                    <div style={{ marginBottom: 20 }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 12,
                            }}
                        >
                            Class Type
                        </label>
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                flexWrap: "wrap",
                            }}
                        >
                            {classTypes.map((type) => (
                                <motion.button
                                    key={type}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            classType: type,
                                        }))
                                    }
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor:
                                            formData.classType === type
                                                ? primaryColor
                                                : "#F3F4F6",
                                        color:
                                            formData.classType === type
                                                ? "#FFFFFF"
                                                : "#374151",
                                        border: "none",
                                        borderRadius: 10,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    {type}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Grade and Board */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 16,
                            marginBottom: 20,
                        }}
                    >
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
                                Grade *
                            </label>
                            <select
                                value={formData.grade}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        grade: e.target.value,
                                    }))
                                    validateForm()
                                }}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 12,
                                    outline: "none",
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                <option value="">Select Grade</option>
                                {grades.map((grade) => (
                                    <option key={grade} value={grade}>
                                        {grade}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                                Board
                            </label>
                            <select
                                value={formData.board}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        board: e.target.value,
                                    }))
                                }
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 12,
                                    outline: "none",
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                {boards.map((board) => (
                                    <option key={board} value={board}>
                                        {board}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subject Selection */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 12,
                            }}
                        >
                            Subjects *
                        </label>
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                                marginBottom: 12,
                            }}
                        >
                            {commonSubjects.map((subject) => (
                                <motion.button
                                    key={subject}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleSubject(subject)}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor:
                                            formData.subjects.includes(
                                                subject
                                            )
                                                ? primaryColor
                                                : "#F3F4F6",
                                        color: formData.subjects.includes(
                                            subject
                                        )
                                            ? "#FFFFFF"
                                            : "#374151",
                                        border: "none",
                                        borderRadius: 10,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    {subject}
                                </motion.button>
                            ))}
                        </div>

                        {/* Custom Subject */}
                        {enableCustomSubjects && (
                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                }}
                            >
                                <input
                                    type="text"
                                    value={customSubject}
                                    onChange={(e) =>
                                        setCustomSubject(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Add custom subject"
                                    style={{
                                        flex: 1,
                                        padding: "10px 16px",
                                        fontSize: 14,
                                        border: "1px solid #E5E7EB",
                                        borderRadius: 10,
                                        outline: "none",
                                    }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={addCustomSubject}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: primaryColor,
                                        color: "#FFFFFF",
                                        border: "none",
                                        borderRadius: 10,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    + Add
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Section B: Teaching Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 20,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: 20,
                        }}
                    >
                        Teaching Mode & Location
                    </h2>

                    {/* Mode Selection */}
                    <div style={{ marginBottom: 20 }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#374151",
                                marginBottom: 12,
                            }}
                        >
                            Mode
                        </label>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: 12,
                            }}
                        >
                            {(["online", "offline", "hybrid"] as const).map(
                                (mode) => (
                                    <motion.div
                                        key={mode}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                mode,
                                            }))
                                        }
                                        style={{
                                            padding: 20,
                                            backgroundColor:
                                                formData.mode === mode
                                                    ? `${primaryColor}15`
                                                    : "#F9FAFB",
                                            border:
                                                formData.mode === mode
                                                    ? `2px solid ${primaryColor}`
                                                    : "2px solid #E5E7EB",
                                            borderRadius: 12,
                                            cursor: "pointer",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 32,
                                                marginBottom: 8,
                                            }}
                                        >
                                            {mode === "online"
                                                ? "💻"
                                                : mode === "offline"
                                                ? "🏫"
                                                : "🔄"}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "#111827",
                                                textTransform:
                                                    "capitalize",
                                            }}
                                        >
                                            {mode}
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Location (for offline/hybrid) */}
                    {(formData.mode === "offline" ||
                        formData.mode === "hybrid") && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#374151",
                                    marginBottom: 8,
                                }}
                            >
                                Location / Room
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        location: e.target.value,
                                    }))
                                    validateForm()
                                }}
                                placeholder="e.g., Room 202, Building A"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 12,
                                    outline: "none",
                                }}
                            />
                        </motion.div>
                    )}
                </motion.div>

                {/* Section C: Languages */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 20,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: 20,
                        }}
                    >
                        Teaching Languages
                    </h2>

                    <label
                        style={{
                            display: "block",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#374151",
                            marginBottom: 12,
                        }}
                    >
                        Select Languages *
                    </label>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {languages.map((language) => (
                            <motion.button
                                key={language}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleLanguage(language)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor:
                                        formData.languages.includes(language)
                                            ? primaryColor
                                            : "#F3F4F6",
                                    color: formData.languages.includes(
                                        language
                                    )
                                        ? "#FFFFFF"
                                        : "#374151",
                                    border: "none",
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                {language}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Section D: Schedule (optional) */}
                {enableSchedule && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            padding: 24,
                            marginBottom: 20,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 20,
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "#111827",
                                }}
                            >
                                Schedule
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowScheduleModal(true)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: primaryColor,
                                    color: "#FFFFFF",
                                    border: "none",
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                + Add Session
                            </motion.button>
                        </div>

                        {schedules.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px 20px",
                                    color: "#6B7280",
                                }}
                            >
                                No sessions added yet
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                {schedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        style={{
                                            padding: 16,
                                            backgroundColor: "#F9FAFB",
                                            borderRadius: 12,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: "#111827",
                                                }}
                                            >
                                                {schedule.days.join(", ")} •{" "}
                                                {schedule.startTime} –{" "}
                                                {schedule.endTime}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "#6B7280",
                                                    marginTop: 4,
                                                }}
                                            >
                                                {schedule.location}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 8,
                                            }}
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{
                                                    padding: 8,
                                                    backgroundColor:
                                                        "#FFFFFF",
                                                    border:
                                                        "1px solid #E5E7EB",
                                                    borderRadius: 8,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ✏️
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() =>
                                                    setSchedules(
                                                        schedules.filter(
                                                            (s) =>
                                                                s.id !==
                                                                schedule.id
                                                        )
                                                    )
                                                }
                                                style={{
                                                    padding: 8,
                                                    backgroundColor:
                                                        "#FFFFFF",
                                                    border:
                                                        "1px solid #E5E7EB",
                                                    borderRadius: 8,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                🗑️
                                            </motion.button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Section E: Admission Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 16,
                        padding: 24,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: 20,
                        }}
                    >
                        Student Admission
                    </h2>

                    <div
                        style={{ display: "flex", flexDirection: "column", gap: 12 }}
                    >
                        {[
                            {
                                value: "manual",
                                label: "Add Manually",
                                description:
                                    "Teacher adds students one by one",
                            },
                            {
                                value: "joincode",
                                label: "Join Code",
                                description:
                                    "Students can join using a code",
                            },
                            {
                                value: "institute",
                                label: "Institute Managed",
                                description: "Admin controls enrollment",
                            },
                        ].map((option) => (
                            <motion.div
                                key={option.value}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        admissionMode: option.value as any,
                                    }))
                                }
                                style={{
                                    padding: 16,
                                    backgroundColor:
                                        formData.admissionMode ===
                                        option.value
                                            ? `${primaryColor}10`
                                            : "#F9FAFB",
                                    border:
                                        formData.admissionMode ===
                                        option.value
                                            ? `2px solid ${primaryColor}`
                                            : "2px solid #E5E7EB",
                                    borderRadius: 12,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <div
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        border: `2px solid ${
                                            formData.admissionMode ===
                                            option.value
                                                ? primaryColor
                                                : "#9CA3AF"
                                        }`,
                                        backgroundColor:
                                            formData.admissionMode ===
                                            option.value
                                                ? primaryColor
                                                : "transparent",
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#111827",
                                        }}
                                    >
                                        {option.label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "#6B7280",
                                            marginTop: 2,
                                        }}
                                    >
                                        {option.description}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {formData.admissionMode === "joincode" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            style={{
                                marginTop: 16,
                                padding: 16,
                                backgroundColor: "#F9FAFB",
                                borderRadius: 12,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#6B7280",
                                    marginBottom: 8,
                                }}
                            >
                                Join Code
                            </div>
                            <div
                                style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: primaryColor,
                                    letterSpacing: 4,
                                }}
                            >
                                AJX103
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#6B7280",
                                    marginTop: 8,
                                }}
                            >
                                Valid for 7 days
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

CreateClassForm.defaultProps = {
    primaryColor: "#5B47FB",
    backgroundColor: "#F9FAFB",
    successColor: "#10B981",
    enableSchedule: true,
    enableCoTeachers: false,
    enableCustomSubjects: true,
}

addPropertyControls(CreateClassForm, {
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#5B47FB",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#F9FAFB",
    },
    successColor: {
        type: ControlType.Color,
        title: "Success Color",
        defaultValue: "#10B981",
    },
    enableSchedule: {
        type: ControlType.Boolean,
        title: "Enable Schedule",
        defaultValue: true,
    },
    enableCoTeachers: {
        type: ControlType.Boolean,
        title: "Enable Co-Teachers",
        defaultValue: false,
    },
    enableCustomSubjects: {
        type: ControlType.Boolean,
        title: "Enable Custom Subjects",
        defaultValue: true,
    },
})
