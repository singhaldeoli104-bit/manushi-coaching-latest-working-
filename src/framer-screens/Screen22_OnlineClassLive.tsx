/**
 * Screen 22: Online Class (Live Class Session - Teacher View)
 * Real-time teaching interface with video, chat, whiteboard, and student management
 *
 * Features:
 * - Video interface with teacher camera and screen share
 * - Student grid view with live status indicators
 * - Real-time chat panel with moderation
 * - Whiteboard with drawing tools
 * - Screen share controls
 * - Participant list with hand raise/mute controls
 * - Recording controls
 * - Live attendance tracking
 * - Polls and Q&A
 * - Breakout room management
 */

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface Student {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  isMuted: boolean
  isVideoOn: boolean
  handRaised: boolean
  joinedAt: string
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
  isTeacher: boolean
}

interface OnlineClassLiveProps {
  className?: string
  sessionDuration?: string
  studentCount?: number
  isRecording?: boolean
  primaryColor?: string
  successColor?: string
  errorColor?: string
  warningColor?: string
  backgroundColor?: string
  onEndClass?: () => void
  onToggleRecording?: () => void
  onToggleScreen?: () => void
}

export function Screen22_OnlineClassLive(props: OnlineClassLiveProps) {
  const {
    className = "Class 10 Math - Batch A",
    sessionDuration = "00:42:15",
    studentCount = 24,
    isRecording = true,
    primaryColor = "#5B47FB",
    successColor = "#10B981",
    errorColor = "#EF4444",
    warningColor = "#F59E0B",
    backgroundColor = "#1F2937",
    onEndClass,
    onToggleRecording,
    onToggleScreen,
  } = props

  const [activePanel, setActivePanel] = useState<"chat" | "students" | "whiteboard" | "polls" | "none">("chat")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [whiteboardTool, setWhiteboardTool] = useState<"pen" | "eraser" | "text">("pen")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showEndModal, setShowEndModal] = useState(false)

  // Mock data
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Riya Sharma",
      avatar: "RS",
      isOnline: true,
      isMuted: false,
      isVideoOn: true,
      handRaised: true,
      joinedAt: "10:30 AM",
    },
    {
      id: "2",
      name: "Arjun Patel",
      avatar: "AP",
      isOnline: true,
      isMuted: true,
      isVideoOn: true,
      handRaised: false,
      joinedAt: "10:29 AM",
    },
    {
      id: "3",
      name: "Priya Kumar",
      avatar: "PK",
      isOnline: true,
      isMuted: false,
      isVideoOn: false,
      handRaised: false,
      joinedAt: "10:31 AM",
    },
    {
      id: "4",
      name: "Vikram Singh",
      avatar: "VS",
      isOnline: true,
      isMuted: true,
      isVideoOn: true,
      handRaised: false,
      joinedAt: "10:30 AM",
    },
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "1",
      senderName: "Riya Sharma",
      message: "Good morning, sir!",
      timestamp: "10:30 AM",
      isTeacher: false,
    },
    {
      id: "2",
      senderId: "teacher",
      senderName: "You",
      message: "Good morning everyone! Let's begin today's lesson.",
      timestamp: "10:31 AM",
      isTeacher: true,
    },
    {
      id: "3",
      senderId: "2",
      senderName: "Arjun Patel",
      message: "Sir, can you explain the last step again?",
      timestamp: "10:42 AM",
      isTeacher: false,
    },
  ])

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: "teacher",
      senderName: "You",
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      isTeacher: true,
    }

    setChatMessages([...chatMessages, newMessage])
    setChatMessage("")
  }

  const handsRaisedCount = students.filter((s) => s.handRaised).length

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor,
        fontFamily: "Inter, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              backgroundColor: errorColor,
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "white",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>LIVE</span>
          </div>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: 600, color: "white", margin: 0 }}>
              {className}
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: "2px 0 0 0" }}>
              {sessionDuration} • {studentCount} participants
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isRecording && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                borderRadius: "20px",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: errorColor,
                }}
              />
              <span style={{ fontSize: "12px", fontWeight: 500, color: "white" }}>Recording</span>
            </div>
          )}

          {handsRaisedCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: warningColor,
                borderRadius: "20px",
              }}
            >
              <span style={{ fontSize: "16px" }}>✋</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>
                {handsRaisedCount}
              </span>
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEndModal(true)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: errorColor,
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            aria-label="End class"
          >
            End Class
          </motion.button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Main Stage */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          {/* Video/Screen Share Area */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {showWhiteboard ? (
              // Whiteboard
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "white",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    display: "flex",
                    gap: "8px",
                    backgroundColor: "rgba(0,0,0,0.8)",
                    padding: "12px",
                    borderRadius: "12px",
                  }}
                >
                  {(["pen", "eraser", "text"] as const).map((tool) => (
                    <motion.button
                      key={tool}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setWhiteboardTool(tool)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: whiteboardTool === tool ? primaryColor : "rgba(255,255,255,0.1)",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}
                      aria-label={`${tool} tool`}
                    >
                      {tool === "pen" && "✏️"}
                      {tool === "eraser" && "🧹"}
                      {tool === "text" && "T"}
                    </motion.button>
                  ))}
                  <div
                    style={{
                      width: "1px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      margin: "0 4px",
                    }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Clear whiteboard"
                  >
                    🗑️
                  </motion.button>
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "18px",
                    color: "#9CA3AF",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0 }}>Draw on the whiteboard</p>
                  <p style={{ fontSize: "14px", marginTop: "8px" }}>Select a tool to start</p>
                </div>
              </div>
            ) : isScreenSharing ? (
              // Screen Share View
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
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      margin: "0 auto 20px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(91, 71, 251, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "48px",
                    }}
                  >
                    🖥️
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, color: "white", margin: 0 }}>
                    Sharing Your Screen
                  </h3>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginTop: "8px" }}>
                    Students can see your screen
                  </p>
                </div>
              </div>
            ) : (
              // Teacher Camera View
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1F2937",
                  position: "relative",
                }}
              >
                {isVideoOn ? (
                  <div
                    style={{
                      width: "600px",
                      height: "450px",
                      borderRadius: "16px",
                      backgroundColor: "#374151",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        backgroundColor: primaryColor,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "48px",
                        fontWeight: 600,
                      }}
                    >
                      You
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        margin: "0 auto 20px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "48px",
                      }}
                    >
                      📹
                    </div>
                    <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)" }}>
                      Camera is off
                    </p>
                  </div>
                )}

                {/* Student Grid (Picture-in-Picture) */}
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                    maxWidth: "280px",
                  }}
                >
                  {students.slice(0, 4).map((student) => (
                    <motion.div
                      key={student.id}
                      whileHover={{ scale: 1.05 }}
                      style={{
                        width: "130px",
                        height: "100px",
                        borderRadius: "12px",
                        backgroundColor: "#374151",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        border: student.handRaised ? `2px solid ${warningColor}` : "2px solid transparent",
                      }}
                    >
                      {student.isVideoOn ? (
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: primaryColor,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          {student.avatar}
                        </div>
                      ) : (
                        <span style={{ fontSize: "24px" }}>📹</span>
                      )}

                      <div
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "6px",
                          right: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "4px 8px",
                          backgroundColor: "rgba(0,0,0,0.7)",
                          borderRadius: "6px",
                        }}
                      >
                        <span style={{ fontSize: "11px", color: "white", fontWeight: 500 }}>
                          {student.name.split(" ")[0]}
                        </span>
                        {student.isMuted && (
                          <span style={{ fontSize: "12px" }}>🔇</span>
                        )}
                      </div>

                      {student.handRaised && (
                        <div
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            fontSize: "16px",
                          }}
                        >
                          ✋
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Control Bar */}
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Audio Control */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                backgroundColor: isMuted ? errorColor : "rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? "🔇" : "🎤"}
            </motion.button>

            {/* Video Control */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoOn(!isVideoOn)}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                backgroundColor: !isVideoOn ? errorColor : "rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
              aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
            >
              {isVideoOn ? "📹" : "📵"}
            </motion.button>

            {/* Screen Share */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsScreenSharing(!isScreenSharing)
                setShowWhiteboard(false)
                onToggleScreen?.()
              }}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                backgroundColor: isScreenSharing ? successColor : "rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
              aria-label={isScreenSharing ? "Stop sharing" : "Share screen"}
            >
              🖥️
            </motion.button>

            {/* Whiteboard */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowWhiteboard(!showWhiteboard)
                setIsScreenSharing(false)
              }}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                backgroundColor: showWhiteboard ? successColor : "rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
              aria-label={showWhiteboard ? "Close whiteboard" : "Open whiteboard"}
            >
              ✏️
            </motion.button>

            <div style={{ width: "1px", height: "40px", backgroundColor: "rgba(255,255,255,0.2)" }} />

            {/* Recording */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onToggleRecording}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                backgroundColor: isRecording ? errorColor : "rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              ⏺️
            </motion.button>

            {/* More Options */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
              aria-label="More options"
            >
              ⚙️
            </motion.button>
          </div>
        </div>

        {/* Right Sidebar */}
        {activePanel !== "none" && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            style={{
              width: "380px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid #E5E7EB",
            }}
          >
            {/* Panel Tabs */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #E5E7EB",
                backgroundColor: "#F9FAFB",
              }}
            >
              {(["chat", "students", "polls"] as const).map((panel) => (
                <button
                  key={panel}
                  onClick={() => setActivePanel(panel)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    border: "none",
                    backgroundColor: "transparent",
                    color: activePanel === panel ? primaryColor : "#6B7280",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    borderBottom: activePanel === panel ? `2px solid ${primaryColor}` : "none",
                    textTransform: "capitalize",
                  }}
                  aria-label={`${panel} panel`}
                  aria-selected={activePanel === panel}
                >
                  {panel}
                </button>
              ))}
              <button
                onClick={() => setActivePanel("none")}
                style={{
                  width: 48,
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            {/* Panel Content */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {activePanel === "chat" && (
                <>
                  <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          marginBottom: "16px",
                          display: "flex",
                          gap: "12px",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundColor: msg.isTeacher ? primaryColor : "#E5E7EB",
                            color: msg.isTeacher ? "white" : "#374151",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {msg.senderName[0]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
                              {msg.senderName}
                            </span>
                            <span style={{ fontSize: "12px", color: "#9CA3AF" }}>
                              {msg.timestamp}
                            </span>
                          </div>
                          <p style={{ fontSize: "14px", color: "#374151", margin: 0 }}>
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "16px", borderTop: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                        }}
                        aria-label="Chat message"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!chatMessage.trim()}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: !chatMessage.trim() ? "#E5E7EB" : primaryColor,
                          color: "white",
                          cursor: !chatMessage.trim() ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                        }}
                        aria-label="Send message"
                      >
                        ➤
                      </motion.button>
                    </div>
                  </div>
                </>
              )}

              {activePanel === "students" && (
                <div style={{ overflowY: "auto", padding: "16px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
                      {students.filter((s) => s.isOnline).length} of {students.length} present
                    </p>
                  </div>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {students.map((student) => (
                      <div
                        key={student.id}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          backgroundColor: "#F9FAFB",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            backgroundColor: primaryColor,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                        >
                          {student.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
                            {student.name}
                          </p>
                          <p style={{ fontSize: "12px", color: "#6B7280", margin: "2px 0 0 0" }}>
                            Joined {student.joinedAt}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {student.handRaised && <span style={{ fontSize: "18px" }}>✋</span>}
                          {student.isMuted && <span style={{ fontSize: "18px" }}>🔇</span>}
                          {!student.isVideoOn && <span style={{ fontSize: "18px" }}>📵</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "polls" && (
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                    No Active Polls
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "20px" }}>
                    Create a poll to engage your students
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: primaryColor,
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Create Poll
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Panel Toggle Buttons (when panel is closed) */}
        {activePanel === "none" && (
          <div
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {(["chat", "students", "polls"] as const).map((panel) => (
              <motion.button
                key={panel}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePanel(panel)}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
                aria-label={`Open ${panel} panel`}
              >
                {panel === "chat" && "💬"}
                {panel === "students" && "👥"}
                {panel === "polls" && "📊"}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* End Class Modal */}
      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowEndModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px",
                maxWidth: "480px",
                width: "90%",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
                End Class Session?
              </h2>
              <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "24px" }}>
                This will end the class for all {studentCount} participants. They will be disconnected
                immediately.
              </p>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#F9FAFB",
                    cursor: "pointer",
                  }}
                >
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18 }} />
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    Save recording ({sessionDuration})
                  </span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEndModal(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "white",
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onEndClass?.()
                    setShowEndModal(false)
                  }}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: errorColor,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  End Class
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
}

// Framer property controls
addPropertyControls(Screen22_OnlineClassLive, {
  className: {
    type: ControlType.String,
    title: "Class Name",
    defaultValue: "Class 10 Math - Batch A",
  },
  sessionDuration: {
    type: ControlType.String,
    title: "Session Duration",
    defaultValue: "00:42:15",
  },
  studentCount: {
    type: ControlType.Number,
    title: "Student Count",
    defaultValue: 24,
    min: 0,
    step: 1,
  },
  isRecording: {
    type: ControlType.Boolean,
    title: "Is Recording",
    defaultValue: true,
  },
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
    title: "Background Color",
    defaultValue: "#1F2937",
  },
})

export default Screen22_OnlineClassLive
