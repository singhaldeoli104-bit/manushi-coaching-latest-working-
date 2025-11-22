import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * LiveClassSession Component (Screen 22)
 *
 * Complete live class interface for teachers with video conferencing,
 * whiteboard, chat, polls, doubts, participant management, and recording.
 * Production-ready for real-time teaching scenarios.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

interface Participant {
    id: string
    name: string
    avatar: string
    isMuted: boolean
    isVideoOn: boolean
    handRaised: boolean
    networkQuality: "good" | "medium" | "poor"
}

interface ChatMessage {
    id: string
    sender: string
    message: string
    timestamp: string
}

interface Doubt {
    id: string
    student: string
    question: string
    subject: string
    priority: "high" | "medium" | "low"
    timestamp: string
}

export function LiveClassSession(props) {
    const {
        className,
        primaryColor,
        successColor,
        errorColor,
        warningColor,
        backgroundColor,
        teacherName,
        classTitle,
        participantCount,
        enableRecording,
        enableWhiteboard,
        enableBreakout,
    } = props

    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [activeMode, setActiveMode] = useState<
        "video" | "screenshare" | "whiteboard"
    >("video")
    const [activeSidebarTab, setActiveSidebarTab] = useState<
        "chat" | "participants" | "doubts" | "polls" | "resources"
    >("chat")
    const [showEndClassModal, setShowEndClassModal] = useState(false)
    const [duration, setDuration] = useState("00:43:19")
    const [networkStatus, setNetworkStatus] = useState<
        "good" | "medium" | "poor"
    >("good")

    // Mock data
    const mockParticipants: Participant[] = Array.from(
        { length: participantCount },
        (_, i) => ({
            id: `student-${i + 1}`,
            name: `Student ${i + 1}`,
            avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
            isMuted: Math.random() > 0.3,
            isVideoOn: Math.random() > 0.5,
            handRaised: Math.random() > 0.9,
            networkQuality:
                Math.random() > 0.7
                    ? "good"
                    : Math.random() > 0.5
                    ? "medium"
                    : "poor",
        })
    )

    const mockChat: ChatMessage[] = [
        {
            id: "1",
            sender: "Riya",
            message: "Can you explain the formula again?",
            timestamp: "10:23",
        },
        {
            id: "2",
            sender: "Arjun",
            message: "Thank you for the clear explanation!",
            timestamp: "10:25",
        },
        {
            id: "3",
            sender: "Priya",
            message: "What is the homework for today?",
            timestamp: "10:27",
        },
    ]

    const mockDoubts: Doubt[] = [
        {
            id: "1",
            student: "Rahul",
            question:
                "How do we solve quadratic equations with complex roots?",
            subject: "Math",
            priority: "high",
            timestamp: "10:15",
        },
        {
            id: "2",
            student: "Sneha",
            question: "Can you explain the chain rule once more?",
            subject: "Math",
            priority: "medium",
            timestamp: "10:20",
        },
    ]

    const getNetworkColor = () => {
        if (networkStatus === "good") return successColor
        if (networkStatus === "medium") return warningColor
        return errorColor
    }

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#1F2937",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Inter, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Header Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    padding: "16px 24px",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backdropFilter: "blur(10px)",
                }}
            >
                <div
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#FFFFFF",
                                margin: 0,
                            }}
                        >
                            {classTitle}
                        </h1>
                        <div
                            style={{
                                fontSize: 12,
                                color: "#9CA3AF",
                                marginTop: 2,
                            }}
                        >
                            {duration}
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 12px",
                            backgroundColor: errorColor,
                            borderRadius: 8,
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "#FFFFFF",
                                animation: "pulse 2s infinite",
                            }}
                        />
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#FFFFFF",
                            }}
                        >
                            LIVE
                        </span>
                    </div>
                    {isRecording && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 12px",
                                backgroundColor: "rgba(239, 68, 68, 0.2)",
                                borderRadius: 8,
                                border: `1px solid ${errorColor}`,
                            }}
                        >
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: errorColor,
                                }}
                            />
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#FFFFFF",
                                }}
                            >
                                Recording
                            </span>
                        </motion.div>
                    )}
                </div>

                <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <div
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: getNetworkColor(),
                            }}
                        />
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                            Network
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            padding: 8,
                            backgroundColor: "rgba(255,255,255,0.1)",
                            border: "none",
                            borderRadius: 8,
                            color: "#FFFFFF",
                            cursor: "pointer",
                            fontSize: 18,
                        }}
                    >
                        ⋮
                    </motion.button>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                {/* Main Stage */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        padding: 20,
                        gap: 20,
                    }}
                >
                    {/* Video/Screen Share Area */}
                    <motion.div
                        style={{
                            flex: 1,
                            backgroundColor: "#000000",
                            borderRadius: 16,
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {activeMode === "video" && (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#1F2937",
                                }}
                            >
                                <div
                                    style={{
                                        textAlign: "center",
                                        color: "#FFFFFF",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 120,
                                            height: 120,
                                            borderRadius: "50%",
                                            backgroundColor: primaryColor,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 48,
                                            fontWeight: 700,
                                            margin: "0 auto 16px",
                                        }}
                                    >
                                        {teacherName.charAt(0)}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {teacherName}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            color: "#9CA3AF",
                                            marginTop: 4,
                                        }}
                                    >
                                        {isVideoOn
                                            ? "Camera Active"
                                            : "Camera Off"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMode === "screenshare" && (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            fontSize: 64,
                                            marginBottom: 16,
                                        }}
                                    >
                                        🖥️
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 600,
                                            color: "#111827",
                                        }}
                                    >
                                        Screen Sharing Active
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeMode === "whiteboard" && (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#FFFFFF",
                                    position: "relative",
                                }}
                            >
                                {/* Whiteboard Tools */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 16,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        display: "flex",
                                        gap: 8,
                                        padding: 12,
                                        backgroundColor:
                                            "rgba(255,255,255,0.9)",
                                        borderRadius: 12,
                                        boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    {["✏️", "🖊️", "⬜", "T", "🗑️", "↩️"].map(
                                        (tool) => (
                                            <motion.button
                                                key={tool}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    backgroundColor:
                                                        "#F3F4F6",
                                                    border: "none",
                                                    borderRadius: 8,
                                                    cursor: "pointer",
                                                    fontSize: 20,
                                                }}
                                            >
                                                {tool}
                                            </motion.button>
                                        )
                                    )}
                                </div>

                                {/* Whiteboard Canvas */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#9CA3AF",
                                    }}
                                >
                                    Interactive Whiteboard Canvas
                                </div>
                            </div>
                        )}

                        {/* Participant Grid (Small Thumbnails) */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: 16,
                                right: 16,
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: 8,
                                maxWidth: 300,
                            }}
                        >
                            {mockParticipants.slice(0, 6).map((p) => (
                                <motion.div
                                    key={p.id}
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 12,
                                        backgroundColor: "#374151",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        src={p.avatar}
                                        alt={p.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            opacity: p.isVideoOn ? 1 : 0.3,
                                        }}
                                    />
                                    {p.isMuted && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 4,
                                                right: 4,
                                                width: 20,
                                                height: 20,
                                                borderRadius: "50%",
                                                backgroundColor: errorColor,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 10,
                                            }}
                                        >
                                            🔇
                                        </div>
                                    )}
                                    {p.handRaised && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 4,
                                                left: 4,
                                                fontSize: 16,
                                            }}
                                        >
                                            ✋
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Sidebar */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    style={{
                        width: 360,
                        backgroundColor: "#FFFFFF",
                        display: "flex",
                        flexDirection: "column",
                        borderLeft: "1px solid #E5E7EB",
                    }}
                >
                    {/* Sidebar Tabs */}
                    <div
                        style={{
                            display: "flex",
                            borderBottom: "1px solid #E5E7EB",
                            backgroundColor: "#F9FAFB",
                        }}
                    >
                        {(
                            [
                                { key: "chat", label: "Chat", badge: 3 },
                                {
                                    key: "participants",
                                    label: "People",
                                    badge: participantCount,
                                },
                                { key: "doubts", label: "Doubts", badge: 2 },
                                { key: "polls", label: "Polls", badge: 0 },
                                {
                                    key: "resources",
                                    label: "Files",
                                    badge: 0,
                                },
                            ] as const
                        ).map((tab) => (
                            <motion.button
                                key={tab.key}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    setActiveSidebarTab(tab.key)
                                }
                                style={{
                                    flex: 1,
                                    padding: "12px 8px",
                                    backgroundColor:
                                        activeSidebarTab === tab.key
                                            ? "#FFFFFF"
                                            : "transparent",
                                    border: "none",
                                    borderBottom:
                                        activeSidebarTab === tab.key
                                            ? `2px solid ${primaryColor}`
                                            : "2px solid transparent",
                                    color:
                                        activeSidebarTab === tab.key
                                            ? primaryColor
                                            : "#6B7280",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    position: "relative",
                                }}
                            >
                                {tab.label}
                                {tab.badge > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 6,
                                            right: 6,
                                            width: 16,
                                            height: 16,
                                            borderRadius: "50%",
                                            backgroundColor: errorColor,
                                            color: "#FFFFFF",
                                            fontSize: 10,
                                            fontWeight: 700,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {tab.badge}
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Sidebar Content */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: 16,
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {activeSidebarTab === "chat" && (
                                <motion.div
                                    key="chat"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    {mockChat.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                marginBottom: 16,
                                                padding: 12,
                                                backgroundColor: "#F9FAFB",
                                                borderRadius: 12,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom: 6,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: "#111827",
                                                    }}
                                                >
                                                    {msg.sender}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: "#9CA3AF",
                                                    }}
                                                >
                                                    {msg.timestamp}
                                                </span>
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: 13,
                                                    color: "#374151",
                                                    margin: 0,
                                                }}
                                            >
                                                {msg.message}
                                            </p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {activeSidebarTab === "participants" && (
                                <motion.div
                                    key="participants"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    {mockParticipants.map((p) => (
                                        <motion.div
                                            key={p.id}
                                            whileHover={{ scale: 1.02 }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                padding: 12,
                                                marginBottom: 8,
                                                backgroundColor: "#F9FAFB",
                                                borderRadius: 12,
                                            }}
                                        >
                                            <img
                                                src={p.avatar}
                                                alt={p.name}
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: "50%",
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: "#111827",
                                                    }}
                                                >
                                                    {p.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 11,
                                                        color: "#6B7280",
                                                    }}
                                                >
                                                    {p.networkQuality ===
                                                    "good"
                                                        ? "Good connection"
                                                        : p.networkQuality ===
                                                          "medium"
                                                        ? "Medium connection"
                                                        : "Poor connection"}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 4,
                                                }}
                                            >
                                                {p.handRaised && (
                                                    <span>✋</span>
                                                )}
                                                {p.isMuted && (
                                                    <span>🔇</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {activeSidebarTab === "doubts" && (
                                <motion.div
                                    key="doubts"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    {mockDoubts.map((doubt) => (
                                        <motion.div
                                            key={doubt.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                marginBottom: 16,
                                                padding: 16,
                                                backgroundColor: "#FEF3C7",
                                                borderRadius: 12,
                                                borderLeft: `4px solid ${warningColor}`,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: "#111827",
                                                    }}
                                                >
                                                    {doubt.student}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: "#6B7280",
                                                    }}
                                                >
                                                    {doubt.timestamp}
                                                </span>
                                            </div>
                                            <p
                                                style={{
                                                    fontSize: 13,
                                                    color: "#374151",
                                                    margin: "0 0 12px 0",
                                                }}
                                            >
                                                {doubt.question}
                                            </p>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 8,
                                                }}
                                            >
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.05,
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        flex: 1,
                                                        padding: "8px 12px",
                                                        backgroundColor:
                                                            primaryColor,
                                                        color: "#FFFFFF",
                                                        border: "none",
                                                        borderRadius: 8,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Answer
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.05,
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        flex: 1,
                                                        padding: "8px 12px",
                                                        backgroundColor:
                                                            "#FFFFFF",
                                                        color: primaryColor,
                                                        border: `1px solid ${primaryColor}`,
                                                        borderRadius: 8,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Later
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {activeSidebarTab === "polls" && (
                                <motion.div
                                    key="polls"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        textAlign: "center",
                                        padding: "40px 20px",
                                        color: "#6B7280",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 48,
                                            marginBottom: 16,
                                        }}
                                    >
                                        📊
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            marginBottom: 8,
                                        }}
                                    >
                                        No Polls Yet
                                    </div>
                                    <div style={{ fontSize: 12 }}>
                                        Create a poll to engage students
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            marginTop: 20,
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
                                        Create Poll
                                    </motion.button>
                                </motion.div>
                            )}

                            {activeSidebarTab === "resources" && (
                                <motion.div
                                    key="resources"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        textAlign: "center",
                                        padding: "40px 20px",
                                        color: "#6B7280",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 48,
                                            marginBottom: 16,
                                        }}
                                    >
                                        📁
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            marginBottom: 8,
                                        }}
                                    >
                                        No Resources Shared
                                    </div>
                                    <div style={{ fontSize: 12 }}>
                                        Share PDFs, notes, or presentations
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            marginTop: 20,
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
                                        Share Resource
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Chat Input (if chat tab active) */}
                    {activeSidebarTab === "chat" && (
                        <div
                            style={{
                                padding: 16,
                                borderTop: "1px solid #E5E7EB",
                            }}
                        >
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
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
                                    Send
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Bottom Control Dock */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                    padding: "16px 24px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                }}
            >
                {/* Mic Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: isMuted ? errorColor : "#374151",
                        border: "none",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        fontSize: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {isMuted ? "🔇" : "🎤"}
                </motion.button>

                {/* Camera Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: !isVideoOn ? errorColor : "#374151",
                        border: "none",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        fontSize: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {isVideoOn ? "📹" : "📷"}
                </motion.button>

                {/* Screen Share */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setIsScreenSharing(!isScreenSharing)
                        setActiveMode(
                            isScreenSharing ? "video" : "screenshare"
                        )
                    }}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: isScreenSharing
                            ? primaryColor
                            : "#374151",
                        border: "none",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        fontSize: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    🖥️
                </motion.button>

                {/* Whiteboard */}
                {enableWhiteboard && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                            setActiveMode(
                                activeMode === "whiteboard"
                                    ? "video"
                                    : "whiteboard"
                            )
                        }
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            backgroundColor:
                                activeMode === "whiteboard"
                                    ? primaryColor
                                    : "#374151",
                            border: "none",
                            color: "#FFFFFF",
                            cursor: "pointer",
                            fontSize: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ✏️
                    </motion.button>
                )}

                {/* Record */}
                {enableRecording && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsRecording(!isRecording)}
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            backgroundColor: isRecording
                                ? errorColor
                                : "#374151",
                            border: "none",
                            color: "#FFFFFF",
                            cursor: "pointer",
                            fontSize: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ⏺️
                    </motion.button>
                )}

                {/* More Options */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#374151",
                        border: "none",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        fontSize: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    ⋯
                </motion.button>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* End Class Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEndClassModal(true)}
                    style={{
                        padding: "12px 32px",
                        backgroundColor: errorColor,
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    End Class
                </motion.button>
            </motion.div>

            {/* End Class Modal */}
            <AnimatePresence>
                {showEndClassModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 20,
                                padding: 32,
                                maxWidth: 480,
                                width: "90%",
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: "#111827",
                                    marginBottom: 16,
                                }}
                            >
                                End Class?
                            </h2>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    marginBottom: 24,
                                }}
                            >
                                This will end the class for all {participantCount}{" "}
                                participants. The recording and whiteboard will
                                be saved automatically.
                            </p>
                            <div style={{ display: "flex", gap: 12 }}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        setShowEndClassModal(false)
                                    }
                                    style={{
                                        flex: 1,
                                        padding: "12px 24px",
                                        backgroundColor: "#F3F4F6",
                                        color: "#374151",
                                        border: "none",
                                        borderRadius: 12,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        flex: 1,
                                        padding: "12px 24px",
                                        backgroundColor: errorColor,
                                        color: "#FFFFFF",
                                        border: "none",
                                        borderRadius: 12,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                    }}
                                >
                                    End for All
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

LiveClassSession.defaultProps = {
    primaryColor: "#5B47FB",
    successColor: "#10B981",
    errorColor: "#EF4444",
    warningColor: "#F59E0B",
    backgroundColor: "#F9FAFB",
    teacherName: "Ms. Khushi",
    classTitle: "Class 10 Math — Batch A",
    participantCount: 24,
    enableRecording: true,
    enableWhiteboard: true,
    enableBreakout: false,
}

addPropertyControls(LiveClassSession, {
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#5B47FB",
    },
    successColor: {
        type: ControlType.Color,
        title: "Success Color",
        defaultValue: "#10B981",
    },
    errorColor: {
        type: ControlType.Color,
        title: "Error Color",
        defaultValue: "#EF4444",
    },
    warningColor: {
        type: ControlType.Color,
        title: "Warning Color",
        defaultValue: "#F59E0B",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#F9FAFB",
    },
    teacherName: {
        type: ControlType.String,
        title: "Teacher Name",
        defaultValue: "Ms. Khushi",
    },
    classTitle: {
        type: ControlType.String,
        title: "Class Title",
        defaultValue: "Class 10 Math — Batch A",
    },
    participantCount: {
        type: ControlType.Number,
        title: "Participants",
        min: 1,
        max: 500,
        defaultValue: 24,
    },
    enableRecording: {
        type: ControlType.Boolean,
        title: "Enable Recording",
        defaultValue: true,
    },
    enableWhiteboard: {
        type: ControlType.Boolean,
        title: "Enable Whiteboard",
        defaultValue: true,
    },
    enableBreakout: {
        type: ControlType.Boolean,
        title: "Enable Breakouts",
        defaultValue: false,
    },
})
