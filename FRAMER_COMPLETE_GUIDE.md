# Framer Complete Guide - Features, Animations & Capabilities

**Last Updated:** 2025-01-17

This comprehensive guide covers everything you need to know about Framer: the website builder, Framer Motion animations, Code Components, and advanced features.

---

## Table of Contents

1. [Framer Overview](#framer-overview)
2. [Framer Motion - Animation Library](#framer-motion---animation-library)
3. [Code Components](#code-components)
4. [Property Controls](#property-controls)
5. [Animation Patterns & Best Practices](#animation-patterns--best-practices)
6. [Advanced Features](#advanced-features)
7. [Performance Optimization](#performance-optimization)
8. [Real-World Examples](#real-world-examples)

---

## Framer Overview

### What is Framer?

**Framer** is a professional website builder and design tool that combines:
- **Visual Canvas** - Drag-and-drop interface for designing
- **Code Components** - React/TypeScript components with full code control
- **Framer Motion** - Built-in animation library
- **CMS** - Content management system
- **Publishing** - One-click deployment

### Key Capabilities

1. **No-Code + Code Hybrid** - Design visually, code when needed
2. **Real React Components** - Export and use in your codebase
3. **Interactive Prototypes** - Create fully interactive designs
4. **Responsive Design** - Automatic breakpoints and adaptive layouts
5. **Animations** - Industry-leading animation capabilities

---

## Framer Motion - Animation Library

Framer Motion is the most powerful React animation library, built into Framer.

### Core Concepts

#### 1. Motion Components

Transform any HTML/SVG element into an animatable component:

```jsx
import { motion } from "framer-motion"

// Basic motion div
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.5 }}
/>

// Works with any HTML element
<motion.button />
<motion.img />
<motion.svg />
<motion.path />
```

#### 2. Animation Props

**`animate`** - Target state for animation:
```jsx
<motion.div animate={{ opacity: 1, x: 0, scale: 1.2 }} />
```

**`initial`** - Starting state (before animation):
```jsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
/>
```

**`exit`** - State when component unmounts:
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>
```

**`transition`** - How animation behaves:
```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
    delay: 0.2
  }}
/>
```

#### 3. Hover and Tap Animations

```jsx
<motion.button
  whileHover={{
    scale: 1.05,
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  Click Me
</motion.button>
```

#### 4. Variants - Reusable Animation States

```jsx
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
}

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
/>
```

#### 5. Orchestration - Stagger Children

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Delay between each child
      delayChildren: 0.3     // Delay before first child
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants}>Item 1</motion.div>
  <motion.div variants={itemVariants}>Item 2</motion.div>
  <motion.div variants={itemVariants}>Item 3</motion.div>
</motion.div>
```

#### 6. Gestures

**Drag:**
```jsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.1, cursor: "grabbing" }}
/>
```

**Hover:**
```jsx
<motion.div
  onHoverStart={() => console.log("Hover started")}
  onHoverEnd={() => console.log("Hover ended")}
  whileHover={{ scale: 1.1 }}
/>
```

**Tap:**
```jsx
<motion.button
  onTap={() => console.log("Tapped")}
  whileTap={{ scale: 0.9 }}
/>
```

#### 7. Scroll Animations

**useScroll Hook:**
```jsx
import { motion, useScroll } from "framer-motion"

function Component() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "left"
      }}
    />
  )
}
```

**useInView Hook (Viewport Animations):**
```jsx
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

function Component() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    />
  )
}
```

#### 8. Spring Physics

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: "spring",
    stiffness: 100,   // Higher = faster
    damping: 10,      // Higher = less bouncy
    mass: 1           // Higher = heavier feel
  }}
/>
```

#### 9. Keyframes

```jsx
<motion.div
  animate={{
    scale: [1, 1.2, 1.2, 1, 1],
    rotate: [0, 0, 180, 180, 0],
    borderRadius: ["0%", "0%", "50%", "50%", "0%"]
  }}
  transition={{
    duration: 2,
    ease: "easeInOut",
    times: [0, 0.2, 0.5, 0.8, 1],  // When each keyframe hits
    repeat: Infinity,
    repeatDelay: 1
  }}
/>
```

#### 10. Path Animations (SVG)

```jsx
<motion.svg>
  <motion.path
    d="M 0 0 L 100 100"
    stroke="#000"
    strokeWidth={2}
    fill="none"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  />
</motion.svg>
```

### Transition Types

```jsx
// Spring (bouncy, natural)
transition={{ type: "spring", stiffness: 300, damping: 20 }}

// Tween (smooth, predictable)
transition={{ duration: 0.5, ease: "easeInOut" }}

// Inertia (momentum-based)
transition={{ type: "inertia", velocity: 50 }}
```

### Easing Options

- `linear`
- `easeIn`, `easeOut`, `easeInOut`
- `circIn`, `circOut`, `circInOut`
- `backIn`, `backOut`, `backInOut`
- `anticipate`
- Custom: `[0.17, 0.67, 0.83, 0.67]` (cubic bezier)

---

## Code Components

### Creating a Code Component

Code components are React/TypeScript components with Property Controls.

**Basic Structure:**
```tsx
import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

interface MyComponentProps {
  title: string
  backgroundColor: string
  style?: any
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function MyComponent(props: MyComponentProps) {
  const { title, backgroundColor } = props

  return (
    <div style={{ background: backgroundColor, padding: 20 }}>
      <h1>{title}</h1>
    </div>
  )
}

addPropertyControls(MyComponent, {
  title: {
    type: ControlType.String,
    defaultValue: "Hello World"
  },
  backgroundColor: {
    type: ControlType.Color,
    defaultValue: "#0099FF"
  }
})
```

### Layout Annotations

Must be in **block comment** immediately above component:

```tsx
/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
```

Options:
- `auto` - Component has intrinsic size (text, images)
- `fixed` - Component needs explicit width/height
- `any-prefer-fixed` - Can be auto or fixed, prefers fixed

### Detecting Sizing Mode

```tsx
function MyComponent(props) {
  const isFixedWidth = props?.style?.width === "100%"
  const isFixedHeight = props?.style?.height === "100%"

  return (
    <div style={{
      width: isFixedWidth ? "100%" : "max-content",
      height: isFixedHeight ? "100%" : "auto"
    }}>
      Content
    </div>
  )
}
```

### Server-Safe Code

Always check for browser APIs:

```tsx
function MyComponent() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth)
    }
  }, [])

  return <div>{width}</div>
}
```

### State Management

**Use `startTransition` for updates:**
```tsx
import { startTransition } from "react"

function MyComponent() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    startTransition(() => {
      setCount(count + 1)
    })
  }

  return <button onClick={handleClick}>{count}</button>
}
```

---

## Property Controls

### Complete Control Types

#### 1. Boolean
```tsx
addPropertyControls(MyComponent, {
  isActive: {
    type: ControlType.Boolean,
    defaultValue: true,
    enabledTitle: "Active",
    disabledTitle: "Inactive"
  }
})
```

#### 2. Number
```tsx
addPropertyControls(MyComponent, {
  rotation: {
    type: ControlType.Number,
    defaultValue: 0,
    min: 0,
    max: 360,
    step: 1,
    unit: "deg",
    displayStepper: true
  }
})
```

#### 3. String
```tsx
addPropertyControls(MyComponent, {
  title: {
    type: ControlType.String,
    defaultValue: "Hello",
    placeholder: "Enter text...",
    displayTextArea: false  // true for multi-line
  }
})
```

#### 4. Enum (Dropdown)
```tsx
addPropertyControls(MyComponent, {
  variant: {
    type: ControlType.Enum,
    options: ["primary", "secondary", "tertiary"],
    optionTitles: ["Primary", "Secondary", "Tertiary"],
    defaultValue: "primary",
    displaySegmentedControl: true
  }
})
```

#### 5. Color
```tsx
addPropertyControls(MyComponent, {
  backgroundColor: {
    type: ControlType.Color,
    defaultValue: "#0099FF"
  }
})
```

#### 6. ResponsiveImage
```tsx
addPropertyControls(MyComponent, {
  image: {
    type: ControlType.ResponsiveImage
  }
})

// Usage:
function MyComponent({ image }) {
  // Default image in component body
  const imgData = image || {
    src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
    alt: "Default image"
  }

  return <img src={imgData.src} alt={imgData.alt} />
}
```

#### 7. File
```tsx
addPropertyControls(MyComponent, {
  videoFile: {
    type: ControlType.File,
    allowedFileTypes: ["mp4", "webm", "mov"]
  }
})

// Default value in component:
function MyComponent(props) {
  const { videoFile = "https://framerusercontent.com/assets/default.mp4" } = props
  return <video src={videoFile} />
}
```

#### 8. Font
```tsx
addPropertyControls(MyComponent, {
  headingFont: {
    type: ControlType.Font,
    controls: "extended",  // or "basic"
    defaultFontType: "sans-serif",
    displayFontSize: true,
    displayTextAlignment: true,
    defaultValue: {
      fontSize: "32px",
      variant: "Bold",  // Font weight + style
      letterSpacing: "-0.02em",
      lineHeight: "1.2em",
      textAlign: "center"
    }
  }
})

// Usage:
function MyComponent({ headingFont }) {
  return <h1 style={headingFont}>Title</h1>
}
```

**Font Variants:**
- `Regular`, `Thin`, `Light`, `Medium`, `Semibold`, `Bold`, `Extra Bold`, `Black`
- `Italic`, `Bold Italic`, etc.

#### 9. Array
```tsx
addPropertyControls(MyComponent, {
  items: {
    type: ControlType.Array,
    control: {
      type: ControlType.String
    },
    maxCount: 10,
    defaultValue: ["Item 1", "Item 2"]
  }
})
```

**Array of Objects:**
```tsx
addPropertyControls(MyComponent, {
  cards: {
    type: ControlType.Array,
    control: {
      type: ControlType.Object,
      controls: {
        title: { type: ControlType.String, defaultValue: "Card" },
        image: { type: ControlType.ResponsiveImage },
        color: { type: ControlType.Color, defaultValue: "#0099FF" }
      }
    },
    defaultValue: [
      { title: "Card 1", color: "#0099FF" },
      { title: "Card 2", color: "#22CC66" }
    ]
  }
})
```

#### 10. Object
```tsx
addPropertyControls(MyComponent, {
  settings: {
    type: ControlType.Object,
    controls: {
      opacity: { type: ControlType.Number, defaultValue: 1 },
      color: { type: ControlType.Color, defaultValue: "#000" },
      size: { type: ControlType.Number, defaultValue: 16 }
    }
  }
})
```

#### 11. Transition
```tsx
addPropertyControls(MyComponent, {
  transition: {
    type: ControlType.Transition
  }
})

// Usage:
<motion.div
  animate={{ scale: 1.2 }}
  transition={props.transition}
/>
```

#### 12. BoxShadow
```tsx
addPropertyControls(MyComponent, {
  shadow: {
    type: ControlType.BoxShadow
  }
})

// Usage:
<div style={{ boxShadow: props.shadow }} />
```

#### 13. Link
```tsx
addPropertyControls(MyComponent, {
  url: {
    type: ControlType.Link,
    defaultValue: "https://example.com"
  }
})
```

#### 14. EventHandler
```tsx
addPropertyControls(MyComponent, {
  onTap: {
    type: ControlType.EventHandler
  }
})

// Usage:
<div onClick={props.onTap}>Click me</div>
```

### Conditional Controls (Hidden)

```tsx
addPropertyControls(MyComponent, {
  showTitle: {
    type: ControlType.Boolean,
    defaultValue: true
  },
  title: {
    type: ControlType.String,
    defaultValue: "Hello",
    hidden: (props) => !props.showTitle  // Hide when showTitle is false
  }
})
```

---

## Animation Patterns & Best Practices

### 1. Entrance Animations

**Fade In + Slide:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  Content
</motion.div>
```

**Scale In:**
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", stiffness: 200 }}
>
  Content
</motion.div>
```

### 2. Exit Animations

**Wrap with AnimatePresence:**
```jsx
import { AnimatePresence, motion } from "framer-motion"

function Component({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          Content
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 3. List Animations (Stagger)

```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.text}
    </motion.li>
  ))}
</motion.ul>
```

### 4. Hover Effects

**Lift Card:**
```jsx
<motion.div
  whileHover={{
    y: -8,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
  }}
  transition={{ type: "spring", stiffness: 300 }}
  style={{
    borderRadius: 16,
    padding: 24,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  }}
>
  Card Content
</motion.div>
```

**Button Press:**
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  style={{
    padding: "12px 24px",
    borderRadius: 8,
    background: "#0099FF",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }}
>
  Click Me
</motion.button>
```

### 5. Loading Animations

**Spinner:**
```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    repeat: Infinity,
    duration: 1,
    ease: "linear"
  }}
  style={{
    width: 40,
    height: 40,
    border: "3px solid #E5E7EB",
    borderTopColor: "#0099FF",
    borderRadius: "50%"
  }}
/>
```

**Pulse:**
```jsx
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.6, 1]
  }}
  transition={{
    repeat: Infinity,
    duration: 1.5
  }}
  style={{
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#0099FF"
  }}
/>
```

### 6. Scroll-Triggered Animations

```jsx
import { motion, useScroll, useTransform } from "framer-motion"

function ParallaxSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -200])

  return (
    <motion.div style={{ y }}>
      Parallax Content
    </motion.div>
  )
}
```

### 7. Gesture Animations

**Swipe to Delete:**
```jsx
<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 0 }}
  onDragEnd={(event, info) => {
    if (info.offset.x < -50) {
      // Delete item
    }
  }}
>
  Swipe me left
</motion.div>
```

---

## Advanced Features

### 1. Layout Animations

Animate layout changes automatically:

```jsx
<motion.div layout>
  Content that changes size/position
</motion.div>
```

**Shared Layout Animations:**
```jsx
<motion.div layoutId="unique-id">
  Content
</motion.div>

// Same layoutId in different component = smooth morph
<motion.div layoutId="unique-id">
  Different content
</motion.div>
```

### 2. useMotionValue

Create animated values without re-renders:

```jsx
import { motion, useMotionValue, useTransform } from "framer-motion"

function Component() {
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0])

  return (
    <motion.div
      drag="x"
      style={{ x, opacity }}
    >
      Drag me
    </motion.div>
  )
}
```

### 3. Custom Hooks

**useInView (Viewport Detection):**
```jsx
import { useInView } from "framer-motion"
import { useRef } from "react"

function Component() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,  // Only trigger once
    amount: 0.5  // 50% visible
  })

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "visible" : "hidden"}
    />
  )
}
```

### 4. Performance Optimization

**Use `useIsStaticRenderer`:**
```jsx
import { useIsStaticRenderer } from "framer"

function Component() {
  const isStatic = useIsStaticRenderer()

  if (isStatic) {
    return <div>Static preview</div>
  }

  return (
    <motion.div animate={{ rotate: 360 }}>
      Animated content
    </motion.div>
  )
}
```

**Optimize Animations:**
- Animate `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` CSS property sparingly
- Pause animations when not in view

### 5. SVG Animations

**Path Drawing:**
```jsx
<svg width="200" height="200">
  <motion.circle
    cx="100"
    cy="100"
    r="50"
    stroke="#0099FF"
    strokeWidth="4"
    fill="none"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2 }}
  />
</svg>
```

---

## Performance Optimization

### 1. Animation Performance Rules

✅ **DO:**
- Animate `transform` (translateX, scale, rotate)
- Animate `opacity`
- Use `will-change: transform` for complex animations
- Pause animations when not in viewport
- Use `useInView` hook

❌ **DON'T:**
- Animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Animate on scroll without throttling
- Animate too many elements simultaneously

### 2. Viewport Detection

```jsx
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

function Component() {
  const ref = useRef(null)
  const isInView = useInView(ref)

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "visible" : "hidden"}
    />
  )
}
```

### 3. Memoization

```jsx
import { useMemo, useCallback } from "react"

function Component({ items }) {
  const processedItems = useMemo(() => {
    return items.map(item => processItem(item))
  }, [items])

  const handleClick = useCallback(() => {
    console.log("Clicked")
  }, [])

  return <div onClick={handleClick}>{processedItems}</div>
}
```

---

## Real-World Examples

### 1. Card with Hover Effect

```tsx
import { motion } from "framer-motion"

export default function Card({ title, description, image }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}
    >
      <img src={image} style={{ width: "100%", height: 200, objectFit: "cover" }} />
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h3>
        <p style={{ fontSize: 14, color: "#6B7280" }}>{description}</p>
      </div>
    </motion.div>
  )
}
```

### 2. Staggered List Animation

```tsx
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export default function ListComponent({ items }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={item}
          style={{
            padding: 16,
            marginBottom: 12,
            background: "#fff",
            borderRadius: 12
          }}
        >
          {item.text}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### 3. Modal with Backdrop

```tsx
import { motion, AnimatePresence } from "framer-motion"

export default function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 999
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: 20,
              padding: 32,
              maxWidth: 500,
              zIndex: 1000
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### 4. Progress Bar

```tsx
import { motion } from "framer-motion"

export default function ProgressBar({ progress }) {
  return (
    <div style={{
      width: "100%",
      height: 8,
      background: "#E5E7EB",
      borderRadius: 4,
      overflow: "hidden"
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          height: "100%",
          background: "#0099FF"
        }}
      />
    </div>
  )
}
```

### 5. Notification Toast

```tsx
import { motion, AnimatePresence } from "framer-motion"

export default function Toast({ message, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#1F2937",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## Quick Reference

### Animation Props Cheat Sheet

```jsx
// Position
x, y, z
translateX, translateY, translateZ

// Scale
scale, scaleX, scaleY

// Rotation
rotate, rotateX, rotateY, rotateZ

// Opacity
opacity

// Size (avoid animating, use scale instead)
width, height

// Transform Origin
transformOrigin: "center" | "top left" | etc.

// SVG Specific
pathLength, pathOffset, pathSpacing
strokeWidth, strokeDasharray, strokeDashoffset

// Colors
color, backgroundColor, borderColor
```

### Transition Options

```jsx
{
  duration: 0.5,           // seconds
  delay: 0.2,             // seconds
  ease: "easeInOut",      // easing function
  type: "spring",         // "spring" | "tween" | "inertia"
  stiffness: 100,         // spring stiffness
  damping: 10,            // spring damping
  mass: 1,                // spring mass
  repeat: Infinity,       // number or Infinity
  repeatType: "loop",     // "loop" | "reverse" | "mirror"
  repeatDelay: 1          // delay between repeats
}
```

---

## Resources

- **Framer Website:** https://www.framer.com
- **Framer Motion Docs:** https://www.framer.com/motion
- **Framer Community:** https://www.framer.com/community
- **YouTube Tutorials:** Search "Framer tutorials"

---

**End of Guide** - Last updated 2025-01-17
