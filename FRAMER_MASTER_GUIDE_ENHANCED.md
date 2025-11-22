# Framer Master Guide - Complete Deep Dive
## Advanced Features, Animations, Production Patterns & Architecture

**Version:** 2.0 Enhanced
**Last Updated:** 2025-01-17
**Level:** Beginner to Expert

---

## 📑 Table of Contents

### Part 1: Fundamentals
1. [Framer Ecosystem Overview](#1-framer-ecosystem-overview)
2. [Framer Motion Core Concepts](#2-framer-motion-core-concepts)
3. [Code Components Deep Dive](#3-code-components-deep-dive)

### Part 2: Advanced Animation
4. [Advanced Animation Hooks](#4-advanced-animation-hooks)
5. [Complex Orchestration Patterns](#5-complex-orchestration-patterns)
6. [3D Transforms & Perspective](#6-3d-transforms--perspective)
7. [Timeline & Sequence Animations](#7-timeline--sequence-animations)

### Part 3: Advanced Features
8. [Advanced Gestures & Interactions](#8-advanced-gestures--interactions)
9. [Scroll Animations Mastery](#9-scroll-animations-mastery)
10. [Layout Animations & Shared Layouts](#10-layout-animations--shared-layouts)
11. [SVG & Path Animations](#11-svg--path-animations)

### Part 4: Production
12. [Performance Optimization Techniques](#12-performance-optimization-techniques)
13. [Production Architecture Patterns](#13-production-architecture-patterns)
14. [Advanced Property Controls](#14-advanced-property-controls)
15. [Component Composition Patterns](#15-component-composition-patterns)

### Part 5: Integration & Advanced Topics
16. [State Machines for Animations](#16-state-machines-for-animations)
17. [Integration with External Libraries](#17-integration-with-external-libraries)
18. [Advanced TypeScript Patterns](#18-advanced-typescript-patterns)
19. [Testing Animated Components](#19-testing-animated-components)
20. [Real-World Production Examples](#20-real-world-production-examples)

---

## 1. Framer Ecosystem Overview

### What is Framer?

**Framer** is a comprehensive web design and development platform with three major components:

#### 1.1 Framer (The Platform)
- **Visual Design Tool** - Professional website builder
- **Code Components** - React/TypeScript integration
- **CMS** - Headless content management
- **Hosting & Deployment** - Automatic CDN distribution
- **Collaboration** - Real-time team features

#### 1.2 Framer Motion (Animation Library)
- **Production-Ready** - Used by Apple, Netflix, Google
- **Declarative API** - Write animations in JSX
- **Performance** - GPU-accelerated, 60fps
- **TypeScript** - Full type safety
- **Bundle Size** - ~30KB gzipped

#### 1.3 Key Differentiators

| Feature | Framer | Webflow | Figma |
|---------|--------|---------|-------|
| React Code Components | ✅ Yes | ❌ No | ❌ No |
| Framer Motion Built-in | ✅ Yes | ❌ No | ❌ No |
| Export React Code | ✅ Yes | ❌ No | ⚠️ Limited |
| TypeScript Support | ✅ Full | ❌ No | ❌ No |
| Animation Capabilities | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

---

## 2. Framer Motion Core Concepts

### 2.1 Motion Components

Every HTML/SVG element can become animated:

```tsx
import { motion } from "framer-motion"

// Transform any element
<motion.div />
<motion.button />
<motion.svg />
<motion.path />
<motion.img />
<motion.section />

// Custom components
const MotionBox = motion(CustomComponent)
```

### 2.2 Animation Props Hierarchy

**Understanding execution order:**

```tsx
<motion.div
  // 1. Initial state (on mount)
  initial={{ opacity: 0, x: -100 }}

  // 2. Animate to this state
  animate={{ opacity: 1, x: 0 }}

  // 3. On unmount (requires AnimatePresence)
  exit={{ opacity: 0, x: 100 }}

  // 4. During hover
  whileHover={{ scale: 1.1 }}

  // 5. During tap/click
  whileTap={{ scale: 0.95 }}

  // 6. While dragging
  whileDrag={{ scale: 1.05 }}

  // 7. While in viewport
  whileInView={{ opacity: 1 }}

  // 8. Transition configuration
  transition={{ duration: 0.5 }}
/>
```

### 2.3 Variants System

**Variants** are named animation states that can be reused:

```tsx
const variants = {
  // State names can be anything
  closed: {
    opacity: 0,
    x: -300,
    transition: {
      duration: 0.3
    }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      type: "spring"
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  }
}

// Apply variants
<motion.div
  variants={variants}
  initial="closed"
  animate="open"
  whileHover="hover"
/>
```

**Variant Propagation** - Parent variants automatically apply to children:

```tsx
const list = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

<motion.ul variants={list} initial="hidden" animate="visible">
  {/* Children automatically inherit parent variant state */}
  <motion.li variants={item} />
  <motion.li variants={item} />
  <motion.li variants={item} />
</motion.ul>
```

---

## 3. Code Components Deep Dive

### 3.1 Component Architecture

**Mandatory Structure:**

```tsx
// File: MyComponent.tsx
import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import { useState, useEffect, useMemo, useCallback, startTransition } from "react"

// TypeScript interface for props
interface MyComponentProps {
  title: string
  count: number
  onAction?: () => void
  style?: React.CSSProperties
}

/**
 * Component description for Framer UI
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 400
 * @framerIntrinsicHeight 300
 */
export default function MyComponent(props: MyComponentProps) {
  const { title, count, onAction } = props

  // State must use startTransition
  const [value, setValue] = useState(0)

  const handleClick = () => {
    startTransition(() => {
      setValue(prev => prev + 1)
    })
    onAction?.()
  }

  return (
    <motion.div
      style={props.style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {title}: {count} - {value}
      <button onClick={handleClick}>Click</button>
    </motion.div>
  )
}

// Property controls (mandatory)
addPropertyControls(MyComponent, {
  title: {
    type: ControlType.String,
    defaultValue: "Counter"
  },
  count: {
    type: ControlType.Number,
    defaultValue: 0,
    min: 0,
    max: 100
  },
  onAction: {
    type: ControlType.EventHandler
  }
})
```

### 3.2 Layout Modes Explained

```tsx
/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 * Use for: Text, logos, icons with intrinsic size
 */

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * Use for: Canvas, charts, complex layouts needing explicit size
 */

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * Use for: Flexible components that work both ways
 */
```

**Detecting Layout Mode:**

```tsx
function ResponsiveComponent(props) {
  const isFixedWidth = props?.style?.width === "100%"
  const isFixedHeight = props?.style?.height === "100%"

  return (
    <div style={{
      width: isFixedWidth ? "100%" : "max-content",
      height: isFixedHeight ? "100%" : "fit-content",
      minWidth: !isFixedWidth ? "max-content" : undefined
    }}>
      Content adapts to layout mode
    </div>
  )
}
```

### 3.3 Server-Side Rendering (SSR) Safe Code

**Always guard browser APIs:**

```tsx
function BrowserSafeComponent() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // SSR-safe check
    if (typeof window === "undefined") return

    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return <div>{windowSize.width} x {windowSize.height}</div>
}
```

---

## 4. Advanced Animation Hooks

### 4.1 useMotionValue

Create animated values that **don't trigger re-renders**:

```tsx
import { useMotionValue, useTransform, motion } from "framer-motion"

function DragCard() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Transform values without re-rendering
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])

  return (
    <motion.div
      drag
      style={{ x, y, rotateX, rotateY, opacity }}
      dragElastic={0.2}
    />
  )
}
```

### 4.2 useSpring

Create **spring-based animated values**:

```tsx
import { useSpring, useMotionValue, motion } from "framer-motion"

function SmoothCursor() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  // Spring follows cursor with physics
  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 })
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    window.addEventListener("mousemove", updateCursor)
    return () => window.removeEventListener("mousemove", updateCursor)
  }, [])

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        position: "fixed",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "#0099FF",
        pointerEvents: "none"
      }}
    />
  )
}
```

### 4.3 useScroll (Advanced)

```tsx
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

function AdvancedScrollEffects() {
  const ref = useRef(null)

  const { scrollYProgress, scrollY } = useScroll({
    target: ref,
    offset: ["start end", "end start"]  // When to start/end
  })

  // Multiple transforms from same scroll value
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y, rotate }}
    />
  )
}
```

### 4.4 useVelocity

Track **velocity** of animated values:

```tsx
import { useMotionValue, useVelocity, useTransform, motion } from "framer-motion"

function VelocityIndicator() {
  const x = useMotionValue(0)
  const xVelocity = useVelocity(x)

  // Scale based on velocity
  const scale = useTransform(
    xVelocity,
    [-1000, 0, 1000],
    [1.5, 1, 1.5]
  )

  return (
    <motion.div
      drag="x"
      style={{ x, scale }}
    />
  )
}
```

### 4.5 useTime

Create **time-based animations**:

```tsx
import { useTime, useTransform, motion } from "framer-motion"

function RotatingClock() {
  const time = useTime()
  const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false })

  return (
    <motion.div
      style={{ rotate }}
    />
  )
}
```

### 4.6 useAnimationFrame

Run **custom animation logic** every frame:

```tsx
import { useAnimationFrame } from "framer-motion"
import { useRef } from "react"

function CustomPhysics() {
  const ref = useRef<HTMLDivElement>(null)
  const velocity = useRef(0)
  const position = useRef(0)

  useAnimationFrame((time, delta) => {
    if (!ref.current) return

    // Custom physics
    velocity.current += -position.current * 0.01 - velocity.current * 0.1
    position.current += velocity.current

    ref.current.style.transform = `translateY(${position.current}px)`
  })

  return <div ref={ref}>Custom physics</div>
}
```

---

## 5. Complex Orchestration Patterns

### 5.1 Stagger with Different Directions

```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Stagger from different starting points
      staggerChildren: 0.1,
      staggerDirection: 1,  // 1 = forward, -1 = reverse
      delayChildren: 0.3,
      when: "beforeChildren"  // or "afterChildren"
    }
  }
}

const item = {
  hidden: (custom: number) => ({
    opacity: 0,
    x: custom * 50  // Custom direction per item
  }),
  visible: {
    opacity: 1,
    x: 0
  }
}

<motion.div variants={container}>
  {items.map((item, i) => (
    <motion.div
      key={i}
      custom={i % 2 === 0 ? 1 : -1}  // Alternating directions
      variants={item}
    />
  ))}
</motion.div>
```

### 5.2 Sequential Animations

```tsx
const sequence = {
  initial: { scale: 0, rotate: 0 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 180, 360],
    transition: {
      times: [0, 0.6, 1],
      duration: 2,
      ease: "easeInOut"
    }
  }
}

<motion.div variants={sequence} initial="initial" animate="animate" />
```

### 5.3 Dynamic Variants

```tsx
const dynamicVariants = {
  hidden: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

function Slider({ direction }) {
  return (
    <motion.div
      custom={direction}
      variants={dynamicVariants}
      initial="hidden"
      animate="visible"
    />
  )
}
```

### 5.4 Orchestration with useAnimation

**Imperative animation control:**

```tsx
import { useAnimation, motion } from "framer-motion"

function SequencedAnimation() {
  const controls = useAnimation()

  const runSequence = async () => {
    await controls.start({ x: 100, transition: { duration: 1 } })
    await controls.start({ y: 100, transition: { duration: 1 } })
    await controls.start({ x: 0, y: 0, transition: { duration: 1 } })
  }

  return (
    <>
      <motion.div animate={controls} />
      <button onClick={runSequence}>Start Sequence</button>
    </>
  )
}
```

---

## 6. 3D Transforms & Perspective

### 6.1 Perspective Setup

```tsx
<motion.div
  style={{
    perspective: 1000,  // Viewport distance
    transformStyle: "preserve-3d"
  }}
>
  <motion.div
    animate={{
      rotateY: 180,
      rotateX: 45
    }}
    style={{
      transformOrigin: "center center"
    }}
  />
</motion.div>
```

### 6.2 3D Card Flip

```tsx
function Card3D() {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          width: 300,
          height: 200,
          transformStyle: "preserve-3d",
          position: "relative"
        }}
      >
        {/* Front */}
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden"
        }}>
          Front
        </div>

        {/* Back */}
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)"
        }}>
          Back
        </div>
      </motion.div>
    </div>
  )
}
```

### 6.3 3D Carousel

```tsx
function Carousel3D({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const angleStep = 360 / items.length

  return (
    <div style={{ perspective: 1000, height: 400 }}>
      <motion.div
        animate={{
          rotateY: -activeIndex * angleStep
        }}
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          width: 200,
          height: 300
        }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              transform: `rotateY(${i * angleStep}deg) translateZ(300px)`,
              backfaceVisibility: "hidden"
            }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
```

---

## 7. Timeline & Sequence Animations

### 7.1 Timeline with useAnimation

```tsx
import { useAnimation } from "framer-motion"

function Timeline() {
  const controls1 = useAnimation()
  const controls2 = useAnimation()
  const controls3 = useAnimation()

  const playTimeline = async () => {
    // Parallel animations
    await Promise.all([
      controls1.start({ x: 100, duration: 0.5 }),
      controls2.start({ y: 100, duration: 0.5 })
    ])

    // Sequential after parallel
    await controls3.start({ scale: 1.5, duration: 0.5 })
    await controls3.start({ scale: 1, duration: 0.5 })
  }

  return (
    <>
      <motion.div animate={controls1} />
      <motion.div animate={controls2} />
      <motion.div animate={controls3} />
      <button onClick={playTimeline}>Play</button>
    </>
  )
}
```

### 7.2 Keyframe Sequences

```tsx
<motion.div
  animate={{
    x: [0, 100, 100, 0, 0],
    y: [0, 0, 100, 100, 0],
    scale: [1, 1.2, 1.2, 1.2, 1],
    rotate: [0, 0, 90, 180, 360]
  }}
  transition={{
    duration: 4,
    times: [0, 0.25, 0.5, 0.75, 1],  // When each keyframe occurs
    ease: "easeInOut",
    repeat: Infinity
  }}
/>
```

---

## 8. Advanced Gestures & Interactions

### 8.1 Advanced Drag

```tsx
<motion.div
  drag
  dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
  dragElastic={0.1}  // Elasticity outside constraints
  dragMomentum={false}  // Disable momentum
  dragTransition={{
    power: 0.3,
    timeConstant: 200,
    modifyTarget: (target) => Math.round(target / 50) * 50  // Snap to grid
  }}
  onDragStart={(event, info) => console.log(info.point.x, info.point.y)}
  onDrag={(event, info) => console.log(info.offset.x, info.offset.y)}
  onDragEnd={(event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      // Swipe detected
    }
  }}
/>
```

### 8.2 Swipe Gestures

```tsx
function SwipeCard() {
  const [exitX, setExitX] = useState(0)

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        const threshold = 100
        if (info.offset.x > threshold) {
          setExitX(300)  // Swipe right
        } else if (info.offset.x < -threshold) {
          setExitX(-300)  // Swipe left
        }
      }}
      animate={{ x: exitX }}
    />
  )
}
```

### 8.3 Pan Gestures

```tsx
<motion.div
  onPan={(event, info) => {
    console.log(info.offset.x, info.offset.y)
    console.log(info.delta.x, info.delta.y)
  }}
  onPanStart={(event, info) => console.log("Pan started")}
  onPanEnd={(event, info) => console.log("Pan ended")}
/>
```

### 8.4 Multi-Touch Gestures

```tsx
<motion.div
  drag
  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
  whileTap={{ scale: 0.95 }}
  onTapStart={(event) => {
    // Access touch points
    if (event.touches && event.touches.length > 1) {
      console.log("Multi-touch detected")
    }
  }}
/>
```

---

## 9. Scroll Animations Mastery

### 9.1 Parallax Scrolling

```tsx
import { useScroll, useTransform, motion } from "framer-motion"

function ParallaxLayers() {
  const { scrollY } = useScroll()

  const y1 = useTransform(scrollY, [0, 1000], [0, -200])  // Fast
  const y2 = useTransform(scrollY, [0, 1000], [0, -100])  // Medium
  const y3 = useTransform(scrollY, [0, 1000], [0, -50])   // Slow

  return (
    <>
      <motion.div style={{ y: y1 }}>Background</motion.div>
      <motion.div style={{ y: y2 }}>Middle</motion.div>
      <motion.div style={{ y: y3 }}>Foreground</motion.div>
    </>
  )
}
```

### 9.2 Scroll-Linked Progress Bar

```tsx
function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "#0099FF",
        transformOrigin: "left"
      }}
    />
  )
}
```

### 9.3 Element-Specific Scroll

```tsx
function ElementScroll() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
    />
  )
}
```

### 9.4 Scroll-Snap with Animation

```tsx
function ScrollSnapSections() {
  return (
    <div style={{ scrollSnapType: "y mandatory", height: "100vh", overflowY: "scroll" }}>
      {[1, 2, 3, 4].map((i) => (
        <motion.section
          key={i}
          style={{ height: "100vh", scrollSnapAlign: "start" }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
          }}
          initial={{ opacity: 0, y: 50 }}
        >
          Section {i}
        </motion.section>
      ))}
    </div>
  )
}
```

---

## 10. Layout Animations & Shared Layouts

### 10.1 Automatic Layout Animations

```tsx
function ExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      layout  // Automatically animates layout changes
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        width: isExpanded ? 400 : 200,
        height: isExpanded ? 300 : 150,
        background: "#0099FF",
        borderRadius: 16
      }}
    >
      <motion.h2 layout>Title</motion.h2>
      {isExpanded && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Content
        </motion.p>
      )}
    </motion.div>
  )
}
```

### 10.2 Shared Layout (Magic Move)

```tsx
function SharedLayoutExample() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      {/* Grid view */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={item.id}  // Same layoutId = shared layout
            onClick={() => setSelected(item)}
          >
            {item.title}
          </motion.div>
        ))}
      </div>

      {/* Detail view */}
      <AnimatePresence>
        {selected && (
          <motion.div
            layoutId={selected.id}  // Morphs from grid item
            onClick={() => setSelected(null)}
          >
            <h1>{selected.title}</h1>
            <p>{selected.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

### 10.3 Layout Groups

```tsx
import { LayoutGroup } from "framer-motion"

function LayoutGroupExample() {
  return (
    <LayoutGroup>
      <motion.div layout>Item 1</motion.div>
      <motion.div layout>Item 2</motion.div>
      <motion.div layout>Item 3</motion.div>
    </LayoutGroup>
  )
}
```

---

## 11. SVG & Path Animations

### 11.1 Path Drawing Animation

```tsx
<svg width="200" height="200">
  <motion.path
    d="M 0 100 Q 50 50 100 100 T 200 100"
    stroke="#0099FF"
    strokeWidth={4}
    fill="none"
    initial={{ pathLength: 0, pathOffset: 0 }}
    animate={{ pathLength: 1, pathOffset: 0 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  />
</svg>
```

### 11.2 Animated SVG Icon

```tsx
function AnimatedCheckmark() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <motion.circle
        cx="30"
        cy="30"
        r="28"
        stroke="#22C55E"
        strokeWidth="4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M 15 30 L 25 40 L 45 20"
        stroke="#22C55E"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
    </svg>
  )
}
```

### 11.3 Morphing Shapes

```tsx
function MorphingShape() {
  const [shape, setShape] = useState("circle")

  const pathVariants = {
    circle: {
      d: "M 100 50 A 50 50 0 1 1 100 49.9 Z"
    },
    square: {
      d: "M 50 50 L 150 50 L 150 150 L 50 150 Z"
    },
    triangle: {
      d: "M 100 50 L 150 150 L 50 150 Z"
    }
  }

  return (
    <svg width="200" height="200">
      <motion.path
        variants={pathVariants}
        animate={shape}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        fill="#0099FF"
      />
    </svg>
  )
}
```

---

## 12. Performance Optimization Techniques

### 12.1 GPU-Accelerated Properties

✅ **Fast (GPU-accelerated):**
- `transform` (translateX, translateY, scale, rotate)
- `opacity`

❌ **Slow (CPU-bound, triggers reflow):**
- `width`, `height`, `top`, `left`, `margin`, `padding`

```tsx
// ✅ GOOD - GPU accelerated
<motion.div
  animate={{
    x: 100,
    scale: 1.2,
    rotate: 45,
    opacity: 0.5
  }}
/>

// ❌ BAD - Triggers layout reflow
<motion.div
  animate={{
    width: 300,
    height: 200,
    marginLeft: 50
  }}
/>
```

### 12.2 will-change Optimization

```tsx
<motion.div
  style={{ willChange: "transform" }}
  animate={{ x: 100, rotate: 45 }}
/>

// Or use layoutId which automatically applies will-change
<motion.div layoutId="shared-element" />
```

### 12.3 Viewport-Based Animation Pausing

```tsx
import { useInView } from "framer-motion"

function OptimizedAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  return (
    <motion.div
      ref={ref}
      animate={isInView ? { rotate: 360 } : { rotate: 0 }}
      transition={{
        repeat: isInView ? Infinity : 0,
        duration: 2
      }}
    />
  )
}
```

### 12.4 Static Renderer Detection

```tsx
import { useIsStaticRenderer } from "framer"

function ConditionalAnimation() {
  const isStatic = useIsStaticRenderer()

  if (isStatic) {
    // Show static preview for canvas/thumbnail
    return <div>Static Preview</div>
  }

  // Full animation for live site
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity }}
    />
  )
}
```

### 12.5 Reduce Motion Accessibility

```tsx
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches

<motion.div
  animate={{ x: prefersReducedMotion ? 0 : 100 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
/>
```

---

## 13. Production Architecture Patterns

### 13.1 Animation Constants

```tsx
// constants/animations.ts
export const TRANSITIONS = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  },
  ease: {
    duration: 0.3,
    ease: "easeInOut"
  },
  slow: {
    duration: 0.6,
    ease: "easeOut"
  }
} as const

export const VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }
} as const

// Usage
<motion.div
  variants={VARIANTS.fadeIn}
  transition={TRANSITIONS.spring}
/>
```

### 13.2 Reusable Animation Components

```tsx
// components/AnimatedSection.tsx
export function AnimatedSection({ children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.section>
  )
}

// Usage
<AnimatedSection delay={0.2}>
  <Content />
</AnimatedSection>
```

### 13.3 Custom Hooks Pattern

```tsx
// hooks/useScrollProgress.ts
export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setProgress(Math.round(latest * 100))
    })
  }, [scrollYProgress])

  return progress
}

// Usage
function Component() {
  const progress = useScrollProgress()
  return <div>{progress}%</div>
}
```

---

## 14. Advanced Property Controls

### 14.1 Nested Object Controls

```tsx
addPropertyControls(Component, {
  card: {
    type: ControlType.Object,
    controls: {
      title: { type: ControlType.String, defaultValue: "Card" },
      color: { type: ControlType.Color, defaultValue: "#0099FF" },
      shadow: {
        type: ControlType.Object,
        controls: {
          blur: { type: ControlType.Number, defaultValue: 10 },
          spread: { type: ControlType.Number, defaultValue: 0 },
          color: { type: ControlType.Color, defaultValue: "rgba(0,0,0,0.1)" }
        }
      }
    }
  }
})
```

### 14.2 Array of Complex Objects

```tsx
addPropertyControls(Component, {
  features: {
    type: ControlType.Array,
    control: {
      type: ControlType.Object,
      controls: {
        icon: { type: ControlType.ResponsiveImage },
        title: { type: ControlType.String, defaultValue: "Feature" },
        description: { type: ControlType.String, displayTextArea: true },
        color: { type: ControlType.Color, defaultValue: "#0099FF" },
        enabled: { type: ControlType.Boolean, defaultValue: true }
      }
    },
    defaultValue: [
      { title: "Feature 1", color: "#0099FF", enabled: true },
      { title: "Feature 2", color: "#22C55E", enabled: true }
    ],
    maxCount: 10
  }
})
```

### 14.3 Conditional Property Controls

```tsx
addPropertyControls(Component, {
  layout: {
    type: ControlType.Enum,
    options: ["grid", "list", "masonry"],
    defaultValue: "grid"
  },
  columns: {
    type: ControlType.Number,
    defaultValue: 3,
    min: 1,
    max: 6,
    hidden: (props) => props.layout !== "grid"  // Only show for grid layout
  },
  gap: {
    type: ControlType.Number,
    defaultValue: 16,
    hidden: (props) => props.layout === "list"
  }
})
```

---

## 15. Component Composition Patterns

### 15.1 Compound Components

```tsx
interface TabsProps {
  children: React.ReactNode
}

interface TabProps {
  label: string
  children: React.ReactNode
}

function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <div>
        {React.Children.map(children, (child, index) => (
          <button onClick={() => setActiveTab(index)}>
            {(child as React.ReactElement<TabProps>).props.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {(React.Children.toArray(children)[activeTab] as React.ReactElement).props.children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Tab({ children }: TabProps) {
  return <div>{children}</div>
}

// Usage
<Tabs>
  <Tab label="Tab 1">Content 1</Tab>
  <Tab label="Tab 2">Content 2</Tab>
</Tabs>
```

---

## 16. State Machines for Animations

```tsx
type State = "idle" | "loading" | "success" | "error"

function StateMachineButton() {
  const [state, setState] = useState<State>("idle")

  const stateVariants = {
    idle: {
      scale: 1,
      backgroundColor: "#0099FF"
    },
    loading: {
      scale: [1, 1.05, 1],
      backgroundColor: "#6B7280",
      transition: {
        scale: {
          repeat: Infinity,
          duration: 1
        }
      }
    },
    success: {
      scale: [1, 1.2, 1],
      backgroundColor: "#22C55E",
      transition: {
        duration: 0.5
      }
    },
    error: {
      scale: [1, 1.1, 1, 1.1, 1],
      backgroundColor: "#EF4444",
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.button
      variants={stateVariants}
      animate={state}
    >
      {state}
    </motion.button>
  )
}
```

---

## 17. Integration with External Libraries

### 17.1 React Query + Framer Motion

```tsx
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"

function DataComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["data"],
    queryFn: fetchData
  })

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Loading...
        </motion.div>
      )}

      {error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Error occurred
        </motion.div>
      )}

      {data && (
        <motion.div
          key="data"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {data.map(item => <div key={item.id}>{item.name}</div>)}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## 18. Advanced TypeScript Patterns

### 18.1 Type-Safe Variants

```tsx
import { Variants } from "framer-motion"

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

// Type-safe custom prop
interface CardProps {
  variant: keyof typeof cardVariants
}

function Card({ variant }: CardProps) {
  return (
    <motion.div
      variants={cardVariants}
      animate={variant}
    />
  )
}
```

### 18.2 Generic Animation Component

```tsx
interface AnimatedProps<T> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemVariants?: Variants
}

function AnimatedList<T extends { id: string | number }>({
  data,
  renderItem,
  itemVariants
}: AnimatedProps<T>) {
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {data.map((item, index) => (
        <motion.div key={item.id} variants={itemVariants}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

---

## 19. Testing Animated Components

### 19.1 Jest + React Testing Library

```tsx
import { render, screen } from "@testing-library/react"
import { motion } from "framer-motion"

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

test("renders animated component", () => {
  render(<MyAnimatedComponent />)
  expect(screen.getByText("Content")).toBeInTheDocument()
})
```

---

## 20. Real-World Production Examples

### 20.1 Infinite Scroll Gallery

```tsx
function InfiniteGallery({ images }) {
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0, 1], [0, -1000])

  return (
    <div style={{ height: "300vh" }}>
      <motion.div
        style={{
          x,
          position: "sticky",
          top: 0,
          display: "flex",
          gap: 20
        }}
      >
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            style={{ width: 300, height: 400, objectFit: "cover" }}
          />
        ))}
      </motion.div>
    </div>
  )
}
```

### 20.2 Animated Dashboard

```tsx
function Dashboard({ widgets }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20
      }}
    >
      {widgets.map((widget, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { y: 50, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
          whileHover={{
            y: -10,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
          }}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          <h3>{widget.title}</h3>
          <p>{widget.value}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
```

---

## Quick Reference Cards

### Essential Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useMotionValue()` | Create animated value without re-renders | MotionValue |
| `useTransform()` | Transform one value to another | MotionValue |
| `useSpring()` | Spring physics value | MotionValue |
| `useScroll()` | Track scroll position | { scrollX, scrollY, scrollXProgress, scrollYProgress } |
| `useInView()` | Detect if element in viewport | boolean |
| `useAnimation()` | Imperative animation control | AnimationControls |
| `useVelocity()` | Track velocity of value | MotionValue |
| `useTime()` | Time since component mount | MotionValue |

### Performance Checklist

- ✅ Animate `transform` and `opacity` only
- ✅ Use `will-change: transform` sparingly
- ✅ Pause animations when not in viewport (`useInView`)
- ✅ Use `layout` prop for automatic layout animations
- ✅ Memoize expensive calculations with `useMemo`
- ✅ Use `useCallback` for event handlers
- ✅ Wrap state updates in `startTransition`
- ✅ Check `useIsStaticRenderer` for canvas previews
- ❌ Don't animate `width`, `height`, `top`, `left`
- ❌ Don't create new objects/functions in render

### Animation Prop Priority

1. `initial` - Starting state
2. `animate` - Target state
3. `whileHover` - During hover
4. `whileTap` - During click/tap
5. `whileDrag` - During drag
6. `whileInView` - While in viewport
7. `exit` - Unmount state (needs AnimatePresence)

---

## Resources & Learning Paths

### Official Documentation
- **Framer:** https://www.framer.com
- **Motion Dev:** https://motion.dev
- **GitHub:** https://github.com/framer/motion

### Learning Path

**Beginner (Week 1-2):**
1. Basic motion components
2. Simple animations (fade, slide, scale)
3. Hover and tap effects
4. Property controls basics

**Intermediate (Week 3-4):**
1. Variants system
2. Stagger animations
3. Scroll animations
4. Layout animations
5. SVG animations

**Advanced (Week 5-8):**
1. Advanced hooks (useMotionValue, useTransform)
2. 3D transformations
3. Complex gestures
4. Performance optimization
5. Production patterns

---

**END OF MASTER GUIDE**
*Last Updated: 2025-01-17*
*Total Sections: 20 | Pages: ~150 equivalent*
