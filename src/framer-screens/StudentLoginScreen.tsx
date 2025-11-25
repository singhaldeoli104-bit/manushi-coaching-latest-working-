/**
 * Student Login Screen
 * Framer-ready component inspired by the reference Teacher Login UI:
 * - Light card on gray background, rounded corners, soft shadows
 * - Animated focus/press states, error shake, offline banner
 * - Password visibility toggle, caps-lock hint, remember-me toggle
 * - Optional callbacks for sign in / forgot password / sign up / continue as guest
 */

import * as React from "react"
import { motion, useAnimation } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

interface StudentLoginScreenProps {
  appName?: string
  logoUrl?: string
  primaryColor?: string
  backgroundColor?: string
  onSignIn?: (email: string, password: string) => Promise<void>
  onForgotPassword?: () => void
  onSignUp?: () => void
  onContinueAsGuest?: () => void
  style?: React.CSSProperties
}

const Icons = {
  Email: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
    </svg>
  ),
  WifiOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  CapsLock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L4 10h5v8h6v-8h5L12 2z" />
      <rect x="6" y="20" width="12" height="2" />
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
}

export default function StudentLoginScreen(props: StudentLoginScreenProps) {
  const {
    appName = "NovaLearn",
    logoUrl = "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
    primaryColor = "#5B47FB",
    backgroundColor = "#F9FAFB",
    onSignIn,
    onForgotPassword,
    onSignUp,
    onContinueAsGuest,
  } = props

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [emailFocused, setEmailFocused] = React.useState(false)
  const [passwordFocused, setPasswordFocused] = React.useState(false)
  const [isOnline, setIsOnline] = React.useState(true)
  const [capsLockOn, setCapsLockOn] = React.useState(false)

  const formControls = useAnimation()

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)

      setIsOnline(navigator.onLine)
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  const isFormValid = React.useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && isOnline
  }, [email, password, isOnline])

  const handleSignIn = React.useCallback(async () => {
    if (!isFormValid || isLoading) return

    setIsLoading(true)
    setError("")

    try {
      if (onSignIn) {
        await onSignIn(email.trim(), password)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200))
      }
    } catch (err) {
      setError("Invalid email or password")
      formControls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 },
      })
    } finally {
      setIsLoading(false)
    }
  }, [email, password, isFormValid, isLoading, onSignIn, formControls])

  const handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState && e.getModifierState("CapsLock"))
  }

  const mutedText = "#6B7280"
  const lightText = "#9CA3AF"

  return (
    <div
      style={{
        width: 390,
        height: 844,
        background: backgroundColor,
        fontFamily: "Inter, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
        ...props.style,
      }}
    >
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "#FEF3C7",
            color: "#92400E",
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            zIndex: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <Icons.WifiOff /> You are offline. Reconnect to sign in.
        </motion.div>
      )}

      <div
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "28px 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            background: "linear-gradient(135deg, #FFFFFF, #F2F4FF)",
            borderRadius: 20,
            padding: 18,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: `${primaryColor}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={logoUrl}
              alt={`${appName} logo`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: lightText, marginBottom: 2 }}>Student Portal</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>{appName}</div>
            <div style={{ fontSize: 13, color: mutedText, marginTop: 4 }}>Access classes, homework, and scores</div>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12 }}
            style={{
              padding: "6px 10px",
              borderRadius: 12,
              background: `${primaryColor}10`,
              color: primaryColor,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Student
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "#FFFFFF",
            borderRadius: 22,
            padding: 20,
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.25,
              }}
            >
              Welcome back 👋
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: mutedText }}>
              Sign in to continue learning with your classmates.
            </p>
          </div>

          <motion.div animate={formControls} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: mutedText, fontSize: 13 }}>
                <Icons.Email /> Email
              </div>
              <div
                style={{
                  position: "relative",
                  borderRadius: 12,
                  border: `1px solid ${emailFocused ? primaryColor : "#E5E7EB"}`,
                  background: "#F9FAFB",
                  padding: "12px 12px 12px 40px",
                  transition: "border-color 150ms ease",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: emailFocused ? primaryColor : lightText,
                  }}
                >
                  <Icons.User />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@studentmail.com"
                  aria-label="Email"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 15,
                    color: "#111827",
                    fontWeight: 500,
                  }}
                />
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: mutedText, fontSize: 13 }}>
                <Icons.Lock /> Password
              </div>
              <div
                style={{
                  position: "relative",
                  borderRadius: 12,
                  border: `1px solid ${passwordFocused ? primaryColor : "#E5E7EB"}`,
                  background: "#F9FAFB",
                  padding: "12px 12px 12px 40px",
                  transition: "border-color 150ms ease",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: passwordFocused ? primaryColor : lightText,
                  }}
                >
                  <Icons.Lock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onKeyUp={handlePasswordKey}
                  placeholder="Enter your password"
                  aria-label="Password"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 15,
                    color: "#111827",
                    fontWeight: 600,
                    letterSpacing: showPassword ? 0 : 0.6,
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: mutedText,
                    padding: 6,
                  }}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </motion.button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 20 }}>
                {capsLockOn && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 10px",
                      borderRadius: 10,
                      background: "#FEF3C7",
                      color: "#92400E",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <Icons.CapsLock /> Caps lock is on
                  </div>
                )}
              </div>
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setRememberMe(!rememberMe)}
                type="button"
                aria-label="Toggle remember me"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: mutedText,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1.5px solid ${rememberMe ? primaryColor : "#D1D5DB"}`,
                    background: rememberMe ? `${primaryColor}15` : "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {rememberMe && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={primaryColor} strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                Remember me
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onForgotPassword}
                type="button"
                aria-label="Forgot password"
                style={{
                  background: "transparent",
                  border: "none",
                  color: primaryColor,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot password?
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#FEF2F2",
                  color: "#B91C1C",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={isFormValid && !isLoading ? { scale: 1.01 } : {}}
              whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
              onClick={handleSignIn}
              disabled={!isFormValid || isLoading}
              aria-label="Sign in"
              style={{
                marginTop: 6,
                width: "100%",
                height: 52,
                borderRadius: 14,
                border: "none",
                background: isFormValid ? primaryColor : "#E5E7EB",
                color: isFormValid ? "#FFFFFF" : "#9CA3AF",
                fontSize: 16,
                fontWeight: 700,
                cursor: isFormValid ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: isFormValid ? `0 10px 24px ${primaryColor}33` : "none",
                transition: "background 150ms ease, transform 150ms ease",
              }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Icons.Loader />
                  </motion.div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onContinueAsGuest}
              type="button"
              aria-label="Continue as guest"
              style={{
                marginTop: 10,
                width: "100%",
                height: 48,
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                color: "#1F2937",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Continue as guest
              <Icons.ArrowRight />
            </motion.button>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 13,
                color: mutedText,
              }}
            >
              New to {appName}?{" "}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSignUp}
                type="button"
                aria-label="Create account"
                style={{
                  background: "transparent",
                  border: "none",
                  color: primaryColor,
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Create account
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{
            background: "#FFFFFF",
            borderRadius: 18,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {[
            { label: "Classes today", value: "3" },
            { label: "Homework due", value: "2" },
            { label: "Unread chats", value: "5" },
            { label: "XP earned", value: "240" },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              style={{
                padding: 12,
                borderRadius: 12,
                background: "#F9FAFB",
                border: "1px solid #EEF2FF",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 12, color: lightText, fontWeight: 600 }}>{item.label}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{item.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

addPropertyControls(StudentLoginScreen, {
  appName: {
    type: ControlType.String,
    title: "App Name",
    defaultValue: "NovaLearn",
  },
  logoUrl: {
    type: ControlType.String,
    title: "Logo URL",
    defaultValue: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
  },
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
})
