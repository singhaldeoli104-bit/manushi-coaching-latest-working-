import { motion } from "framer-motion"

export default function HomeScreen() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#F9FAFB",
        overflowY: "auto",
        padding: "16px",
        paddingBottom: "24px",
      }}
    >
      {/* WELCOME STRIP */}
      <motion.div
        style={{
          marginBottom: 20,
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            marginBottom: 4,
          }}
        >
          Good morning, Ms. Khushi 👋
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: 0,
          }}
        >
          You have 8 things to do today
        </p>
      </motion.div>

      {/* TODAY'S SNAPSHOT - 2x2 Grid */}
      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 20,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SnapshotPill
          label="Upcoming classes"
          value={3}
          color="#5B47FB"
          icon="📚"
        />
        <SnapshotPill
          label="To review"
          value={14}
          color="#F59E0B"
          icon="📝"
        />
        <SnapshotPill label="Live tests" value={1} color="#EF4444" icon="⏱️" />
        <SnapshotPill
          label="Unread chats"
          value={5}
          color="#10B981"
          icon="💬"
        />
      </motion.div>

      {/* TODAY'S TASKS STRIP */}
      <motion.div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          border: "1px solid #E5E7EB",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#111827",
              margin: 0,
            }}
          >
            Today's tasks
          </h3>
          <a
            style={{
              fontSize: 14,
              color: "#5B47FB",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            View all →
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <TaskChip label="Review Class 10A homework" count={14} />
          <TaskChip label="Create test for JEE batch" />
        </div>
      </motion.div>

      {/* UPCOMING CLASSES */}
      <motion.div
        style={{ marginBottom: 20 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            margin: 0,
            marginBottom: 12,
          }}
        >
          Upcoming classes
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ClassCard
            time="10:00 AM"
            subject="Physics"
            className="Class 11A"
            canStart={true}
          />
          <ClassCard time="2:00 PM" subject="Chemistry" className="Class 12A" />
          <ClassCard time="4:30 PM" subject="Physics" className="Grade 10" />
        </div>
      </motion.div>

      {/* PENDING REVIEWS */}
      <motion.div
        style={{ marginBottom: 20 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            margin: 0,
            marginBottom: 12,
          }}
        >
          Pending review
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ReviewCard
            type="Homework"
            title="Newton's Laws Assignment"
            className="Class 11A"
            count={14}
          />
          <ReviewCard
            type="Test"
            title="Organic Chemistry Quiz"
            className="Class 12A"
            count={23}
          />
        </div>
      </motion.div>

      {/* COMMUNICATION */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            margin: 0,
            marginBottom: 12,
          }}
        >
          Communication
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <CommTile icon="📢" label="Announcements" count={2} />
          <CommTile icon="💬" label="Class chat" count={5} />
          <CommTile icon="❓" label="Student doubts" count={3} />
        </div>
      </motion.div>
    </div>
  )
}

// Helper Components
function SnapshotPill({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: number
  color: string
  icon: string
}) {
  return (
    <motion.div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: "12px 14px",
        border: "1px solid #E5E7EB",
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.02, borderColor: color }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>
            {value}
          </div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>{label}</div>
        </div>
      </div>
    </motion.div>
  )
}

function TaskChip({ label, count }: { label: string; count?: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 14, color: "#374151" }}>{label}</span>
      {count && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#F59E0B",
            backgroundColor: "#FEF3C7",
            padding: "2px 8px",
            borderRadius: 12,
          }}
        >
          {count}
        </span>
      )}
    </div>
  )
}

function ClassCard({
  time,
  subject,
  className,
  canStart,
}: {
  time: string
  subject: string
  className: string
  canStart?: boolean
}) {
  return (
    <motion.div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        border: "1px solid #E5E7EB",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      whileHover={{ borderColor: "#5B47FB" }}
    >
      <div>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
          {time}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>
          {subject}
        </div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>{className}</div>
      </div>
      {canStart && (
        <motion.button
          style={{
            backgroundColor: "#5B47FB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
          whileHover={{ backgroundColor: "#4C3ED9" }}
          whileTap={{ scale: 0.95 }}
        >
          Start
        </motion.button>
      )}
    </motion.div>
  )
}

function ReviewCard({
  type,
  title,
  className,
  count,
}: {
  type: string
  title: string
  className: string
  count: number
}) {
  return (
    <motion.div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        border: "1px solid #E5E7EB",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
      whileHover={{ borderColor: "#F59E0B" }}
    >
      <div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#F59E0B",
            backgroundColor: "#FEF3C7",
            padding: "4px 8px",
            borderRadius: 6,
            marginRight: 8,
          }}
        >
          {type}
        </span>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#111827",
            marginTop: 8,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          {className} · {count} submissions
        </div>
      </div>
      <span style={{ fontSize: 18, color: "#9CA3AF" }}>→</span>
    </motion.div>
  )
}

function CommTile({
  icon,
  label,
  count,
}: {
  icon: string
  label: string
  count?: number
}) {
  return (
    <motion.div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        border: "1px solid #E5E7EB",
        cursor: "pointer",
        position: "relative",
      }}
      whileHover={{ scale: 1.02, borderColor: "#5B47FB" }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
        {label}
      </div>
      {count && count > 0 && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 10,
            padding: "2px 6px",
            minWidth: 20,
            textAlign: "center",
          }}
        >
          {count}
        </div>
      )}
    </motion.div>
  )
}
