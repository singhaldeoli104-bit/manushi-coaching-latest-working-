import { motion } from "framer-motion"
import * as React from "react"

/**
 * SCREEN 39: Teacher Settings & Controls (Full Settings Hub)
 *
 * Central control hub for configuring:
 * - Profile & account
 * - Notifications
 * - Class preferences
 * - Communication controls
 * - Teaching settings
 * - Privacy & safety
 * - App behavior
 *
 * @framer
 * @supportedProps width, height
 */

interface Section {
  id: string
  title: string
  icon: string
  items: SectionItem[]
}

interface SectionItem {
  id: string
  label: string
  type: "toggle" | "nav" | "select" | "text"
  value?: boolean | string
  options?: string[]
}

export default function SettingsHub(props) {
  const [sections, setSections] = React.useState<Section[]>([
    {
      id: "account",
      title: "Account & Profile",
      icon: "👤",
      items: [
        { id: "personal", label: "Personal Information", type: "nav" },
        { id: "security", label: "Login & Security", type: "nav" },
        { id: "language", label: "Language", type: "select", value: "English", options: ["English", "Hindi"] },
      ],
    },
    {
      id: "class",
      title: "Class Settings",
      icon: "📚",
      items: [
        { id: "late_hw", label: "Allow late homework submissions", type: "toggle", value: true },
        { id: "auto_grade", label: "Auto-grading for MCQs", type: "toggle", value: true },
        { id: "show_solutions", label: "Show solutions instantly", type: "toggle", value: false },
        { id: "auto_attendance", label: "Auto-mark attendance", type: "toggle", value: true },
      ],
    },
    {
      id: "notifications",
      title: "Notifications & Alerts",
      icon: "🔔",
      items: [
        { id: "push_messages", label: "New messages", type: "toggle", value: true },
        { id: "push_hw", label: "Homework submissions", type: "toggle", value: true },
        { id: "push_doubts", label: "Student doubts", type: "toggle", value: true },
        { id: "email_weekly", label: "Weekly summary email", type: "toggle", value: true },
        { id: "dnd", label: "Do Not Disturb (10 PM - 7 AM)", type: "toggle", value: false },
      ],
    },
    {
      id: "online",
      title: "Online Class Settings",
      icon: "🎥",
      items: [
        { id: "hd_video", label: "Enable HD video", type: "toggle", value: true },
        { id: "auto_mute", label: "Auto-mute students on entry", type: "toggle", value: true },
        { id: "auto_record", label: "Auto-record class", type: "toggle", value: false },
        { id: "waiting_room", label: "Enable waiting room", type: "toggle", value: true },
      ],
    },
    {
      id: "privacy",
      title: "Data & Privacy",
      icon: "🔒",
      items: [
        { id: "analytics", label: "Allow institute to access analytics", type: "toggle", value: true },
        { id: "export", label: "Download my data", type: "nav" },
        { id: "delete", label: "Delete data", type: "nav" },
      ],
    },
    {
      id: "display",
      title: "App Preferences",
      icon: "🎨",
      items: [
        { id: "theme", label: "Theme", type: "select", value: "System", options: ["Light", "Dark", "System"] },
        { id: "font_size", label: "Font Size", type: "select", value: "Medium", options: ["Small", "Medium", "Large"] },
      ],
    },
    {
      id: "help",
      title: "Support & Help",
      icon: "❓",
      items: [
        { id: "faq", label: "FAQs", type: "nav" },
        { id: "contact", label: "Contact Support", type: "nav" },
        { id: "report", label: "Report a Problem", type: "nav" },
        { id: "version", label: "Version 2.4.1", type: "text" },
      ],
    },
  ])

  const [expandedSections, setExpandedSections] = React.useState<string[]>(["account"])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  const toggleItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId && item.type === "toggle"
                  ? { ...item, value: !item.value }
                  : item
              ),
            }
          : section
      )
    )
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      console.log("Logging out...")
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          width: props.width || 390,
          height: props.height || 844,
          background: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "4px solid #E5E7EB",
              borderTop: "4px solid #5B47FB",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6B7280", fontSize: 14 }}>Loading settings...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          width: props.width || 390,
          height: props.height || 844,
          background: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 300 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
            Error Loading Settings
          </h3>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>{error}</p>
          <button
            onClick={() => setError(null)}
            style={{
              background: "#5B47FB",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: props.width || 390,
        height: props.height || 844,
        background: "#F9FAFB",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #E5E7EB",
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <button
            aria-label="Go back"
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              padding: 8,
              minWidth: 44,
              minHeight: 44,
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
            Settings & Controls
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", marginLeft: 52, margin: 0 }}>
          Configure your teaching preferences
        </p>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)

          return (
            <motion.div
              key={section.id}
              initial={false}
              style={{
                background: "white",
                marginBottom: 12,
                overflow: "hidden",
              }}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{section.icon}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>
                    {section.title}
                  </span>
                </div>
                <span style={{ fontSize: 20, color: "#6B7280" }}>
                  {isExpanded ? "−" : "+"}
                </span>
              </button>

              {/* Section Items */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ borderTop: "1px solid #E5E7EB" }}
                >
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <span style={{ fontSize: 14, color: "#374151" }}>{item.label}</span>

                      {item.type === "toggle" && (
                        <button
                          onClick={() => toggleItem(section.id, item.id)}
                          aria-label={`Toggle ${item.label}`}
                          style={{
                            width: 44,
                            height: 24,
                            background: item.value ? "#5B47FB" : "#D1D5DB",
                            border: "none",
                            borderRadius: 12,
                            position: "relative",
                            cursor: "pointer",
                            transition: "background 0.2s",
                            minWidth: 44,
                            minHeight: 44,
                            padding: 10,
                          }}
                        >
                          <motion.div
                            animate={{ x: item.value ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{
                              width: 20,
                              height: 20,
                              background: "white",
                              borderRadius: "50%",
                              position: "absolute",
                              top: 2,
                              left: 2,
                            }}
                          />
                        </button>
                      )}

                      {item.type === "nav" && (
                        <button
                          aria-label={`Navigate to ${item.label}`}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#5B47FB",
                            fontSize: 18,
                            cursor: "pointer",
                            padding: 8,
                            minWidth: 44,
                            minHeight: 44,
                          }}
                        >
                          →
                        </button>
                      )}

                      {item.type === "select" && (
                        <select
                          value={item.value as string}
                          onChange={(e) => {
                            // Handle select change
                          }}
                          style={{
                            background: "#F3F4F6",
                            border: "1px solid #D1D5DB",
                            borderRadius: 6,
                            padding: "6px 10px",
                            fontSize: 13,
                            color: "#374151",
                            cursor: "pointer",
                          }}
                        >
                          {item.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {item.type === "text" && (
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>{item.value}</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )
        })}

        {/* Logout Button */}
        <div style={{ padding: "24px 20px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "#EF4444",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "14px 20px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Property Controls for Framer
SettingsHub.displayName = "SettingsHub"
