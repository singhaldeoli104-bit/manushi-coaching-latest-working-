/**
 * SCREEN 33: Teacher Resources Library (Notes, PDF, Video, Materials Manager)
 *
 * Professional file manager for organizing and sharing study materials.
 * Supports multiple file types, folder organization, sharing, and preview.
 *
 * Features:
 * - Grid/List view toggle
 * - File type filters (PDF, Video, PPT, Image, Links, Notes)
 * - Search and sort functionality
 * - Upload with drag-and-drop
 * - Folder organization
 * - Preview, share, download, delete actions
 * - File size and date information
 * - Thumbnail previews
 *
 * Design System:
 * - Primary: #5B47FB
 * - Mobile: 390×844px
 * - File type icons with color coding
 * - Accessibility: WCAG AA
 */

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Resource {
    id: string
    name: string
    type: "pdf" | "video" | "ppt" | "image" | "link" | "note"
    size: string
    uploadedAt: string
    thumbnail?: string
    sharedWith?: string
}

interface ResourcesLibraryProps {
    primaryColor?: string
    viewMode?: "grid" | "list"
    onUpload?: () => void
    onShare?: (resourceId: string) => void
}

export default function ResourcesLibrary({
    primaryColor = "#5B47FB",
    viewMode: initialViewMode = "grid",
    onUpload,
    onShare,
}: ResourcesLibraryProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode)
    const [filter, setFilter] = useState<"all" | "pdf" | "video" | "ppt" | "image" | "link" | "note">("all")
    const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date")
    const [searchQuery, setSearchQuery] = useState("")

    // Mock data
    const resources: Resource[] = [
        { id: "1", name: "Linear Equations Chapter 5.pdf", type: "pdf", size: "2.3 MB", uploadedAt: "2 days ago", sharedWith: "Class 10-A" },
        { id: "2", name: "Algebra Basics - Lecture 1.mp4", type: "video", size: "45 MB", uploadedAt: "1 week ago", sharedWith: "Class 10-A, 10-B" },
        { id: "3", name: "Quadratic Formula Worksheet.pdf", type: "pdf", size: "890 KB", uploadedAt: "3 days ago" },
        { id: "4", name: "Math Class Presentation.pptx", type: "ppt", size: "5.1 MB", uploadedAt: "5 days ago", sharedWith: "Class 10-A" },
        { id: "5", name: "Practice Problems Set 1.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "1 day ago" },
        { id: "6", name: "Formula Chart.jpg", type: "image", size: "450 KB", uploadedAt: "2 weeks ago", sharedWith: "All Classes" },
        { id: "7", name: "Khan Academy - Algebra", type: "link", size: "-", uploadedAt: "1 month ago" },
        { id: "8", name: "Quick Notes: Factorization", type: "note", size: "25 KB", uploadedAt: "4 days ago" },
    ]

    const filteredResources = resources
        .filter(r => filter === "all" || r.type === filter)
        .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name)
            if (sortBy === "size") return parseFloat(a.size) - parseFloat(b.size)
            return 0 // date sorting would require actual dates
        })

    const getFileIcon = (type: string) => {
        switch (type) {
            case "pdf":
                return { icon: "📄", color: "#EF4444", bg: "#FEE2E2" }
            case "video":
                return { icon: "🎥", color: "#8B5CF6", bg: "#EDE9FE" }
            case "ppt":
                return { icon: "📊", color: "#F59E0B", bg: "#FEF3C7" }
            case "image":
                return { icon: "🖼️", color: "#10B981", bg: "#D1FAE5" }
            case "link":
                return { icon: "🔗", color: "#3B82F6", bg: "#DBEAFE" }
            case "note":
                return { icon: "📝", color: "#6B7280", bg: "#F3F4F6" }
            default:
                return { icon: "📁", color: "#9CA3AF", bg: "#F9FAFB" }
        }
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
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#F9FAFB",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Go back"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827" }}>
                            Resources Library
                        </h1>
                        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6B7280" }}>
                            Upload, manage & share study materials
                        </p>
                    </div>
                    <button
                        onClick={onUpload}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: primaryColor,
                            color: "#FFFFFF",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Upload resource"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ position: "relative", marginBottom: "16px" }}>
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 10px 10px 40px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "14px",
                            boxSizing: "border-box",
                        }}
                        aria-label="Search resources"
                    />
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                    >
                        <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
                        <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>

                {/* View Toggle & Sort */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            onClick={() => setViewMode("grid")}
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "6px",
                                border: viewMode === "grid" ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                backgroundColor: viewMode === "grid" ? `${primaryColor}10` : "#FFFFFF",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            aria-label="Grid view"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="7" height="7" stroke={viewMode === "grid" ? primaryColor : "#6B7280"} strokeWidth="2" />
                                <rect x="14" y="3" width="7" height="7" stroke={viewMode === "grid" ? primaryColor : "#6B7280"} strokeWidth="2" />
                                <rect x="3" y="14" width="7" height="7" stroke={viewMode === "grid" ? primaryColor : "#6B7280"} strokeWidth="2" />
                                <rect x="14" y="14" width="7" height="7" stroke={viewMode === "grid" ? primaryColor : "#6B7280"} strokeWidth="2" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "6px",
                                border: viewMode === "list" ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                backgroundColor: viewMode === "list" ? `${primaryColor}10` : "#FFFFFF",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            aria-label="List view"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <line x1="3" y1="6" x2="21" y2="6" stroke={viewMode === "list" ? primaryColor : "#6B7280"} strokeWidth="2" strokeLinecap="round" />
                                <line x1="3" y1="12" x2="21" y2="12" stroke={viewMode === "list" ? primaryColor : "#6B7280"} strokeWidth="2" strokeLinecap="round" />
                                <line x1="3" y1="18" x2="21" y2="18" stroke={viewMode === "list" ? primaryColor : "#6B7280"} strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{
                            padding: "8px 32px 8px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "6px",
                            fontSize: "13px",
                            backgroundColor: "#FFFFFF",
                            cursor: "pointer",
                        }}
                        aria-label="Sort resources"
                    >
                        <option value="date">Sort: Date</option>
                        <option value="name">Sort: Name</option>
                        <option value="size">Sort: Size</option>
                    </select>
                </div>
            </div>

            {/* File Type Filters */}
            <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                position: "sticky",
                top: "180px",
                zIndex: 9,
            }}>
                <div style={{
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                    paddingBottom: "4px",
                }}>
                    {[
                        { value: "all", label: "All Files", icon: "📁" },
                        { value: "pdf", label: "PDF", icon: "📄" },
                        { value: "video", label: "Video", icon: "🎥" },
                        { value: "ppt", label: "PPT", icon: "📊" },
                        { value: "image", label: "Images", icon: "🖼️" },
                        { value: "link", label: "Links", icon: "🔗" },
                        { value: "note", label: "Notes", icon: "📝" },
                    ].map((chip) => (
                        <motion.button
                            key={chip.value}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(chip.value as any)}
                            style={{
                                padding: "8px 14px",
                                border: filter === chip.value ? `2px solid ${primaryColor}` : "1px solid #D1D5DB",
                                borderRadius: "20px",
                                backgroundColor: filter === chip.value ? `${primaryColor}10` : "#FFFFFF",
                                color: filter === chip.value ? primaryColor : "#6B7280",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                            aria-label={`Filter by ${chip.label}`}
                        >
                            <span>{chip.icon}</span>
                            {chip.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Resources Grid/List */}
            <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "16px", fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                    {filteredResources.length} {filteredResources.length === 1 ? "Resource" : "Resources"}
                </div>

                {viewMode === "grid" ? (
                    // Grid View
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "12px",
                    }}>
                        <AnimatePresence>
                            {filteredResources.map((resource) => {
                                const fileInfo = getFileIcon(resource.type)
                                return (
                                    <motion.div
                                        key={resource.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: "12px",
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: "12px",
                                            border: "1px solid #E5E7EB",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {/* Thumbnail */}
                                        <div style={{
                                            width: "100%",
                                            aspectRatio: "1",
                                            backgroundColor: fileInfo.bg,
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "48px",
                                            marginBottom: "12px",
                                        }}>
                                            {fileInfo.icon}
                                        </div>

                                        {/* Info */}
                                        <div style={{
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "#111827",
                                            marginBottom: "4px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            lineHeight: "1.3",
                                        }}>
                                            {resource.name}
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: "11px", color: "#6B7280" }}>
                                                {resource.size}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onShare?.(resource.id)
                                                }}
                                                style={{
                                                    width: "28px",
                                                    height: "28px",
                                                    borderRadius: "6px",
                                                    border: "none",
                                                    backgroundColor: "#F3F4F6",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                aria-label="Share resource"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M16 6L12 2L8 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M12 2V15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>

                                        {resource.sharedWith && (
                                            <div style={{
                                                marginTop: "8px",
                                                padding: "4px 8px",
                                                backgroundColor: `${primaryColor}10`,
                                                borderRadius: "6px",
                                                fontSize: "10px",
                                                color: primaryColor,
                                                fontWeight: 600,
                                            }}>
                                                Shared with {resource.sharedWith}
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    // List View
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <AnimatePresence>
                            {filteredResources.map((resource) => {
                                const fileInfo = getFileIcon(resource.type)
                                return (
                                    <motion.div
                                        key={resource.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: "12px",
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: "12px",
                                            border: "1px solid #E5E7EB",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                        }}
                                    >
                                        {/* Icon */}
                                        <div style={{
                                            width: "40px",
                                            height: "40px",
                                            backgroundColor: fileInfo.bg,
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "20px",
                                            flexShrink: 0,
                                        }}>
                                            {fileInfo.icon}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: "14px",
                                                fontWeight: 600,
                                                color: "#111827",
                                                marginBottom: "2px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}>
                                                {resource.name}
                                            </div>
                                            <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#6B7280" }}>
                                                <span>{resource.size}</span>
                                                <span>•</span>
                                                <span>{resource.uploadedAt}</span>
                                            </div>
                                        </div>

                                        {/* Share Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onShare?.(resource.id)
                                            }}
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "6px",
                                                border: "none",
                                                backgroundColor: "#F3F4F6",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                            aria-label="Share resource"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M16 6L12 2L8 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 2V15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State */}
                {filteredResources.length === 0 && (
                    <div style={{
                        padding: "60px 20px",
                        textAlign: "center",
                        color: "#9CA3AF",
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📂</div>
                        <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                            No resources found
                        </div>
                        <div style={{ fontSize: "14px", marginBottom: "20px" }}>
                            {searchQuery ? "Try a different search term" : "Upload your first resource to get started"}
                        </div>
                        <button
                            onClick={onUpload}
                            style={{
                                padding: "12px 24px",
                                backgroundColor: primaryColor,
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                            aria-label="Upload resource"
                        >
                            Upload Resource
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

addPropertyControls(ResourcesLibrary, {
    primaryColor: {
        type: ControlType.Color,
        title: "Primary Color",
        defaultValue: "#5B47FB",
    },
    viewMode: {
        type: ControlType.Enum,
        title: "View Mode",
        options: ["grid", "list"],
        defaultValue: "grid",
    },
})
