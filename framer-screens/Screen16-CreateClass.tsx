/**
 * SCREEN 16 - CREATE CLASS
 *
 * Teacher Management App - Create Class Flow
 * Full production-ready component with all sections A-I
 *
 * Design System:
 * - Primary: #5B47FB
 * - Success: #10B981
 * - Error: #EF4444
 * - Background: #F9FAFB
 * - Font: Inter
 * - Mobile: 390×844px
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================

interface ClassFormData {
  className: string;
  classType: 'K12' | 'JEE' | 'NEET' | 'Foundation' | 'Skill' | 'Custom';
  gradeLevel: string;
  subjects: string[];
  teachingMode: 'Online' | 'Offline' | 'Hybrid';
  location?: string;
  room?: string;
  meetingLink?: string;
  languages: string[];
  sessions: ClassSession[];
  admissionMode: 'Manual' | 'JoinCode' | 'Institute';
  joinCode?: string;
  coTeachers: CoTeacher[];
  coverImage?: string;
  themeColor: string;
  settings: ClassSettings;
}

interface ClassSession {
  id: string;
  days: string[];
  startTime: string;
  endTime: string;
  repeat: boolean;
  location: string;
  room?: string;
}

interface CoTeacher {
  id: string;
  name: string;
  role: 'Primary' | 'Assistant' | 'Observer';
  avatar?: string;
}

interface ClassSettings {
  allowChat: boolean;
  allowFileUploads: boolean;
  allowStudentReplies: boolean;
  aiHomework: boolean;
  attendanceReminders: boolean;
  autoRecord: boolean;
}

// ==================== CONSTANTS ====================

const SUBJECTS = [
  'Math', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Science', 'Commerce'
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const THEME_COLORS = [
  { name: 'Blue', value: '#5B47FB' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
];

// ==================== MAIN COMPONENT ====================

export default function CreateClassScreen() {
  const [formData, setFormData] = useState<ClassFormData>({
    className: '',
    classType: 'K12',
    gradeLevel: '',
    subjects: [],
    teachingMode: 'Online',
    languages: ['English'],
    sessions: [],
    admissionMode: 'Manual',
    coTeachers: [],
    themeColor: '#5B47FB',
    settings: {
      allowChat: true,
      allowFileUploads: true,
      allowStudentReplies: false,
      aiHomework: false,
      attendanceReminders: true,
      autoRecord: false,
    },
  });

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid =
    formData.className.length > 0 &&
    formData.subjects.length > 0 &&
    formData.sessions.length > 0;

  const handleSave = async () => {
    if (!isFormValid) return;

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setShowSuccess(true);

    setTimeout(() => {
      // Navigate to class dashboard
      console.log('Navigate to class dashboard');
    }, 1500);
  };

  return (
    <div style={styles.container}>
      {/* ==================== HEADER ==================== */}
      <motion.header
        style={styles.header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button style={styles.closeButton} aria-label="Close">
          <CloseIcon />
        </button>
        <h1 style={styles.headerTitle}>Create Class</h1>
        <motion.button
          style={{
            ...styles.saveButton,
            opacity: isFormValid ? 1 : 0.5,
            cursor: isFormValid ? 'pointer' : 'not-allowed',
          }}
          disabled={!isFormValid}
          onClick={handleSave}
          whileTap={isFormValid ? { scale: 0.95 } : {}}
        >
          {isSaving ? <Spinner /> : 'Save'}
        </motion.button>
      </motion.header>

      {/* ==================== SCROLLABLE CONTENT ==================== */}
      <div style={styles.scrollContainer}>

        {/* SECTION A: Basic Information */}
        <FormSection title="Class Information" icon="📚">
          <InputField
            label="Class / Batch Name"
            placeholder="e.g., Class 10 Math — Batch A"
            value={formData.className}
            onChange={(value) => setFormData({ ...formData, className: value })}
            required
            helperText="Students and parents will see this name."
            maxLength={80}
          />

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Class Type</label>
            <SegmentedControl
              options={['K12', 'JEE', 'NEET', 'Foundation']}
              value={formData.classType}
              onChange={(value) => setFormData({ ...formData, classType: value as any })}
            />
          </div>

          <SelectField
            label="Grade Level"
            value={formData.gradeLevel}
            onChange={(value) => setFormData({ ...formData, gradeLevel: value })}
            options={['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']}
            required
          />

          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Subjects <span style={styles.required}>*</span>
            </label>
            <ChipSelector
              options={SUBJECTS}
              selected={formData.subjects}
              onChange={(subjects) => setFormData({ ...formData, subjects })}
              allowCustom
            />
          </div>
        </FormSection>

        {/* SECTION B: Teaching Mode & Location */}
        <FormSection title="Teaching Mode & Location" icon="🎓">
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mode</label>
            <ModeSelector
              value={formData.teachingMode}
              onChange={(mode) => setFormData({ ...formData, teachingMode: mode })}
            />
          </div>

          {(formData.teachingMode === 'Offline' || formData.teachingMode === 'Hybrid') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <InputField
                label="Location"
                placeholder="Enter location"
                value={formData.location || ''}
                onChange={(value) => setFormData({ ...formData, location: value })}
              />
              <InputField
                label="Room / Area"
                placeholder="Room number"
                value={formData.room || ''}
                onChange={(value) => setFormData({ ...formData, room: value })}
              />
            </motion.div>
          )}

          {(formData.teachingMode === 'Online' || formData.teachingMode === 'Hybrid') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <InputField
                label="Meeting Link"
                placeholder="Auto-generate or enter custom link"
                value={formData.meetingLink || ''}
                onChange={(value) => setFormData({ ...formData, meetingLink: value })}
              />
            </motion.div>
          )}
        </FormSection>

        {/* SECTION C: Teaching Languages */}
        <FormSection title="Teaching Languages" icon="🌐">
          <ChipSelector
            options={['English', 'Hindi', 'Hinglish', 'Other']}
            selected={formData.languages}
            onChange={(languages) => setFormData({ ...formData, languages })}
            multiSelect
          />
        </FormSection>

        {/* SECTION D: Schedule Setup */}
        <FormSection title="Schedule Setup" icon="📅">
          <div style={styles.sessionsContainer}>
            {formData.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={() => {}}
                onDelete={(id) => {
                  setFormData({
                    ...formData,
                    sessions: formData.sessions.filter(s => s.id !== id)
                  });
                }}
              />
            ))}
          </div>

          <motion.button
            style={styles.addSessionButton}
            onClick={() => setShowSessionModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span style={styles.addIcon}>+</span>
            Add Session
          </motion.button>

          {formData.sessions.length === 0 && (
            <p style={styles.helperText}>
              Add at least one class session to build your timetable.
            </p>
          )}
        </FormSection>

        {/* SECTION E: Student Admission Mode */}
        <FormSection title="Student Admission" icon="👥">
          <RadioGroup
            options={[
              { value: 'Manual', label: 'Add manually (teacher adds students)' },
              { value: 'JoinCode', label: 'Allow join-code enrollment' },
              { value: 'Institute', label: 'Institute-managed enrollment' },
            ]}
            value={formData.admissionMode}
            onChange={(value) => setFormData({ ...formData, admissionMode: value as any })}
          />

          {formData.admissionMode === 'JoinCode' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              style={styles.joinCodeCard}
            >
              <div style={styles.joinCodeContent}>
                <span style={styles.joinCodeLabel}>Join Code:</span>
                <span style={styles.joinCodeValue}>
                  {formData.joinCode || generateJoinCode()}
                </span>
              </div>
              <button style={styles.regenerateButton}>Regenerate</button>
            </motion.div>
          )}
        </FormSection>

        {/* SECTION F: Co-Teachers */}
        <FormSection title="Co-Teachers (Optional)" icon="👨‍🏫">
          <div style={styles.coTeachersContainer}>
            {formData.coTeachers.map((teacher) => (
              <CoTeacherChip
                key={teacher.id}
                teacher={teacher}
                onRemove={(id) => {
                  setFormData({
                    ...formData,
                    coTeachers: formData.coTeachers.filter(t => t.id !== id)
                  });
                }}
              />
            ))}
          </div>

          <button style={styles.addButton}>
            + Add Co-Teacher
          </button>
        </FormSection>

        {/* SECTION G: Class Branding */}
        <FormSection title="Class Branding (Optional)" icon="🎨">
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Theme Color</label>
            <ColorPicker
              colors={THEME_COLORS}
              selected={formData.themeColor}
              onChange={(color) => setFormData({ ...formData, themeColor: color })}
            />
          </div>
        </FormSection>

        {/* SECTION H: Advanced Settings */}
        <FormSection title="Advanced Settings" icon="⚙️">
          <ToggleRow
            label="Allow students to chat"
            description="Enable in-class chat between students"
            value={formData.settings.allowChat}
            onChange={(value) => setFormData({
              ...formData,
              settings: { ...formData.settings, allowChat: value }
            })}
          />
          <ToggleRow
            label="Allow file uploads"
            description="Students can upload files and documents"
            value={formData.settings.allowFileUploads}
            onChange={(value) => setFormData({
              ...formData,
              settings: { ...formData.settings, allowFileUploads: value }
            })}
          />
          <ToggleRow
            label="Allow student-to-student replies"
            description="Students can reply to each other's messages"
            value={formData.settings.allowStudentReplies}
            onChange={(value) => setFormData({
              ...formData,
              settings: { ...formData.settings, allowStudentReplies: value }
            })}
          />
          <ToggleRow
            label="AI-Generated Homework Recommendations"
            description="Get AI-powered homework suggestions"
            value={formData.settings.aiHomework}
            onChange={(value) => setFormData({
              ...formData,
              settings: { ...formData.settings, aiHomework: value }
            })}
          />
          <ToggleRow
            label="Attendance auto-reminders"
            description="Automatically remind students about attendance"
            value={formData.settings.attendanceReminders}
            onChange={(value) => setFormData({
              ...formData,
              settings: { ...formData.settings, attendanceReminders: value }
            })}
          />
          <ToggleRow
            label="Auto-record sessions"
            description="Automatically record online sessions"
            value={formData.settings.autoRecord}
            onChange={(value) => setFormData({
              ...formData,
              settings: { ...formData.settings, autoRecord: value }
            })}
          />
        </FormSection>

        {/* SECTION I: Review & Create */}
        {isFormValid && (
          <FormSection title="Review & Create" icon="✅">
            <SummaryCard data={formData} />
          </FormSection>
        )}

        <div style={{ height: 80 }} /> {/* Bottom padding */}
      </div>

      {/* ==================== MODALS ==================== */}
      <AnimatePresence>
        {showSessionModal && (
          <SessionModal
            onClose={() => setShowSessionModal(false)}
            onSave={(session) => {
              setFormData({
                ...formData,
                sessions: [...formData.sessions, session]
              });
              setShowSessionModal(false);
            }}
            teachingMode={formData.teachingMode}
          />
        )}

        {showSuccess && (
          <SuccessModal message="Class created successfully!" />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.section
      style={styles.section}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div style={styles.sectionHeader}>
        <span style={styles.sectionIcon}>{icon}</span>
        <h2 style={styles.sectionTitle}>{title}</h2>
      </div>
      <div style={styles.sectionContent}>
        {children}
      </div>
    </motion.section>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  helperText,
  maxLength,
}: any) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>
        {label} {required && <span style={styles.required}>*</span>}
      </label>
      <input
        type="text"
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
      />
      {helperText && <span style={styles.helperText}>{helperText}</span>}
      {maxLength && (
        <span style={styles.characterCount}>
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }: any) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>
        {label} {required && <span style={styles.required}>*</span>}
      </label>
      <select
        style={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function SegmentedControl({ options, value, onChange }: any) {
  return (
    <div style={styles.segmentedControl}>
      {options.map((option: string) => (
        <motion.button
          key={option}
          style={{
            ...styles.segmentButton,
            ...(value === option ? styles.segmentButtonActive : {}),
          }}
          onClick={() => onChange(option)}
          whileTap={{ scale: 0.95 }}
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
}

function ChipSelector({ options, selected, onChange, allowCustom, multiSelect }: any) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleChipClick = (option: string) => {
    if (multiSelect) {
      if (selected.includes(option)) {
        onChange(selected.filter((s: string) => s !== option));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange([option]);
    }
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onChange([...selected, customValue.trim()]);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  return (
    <div style={styles.chipContainer}>
      {options.map((option: string) => (
        <motion.button
          key={option}
          style={{
            ...styles.chip,
            ...(selected.includes(option) ? styles.chipActive : {}),
          }}
          onClick={() => handleChipClick(option)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {option}
        </motion.button>
      ))}

      {allowCustom && !showCustomInput && (
        <button
          style={styles.addChipButton}
          onClick={() => setShowCustomInput(true)}
        >
          + Add new
        </button>
      )}

      {showCustomInput && (
        <div style={styles.customInputContainer}>
          <input
            type="text"
            style={styles.customInput}
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Enter custom subject"
            autoFocus
          />
          <button style={styles.addCustomButton} onClick={handleAddCustom}>Add</button>
          <button style={styles.cancelCustomButton} onClick={() => setShowCustomInput(false)}>✕</button>
        </div>
      )}
    </div>
  );
}

function ModeSelector({ value, onChange }: any) {
  const modes = [
    { value: 'Online', icon: '💻', label: 'Online' },
    { value: 'Offline', icon: '🏫', label: 'Offline' },
    { value: 'Hybrid', icon: '🔄', label: 'Hybrid' },
  ];

  return (
    <div style={styles.modeSelector}>
      {modes.map((mode) => (
        <motion.button
          key={mode.value}
          style={{
            ...styles.modeCard,
            ...(value === mode.value ? styles.modeCardActive : {}),
          }}
          onClick={() => onChange(mode.value)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span style={styles.modeIcon}>{mode.icon}</span>
          <span style={styles.modeLabel}>{mode.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

function SessionCard({ session, onEdit, onDelete }: any) {
  return (
    <motion.div
      style={styles.sessionCard}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0, x: -100 }}
      layout
    >
      <div style={styles.sessionContent}>
        <div style={styles.sessionDays}>
          {session.days.join(', ')} • {session.startTime} – {session.endTime}
        </div>
        <div style={styles.sessionLocation}>
          {session.location}{session.room && ` • Room ${session.room}`}
        </div>
      </div>
      <div style={styles.sessionActions}>
        <button style={styles.iconButton} onClick={onEdit} aria-label="Edit session">
          <EditIcon />
        </button>
        <button style={styles.iconButton} onClick={() => onDelete(session.id)} aria-label="Delete session">
          <DeleteIcon />
        </button>
      </div>
    </motion.div>
  );
}

function RadioGroup({ options, value, onChange }: any) {
  return (
    <div style={styles.radioGroup}>
      {options.map((option: any) => (
        <label key={option.value} style={styles.radioLabel}>
          <input
            type="radio"
            style={styles.radio}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span style={styles.radioText}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function CoTeacherChip({ teacher, onRemove }: any) {
  return (
    <motion.div
      style={styles.coTeacherChip}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <div style={styles.coTeacherAvatar}>{teacher.name[0]}</div>
      <div style={styles.coTeacherInfo}>
        <div style={styles.coTeacherName}>{teacher.name}</div>
        <div style={styles.coTeacherRole}>{teacher.role}</div>
      </div>
      <button
        style={styles.removeButton}
        onClick={() => onRemove(teacher.id)}
        aria-label="Remove co-teacher"
      >
        ✕
      </button>
    </motion.div>
  );
}

function ColorPicker({ colors, selected, onChange }: any) {
  return (
    <div style={styles.colorPicker}>
      {colors.map((color: any) => (
        <motion.button
          key={color.value}
          style={{
            ...styles.colorButton,
            backgroundColor: color.value,
            ...(selected === color.value ? styles.colorButtonActive : {}),
          }}
          onClick={() => onChange(color.value)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Select ${color.name} color`}
        >
          {selected === color.value && <CheckIcon />}
        </motion.button>
      ))}
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: any) {
  return (
    <div style={styles.toggleRow}>
      <div style={styles.toggleInfo}>
        <div style={styles.toggleLabel}>{label}</div>
        <div style={styles.toggleDescription}>{description}</div>
      </div>
      <motion.button
        style={{
          ...styles.toggle,
          backgroundColor: value ? '#10B981' : '#E5E7EB',
        }}
        onClick={() => onChange(!value)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          style={styles.toggleThumb}
          animate={{ x: value ? 22 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}

function SummaryCard({ data }: { data: ClassFormData }) {
  return (
    <div style={styles.summaryCard}>
      <SummaryRow label="Class Name" value={data.className} />
      <SummaryRow label="Type & Grade" value={`${data.classType} - ${data.gradeLevel}`} />
      <SummaryRow label="Subjects" value={data.subjects.join(', ')} />
      <SummaryRow label="Mode" value={data.teachingMode} />
      <SummaryRow label="Languages" value={data.languages.join(', ')} />
      <SummaryRow label="Sessions/Week" value={data.sessions.length.toString()} />
      <SummaryRow label="Admission Mode" value={data.admissionMode} />
      {data.coTeachers.length > 0 && (
        <SummaryRow label="Co-Teachers" value={data.coTeachers.map(t => t.name).join(', ')} />
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.summaryRow}>
      <span style={styles.summaryLabel}>{label}:</span>
      <span style={styles.summaryValue}>{value}</span>
    </div>
  );
}

function SessionModal({ onClose, onSave, teachingMode }: any) {
  const [sessionData, setSessionData] = useState({
    id: Date.now().toString(),
    days: [] as string[],
    startTime: '',
    endTime: '',
    repeat: true,
    location: teachingMode === 'Online' ? 'Online' : 'Offline',
    room: '',
  });

  const handleSave = () => {
    if (sessionData.days.length > 0 && sessionData.startTime && sessionData.endTime) {
      onSave(sessionData);
    }
  };

  return (
    <motion.div
      style={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={styles.modal}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Add Session</h3>
          <button style={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div style={styles.modalContent}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Days of Week</label>
            <div style={styles.daySelector}>
              {DAYS_OF_WEEK.map((day) => (
                <motion.button
                  key={day}
                  style={{
                    ...styles.dayButton,
                    ...(sessionData.days.includes(day) ? styles.dayButtonActive : {}),
                  }}
                  onClick={() => {
                    if (sessionData.days.includes(day)) {
                      setSessionData({
                        ...sessionData,
                        days: sessionData.days.filter(d => d !== day)
                      });
                    } else {
                      setSessionData({
                        ...sessionData,
                        days: [...sessionData.days, day]
                      });
                    }
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {day}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={styles.timeRow}>
            <div style={styles.timeField}>
              <label style={styles.label}>Start Time</label>
              <input
                type="time"
                style={styles.input}
                value={sessionData.startTime}
                onChange={(e) => setSessionData({ ...sessionData, startTime: e.target.value })}
              />
            </div>
            <div style={styles.timeField}>
              <label style={styles.label}>End Time</label>
              <input
                type="time"
                style={styles.input}
                value={sessionData.endTime}
                onChange={(e) => setSessionData({ ...sessionData, endTime: e.target.value })}
              />
            </div>
          </div>

          {teachingMode === 'Hybrid' && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Location</label>
              <SegmentedControl
                options={['Online', 'Offline']}
                value={sessionData.location}
                onChange={(value: string) => setSessionData({ ...sessionData, location: value })}
              />
            </div>
          )}

          {sessionData.location === 'Offline' && (
            <InputField
              label="Room Number"
              placeholder="e.g., Room 202"
              value={sessionData.room}
              onChange={(value: string) => setSessionData({ ...sessionData, room: value })}
            />
          )}
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button
            style={{
              ...styles.primaryButton,
              opacity: sessionData.days.length > 0 && sessionData.startTime && sessionData.endTime ? 1 : 0.5,
            }}
            onClick={handleSave}
            disabled={!(sessionData.days.length > 0 && sessionData.startTime && sessionData.endTime)}
          >
            Add Session
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuccessModal({ message }: { message: string }) {
  return (
    <motion.div
      style={styles.successOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={styles.successModal}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <motion.div
          style={styles.successIcon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          ✓
        </motion.div>
        <div style={styles.successMessage}>{message}</div>
      </motion.div>
    </motion.div>
  );
}

// ==================== UTILITY FUNCTIONS ====================

function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ==================== ICONS ====================

function CloseIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

function EditIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M14 2l4 4-10 10H4v-4L14 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

function DeleteIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 5h14M8 5V3h4v2M17 5v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5" stroke="currentColor" strokeWidth="2"/>
  </svg>;
}

function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
    <path d="M13.5 4L6 11.5 2.5 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

function Spinner() {
  return <div style={styles.spinner} />;
}

// ==================== STYLES ====================

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '390px',
    height: '844px',
    backgroundColor: '#F9FAFB',
    fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #E5E7EB',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },

  closeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6B7280',
  },

  headerTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  },

  saveButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#5B47FB',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },

  section: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },

  sectionIcon: {
    fontSize: '24px',
    marginRight: '12px',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  },

  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
  },

  required: {
    color: '#EF4444',
  },

  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },

  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: 'white',
    cursor: 'pointer',
  },

  helperText: {
    fontSize: '12px',
    color: '#6B7280',
  },

  characterCount: {
    fontSize: '12px',
    color: '#9CA3AF',
    textAlign: 'right',
  },

  segmentedControl: {
    display: 'flex',
    backgroundColor: '#F3F4F6',
    borderRadius: '8px',
    padding: '4px',
  },

  segmentButton: {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6B7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  segmentButtonActive: {
    backgroundColor: 'white',
    color: '#5B47FB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },

  chip: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #D1D5DB',
    backgroundColor: 'white',
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  chipActive: {
    backgroundColor: '#5B47FB',
    color: 'white',
    borderColor: '#5B47FB',
  },

  addChipButton: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px dashed #9CA3AF',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6B7280',
    cursor: 'pointer',
  },

  customInputContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    width: '100%',
  },

  customInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '14px',
  },

  addCustomButton: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#5B47FB',
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },

  cancelCustomButton: {
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
    fontSize: '14px',
    cursor: 'pointer',
  },

  modeSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },

  modeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  modeCardActive: {
    borderColor: '#5B47FB',
    backgroundColor: '#EEF2FF',
  },

  modeIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },

  modeLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
  },

  sessionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  sessionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
  },

  sessionContent: {
    flex: 1,
  },

  sessionDays: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '4px',
  },

  sessionLocation: {
    fontSize: '12px',
    color: '#6B7280',
  },

  sessionActions: {
    display: 'flex',
    gap: '8px',
  },

  iconButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6B7280',
  },

  addSessionButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px dashed #9CA3AF',
    backgroundColor: 'transparent',
    color: '#5B47FB',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  addIcon: {
    fontSize: '20px',
  },

  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },

  radio: {
    marginRight: '12px',
    cursor: 'pointer',
  },

  radioText: {
    fontSize: '14px',
    color: '#374151',
  },

  joinCodeCard: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#EEF2FF',
    border: '1px solid #C7D2FE',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  joinCodeContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  joinCodeLabel: {
    fontSize: '12px',
    color: '#6B7280',
  },

  joinCodeValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#5B47FB',
    letterSpacing: '2px',
  },

  regenerateButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#5B47FB',
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },

  coTeachersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },

  coTeacherChip: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '24px',
    backgroundColor: '#F3F4F6',
    gap: '8px',
  },

  coTeacherAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#5B47FB',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
  },

  coTeacherInfo: {
    display: 'flex',
    flexDirection: 'column',
  },

  coTeacherName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#111827',
  },

  coTeacherRole: {
    fontSize: '12px',
    color: '#6B7280',
  },

  removeButton: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#E5E7EB',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '12px',
  },

  addButton: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px dashed #9CA3AF',
    backgroundColor: 'transparent',
    color: '#5B47FB',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },

  colorPicker: {
    display: 'flex',
    gap: '12px',
  },

  colorButton: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: '2px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },

  colorButtonActive: {
    borderColor: '#111827',
    boxShadow: '0 0 0 2px white, 0 0 0 4px #111827',
  },

  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #F3F4F6',
  },

  toggleInfo: {
    flex: 1,
    marginRight: '16px',
  },

  toggleLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#111827',
    marginBottom: '4px',
  },

  toggleDescription: {
    fontSize: '12px',
    color: '#6B7280',
  },

  toggle: {
    width: '48px',
    height: '26px',
    borderRadius: '13px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    padding: '2px',
    transition: 'background-color 0.2s',
  },

  toggleThumb: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },

  summaryCard: {
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
  },

  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #E5E7EB',
  },

  summaryLabel: {
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: 500,
  },

  summaryValue: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: 600,
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  modal: {
    width: '350px',
    maxHeight: '80vh',
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #E5E7EB',
  },

  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  },

  modalClose: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '16px',
  },

  modalContent: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
  },

  daySelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
  },

  dayButton: {
    padding: '8px 4px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    backgroundColor: 'white',
    fontSize: '12px',
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
  },

  dayButtonActive: {
    backgroundColor: '#5B47FB',
    color: 'white',
    borderColor: '#5B47FB',
  },

  timeRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },

  timeField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  modalFooter: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #E5E7EB',
  },

  cancelButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  primaryButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#5B47FB',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  successOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },

  successModal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },

  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    color: 'white',
    fontSize: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },

  successMessage: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827',
  },

  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
