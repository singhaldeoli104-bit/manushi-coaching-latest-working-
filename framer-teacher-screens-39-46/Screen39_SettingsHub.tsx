import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * SCREEN 39: Teacher Settings Hub
 *
 * Full settings control hub with collapsible sections:
 * - Account & Profile
 * - Notifications (push, email, SMS)
 * - Privacy & Visibility
 * - Class Settings
 * - Display & Language
 * - Help & Support
 *
 * Features:
 * - Collapsible accordion sections
 * - Toggle switches for preferences
 * - Dropdown selectors
 * - Profile card at top
 * - Logout button at bottom
 * - Smooth animations
 * - Fully accessible (44x44 touch targets, ARIA labels)
 */

interface SettingSection {
    id: string
    title: string
    icon: string
    items: SettingItem[]
}

interface SettingItem {
    id: string
    type: "toggle" | "text" | "select" | "button" | "info"
    label: string
    value?: any
    options?: string[]
    description?: string
    destructive?: boolean
}

interface SettingsHubProps {
    teacherName?: string
    teacherEmail?: string
    teacherPhone?: string
    profilePhoto?: string
    onSettingChange?: (sectionId: string, itemId: string, value: any) => void
    onLogout?: () => void
    style?: React.CSSProperties
}

export default function SettingsHub({
    teacherName = "Sarah Johnson",
    teacherEmail = "sarah.johnson@school.com",
    teacherPhone = "+1 234 567 8900",
    profilePhoto = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    onSettingChange = () => console.log("Setting changed"),
    onLogout = () => console.log("Logout clicked"),
    style
}: SettingsHubProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["account"]))
    const [settings, setSettings] = useState({
        account: {
            name: teacherName,
            email: teacherEmail,
            phone: teacherPhone,
            photo: profilePhoto
        },
        notifications: {
            push: true,
            email: true,
            sms: false,
            studentSubmissions: true,
            parentMessages: true,
            classReminders: true,
            doubtsQuestions: true
        },
        privacy: {
            profileVisibility: "students",
            contactVisibility: "parents",
            showOnlineStatus: true,
            allowDirectMessages: true
        },
        classes: {
            autoAttendance: true,
            defaultDuration: "60",
            allowLateSubmissions: true,
            autoGrading: false
        },
        display: {
            theme: "light",
            language: "English"
        }
    })

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId)
        } else {
            newExpanded.add(sectionId)
        }
        setExpandedSections(newExpanded)
    }

    const handleToggle = (sectionId: string, itemId: string) => {
        setSettings(prev => ({
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                [itemId]: !prev[sectionId][itemId]
            }
        }))
        onSettingChange(sectionId, itemId, !settings[sectionId][itemId])
    }

    const handleSelect = (sectionId: string, itemId: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                [itemId]: value
            }
        }))
        onSettingChange(sectionId, itemId, value)
    }

    const sections: SettingSection[] = [
        {
            id: "account",
            title: "Account & Profile",
            icon: "👤",
            items: [
                { id: "name", type: "info", label: "Name", value: settings.account.name },
                { id: "email", type: "info", label: "Email", value: settings.account.email },
                { id: "phone", type: "info", label: "Phone", value: settings.account.phone },
                { id: "changePassword", type: "button", label: "Change Password" },
                { id: "editProfile", type: "button", label: "Edit Profile" },
                { id: "verifyEmail", type: "button", label: "Verify Email" }
            ]
        },
        {
            id: "notifications",
            title: "Notifications",
            icon: "🔔",
            items: [
                {
                    id: "push",
                    type: "toggle",
                    label: "Push Notifications",
                    value: settings.notifications.push,
                    description: "Receive notifications on your device"
                },
                {
                    id: "email",
                    type: "toggle",
                    label: "Email Notifications",
                    value: settings.notifications.email,
                    description: "Get updates via email"
                },
                {
                    id: "sms",
                    type: "toggle",
                    label: "SMS Alerts",
                    value: settings.notifications.sms,
                    description: "Important alerts via SMS"
                },
                {
                    id: "studentSubmissions",
                    type: "toggle",
                    label: "Student Submissions",
                    value: settings.notifications.studentSubmissions,
                    description: "Notify when students submit work"
                },
                {
                    id: "parentMessages",
                    type: "toggle",
                    label: "Parent Messages",
                    value: settings.notifications.parentMessages,
                    description: "New messages from parents"
                },
                {
                    id: "classReminders",
                    type: "toggle",
                    label: "Class Reminders",
                    value: settings.notifications.classReminders,
                    description: "Upcoming class notifications"
                },
                {
                    id: "doubtsQuestions",
                    type: "toggle",
                    label: "Doubts & Questions",
                    value: settings.notifications.doubtsQuestions,
                    description: "New student questions"
                }
            ]
        },
        {
            id: "privacy",
            title: "Privacy & Visibility",
            icon: "🔒",
            items: [
                {
                    id: "profileVisibility",
                    type: "select",
                    label: "Profile Visibility",
                    value: settings.privacy.profileVisibility,
                    options: ["everyone", "students", "parents", "teachers", "private"],
                    description: "Who can see your profile"
                },
                {
                    id: "contactVisibility",
                    type: "select",
                    label: "Contact Visibility",
                    value: settings.privacy.contactVisibility,
                    options: ["everyone", "students", "parents", "private"],
                    description: "Who can see your contact info"
                },
                {
                    id: "showOnlineStatus",
                    type: "toggle",
                    label: "Show Online Status",
                    value: settings.privacy.showOnlineStatus,
                    description: "Let others see when you're online"
                },
                {
                    id: "allowDirectMessages",
                    type: "toggle",
                    label: "Allow Direct Messages",
                    value: settings.privacy.allowDirectMessages,
                    description: "Students and parents can message you"
                }
            ]
        },
        {
            id: "classes",
            title: "Class Settings",
            icon: "📚",
            items: [
                {
                    id: "autoAttendance",
                    type: "toggle",
                    label: "Auto-Attendance",
                    value: settings.classes.autoAttendance,
                    description: "Automatically mark attendance in online classes"
                },
                {
                    id: "defaultDuration",
                    type: "select",
                    label: "Default Class Duration",
                    value: settings.classes.defaultDuration,
                    options: ["30", "45", "60", "90", "120"],
                    description: "Default duration in minutes"
                },
                {
                    id: "allowLateSubmissions",
                    type: "toggle",
                    label: "Allow Late Submissions",
                    value: settings.classes.allowLateSubmissions,
                    description: "Students can submit after deadline"
                },
                {
                    id: "autoGrading",
                    type: "toggle",
                    label: "Auto-Grading",
                    value: settings.classes.autoGrading,
                    description: "Automatically grade objective questions"
                }
            ]
        },
        {
            id: "display",
            title: "Display & Language",
            icon: "🎨",
            items: [
                {
                    id: "theme",
                    type: "select",
                    label: "Theme",
                    value: settings.display.theme,
                    options: ["light", "dark", "auto"],
                    description: "App appearance"
                },
                {
                    id: "language",
                    type: "select",
                    label: "Language",
                    value: settings.display.language,
                    options: ["English", "Spanish", "French", "German", "Hindi", "Chinese"],
                    description: "Interface language"
                }
            ]
        },
        {
            id: "help",
            title: "Help & Support",
            icon: "❓",
            items: [
                { id: "faq", type: "button", label: "FAQs" },
                { id: "contact", type: "button", label: "Contact Support" },
                { id: "tutorial", type: "button", label: "Watch Tutorial" },
                { id: "feedback", type: "button", label: "Send Feedback" },
                { id: "about", type: "button", label: "About App" }
            ]
        }
    ]

    return (
        <div style={{
            width: "390px",
            minHeight: "844px",
            backgroundColor: "#F9FAFB",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            overflow: "auto",
            ...style
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid #E5E7EB",
                padding: "16px 20px",
                position: "sticky",
                top: 0,
                zIndex: 10
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    <button
                        onClick={() => console.log("Back")}
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "18px"
                        }}
                        aria-label="Go back"
                    >
                        ←
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#111827"
                        }}>
                            Settings
                        </h1>
                        <p style={{
                            margin: "2px 0 0",
                            fontSize: "13px",
                            color: "#6B7280"
                        }}>
                            Manage your preferences
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: "20px" }}>
                {/* Profile Card */}
                <div style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "20px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                }}>
                    <img
                        src={settings.account.photo}
                        alt={settings.account.name}
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#111827"
                        }}>
                            {settings.account.name}
                        </h2>
                        <p style={{
                            margin: "4px 0 0",
                            fontSize: "13px",
                            color: "#6B7280"
                        }}>
                            {settings.account.email}
                        </p>
                    </div>
                </div>

                {/* Settings Sections */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "16px",
                                border: "1px solid #E5E7EB",
                                overflow: "hidden"
                            }}
                        >
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                style={{
                                    width: "100%",
                                    padding: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    border: "none",
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                    textAlign: "left"
                                }}
                                aria-label={`Toggle ${section.title} section`}
                                aria-expanded={expandedSections.has(section.id)}
                            >
                                <span style={{ fontSize: "22px" }}>{section.icon}</span>
                                <span style={{
                                    flex: 1,
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: "#111827"
                                }}>
                                    {section.title}
                                </span>
                                <motion.span
                                    animate={{ rotate: expandedSections.has(section.id) ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ fontSize: "16px", color: "#6B7280" }}
                                >
                                    ▼
                                </motion.span>
                            </button>

                            {/* Section Content */}
                            <AnimatePresence>
                                {expandedSections.has(section.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <div style={{
                                            padding: "0 16px 16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "16px"
                                        }}>
                                            {section.items.map((item) => (
                                                <div key={item.id}>
                                                    {/* Toggle Item */}
                                                    {item.type === "toggle" && (
                                                        <div style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "flex-start",
                                                            gap: "12px"
                                                        }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 500,
                                                                    color: "#111827",
                                                                    marginBottom: "4px"
                                                                }}>
                                                                    {item.label}
                                                                </div>
                                                                {item.description && (
                                                                    <div style={{
                                                                        fontSize: "12px",
                                                                        color: "#6B7280"
                                                                    }}>
                                                                        {item.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => handleToggle(section.id, item.id)}
                                                                style={{
                                                                    width: "48px",
                                                                    height: "28px",
                                                                    borderRadius: "14px",
                                                                    border: "none",
                                                                    backgroundColor: item.value ? "#5B47FB" : "#E5E7EB",
                                                                    position: "relative",
                                                                    cursor: "pointer",
                                                                    transition: "background-color 0.2s",
                                                                    flexShrink: 0
                                                                }}
                                                                aria-label={`Toggle ${item.label}`}
                                                                aria-checked={item.value}
                                                                role="switch"
                                                            >
                                                                <motion.div
                                                                    animate={{ x: item.value ? 20 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    style={{
                                                                        width: "24px",
                                                                        height: "24px",
                                                                        borderRadius: "50%",
                                                                        backgroundColor: "#FFFFFF",
                                                                        position: "absolute",
                                                                        top: "2px",
                                                                        left: "2px"
                                                                    }}
                                                                />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Select Item */}
                                                    {item.type === "select" && (
                                                        <div>
                                                            <div style={{
                                                                fontSize: "14px",
                                                                fontWeight: 500,
                                                                color: "#111827",
                                                                marginBottom: "4px"
                                                            }}>
                                                                {item.label}
                                                            </div>
                                                            {item.description && (
                                                                <div style={{
                                                                    fontSize: "12px",
                                                                    color: "#6B7280",
                                                                    marginBottom: "8px"
                                                                }}>
                                                                    {item.description}
                                                                </div>
                                                            )}
                                                            <select
                                                                value={item.value}
                                                                onChange={(e) => handleSelect(section.id, item.id, e.target.value)}
                                                                style={{
                                                                    width: "100%",
                                                                    minHeight: "44px",
                                                                    padding: "10px 12px",
                                                                    borderRadius: "8px",
                                                                    border: "1px solid #E5E7EB",
                                                                    fontSize: "14px",
                                                                    backgroundColor: "#FFFFFF",
                                                                    cursor: "pointer"
                                                                }}
                                                                aria-label={item.label}
                                                            >
                                                                {item.options?.map(opt => (
                                                                    <option key={opt} value={opt}>
                                                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {/* Info Item */}
                                                    {item.type === "info" && (
                                                        <div style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            minHeight: "32px"
                                                        }}>
                                                            <span style={{
                                                                fontSize: "14px",
                                                                fontWeight: 500,
                                                                color: "#6B7280"
                                                            }}>
                                                                {item.label}
                                                            </span>
                                                            <span style={{
                                                                fontSize: "14px",
                                                                color: "#111827"
                                                            }}>
                                                                {item.value}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Button Item */}
                                                    {item.type === "button" && (
                                                        <button
                                                            onClick={() => console.log(item.label)}
                                                            style={{
                                                                width: "100%",
                                                                minHeight: "44px",
                                                                padding: "12px",
                                                                borderRadius: "8px",
                                                                border: "1px solid #E5E7EB",
                                                                backgroundColor: item.destructive ? "#FEE2E2" : "#FFFFFF",
                                                                color: item.destructive ? "#DC2626" : "#5B47FB",
                                                                fontSize: "14px",
                                                                fontWeight: 500,
                                                                cursor: "pointer",
                                                                textAlign: "center"
                                                            }}
                                                            aria-label={item.label}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    style={{
                        width: "100%",
                        minHeight: "48px",
                        padding: "14px",
                        marginTop: "20px",
                        borderRadius: "12px",
                        border: "none",
                        backgroundColor: "#DC2626",
                        color: "#FFFFFF",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                    aria-label="Logout"
                >
                    Logout
                </button>

                {/* Version Info */}
                <div style={{
                    textAlign: "center",
                    marginTop: "20px",
                    paddingBottom: "20px",
                    fontSize: "12px",
                    color: "#9CA3AF"
                }}>
                    Version 1.0.0
                </div>
            </div>
        </div>
    )
}

addPropertyControls(SettingsHub, {
    teacherName: {
        type: ControlType.String,
        title: "Teacher Name",
        defaultValue: "Sarah Johnson"
    },
    teacherEmail: {
        type: ControlType.String,
        title: "Teacher Email",
        defaultValue: "sarah.johnson@school.com"
    },
    teacherPhone: {
        type: ControlType.String,
        title: "Phone",
        defaultValue: "+1 234 567 8900"
    },
    profilePhoto: {
        type: ControlType.Image,
        title: "Profile Photo"
    }
})
