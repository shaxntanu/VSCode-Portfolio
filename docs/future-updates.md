# Future Updates Roadmap

## Vision

The portfolio should evolve from a static developer portfolio into an interactive engineering workspace that feels like opening an actual VS Code environment used by an embedded systems engineer.

The goal is not to impress visitors with animations.

The goal is to communicate engineering depth, project complexity, and real-world experience through data-driven interfaces.

---

## Feature 1: Engineering Telemetry System

### Purpose

Create a centralized telemetry system that automatically aggregates statistics from the portfolio and displays them throughout the website.

The telemetry system should act similarly to VS Code status indicators.

Statistics should update automatically whenever project content changes.

**No hardcoded numbers should exist inside UI components.**

All metrics must be derived from source data.

### Metrics To Track

#### Projects
- Total Projects
- Completed Projects
- Active Projects
- Archived Projects

#### Embedded Systems
- ESP32 Projects
- Arduino Projects
- Sensor Integrations
- GPS Integrations
- Communication Protocols Used
  - Examples:
    - I2C
    - UART
    - SPI
    - MQTT
    - BLE
    - WiFi

#### Development
- GitHub Repository Count
- Total Stars
- Total Forks

#### Research
- Research Articles
- Technical Reports
- Papers Read
- Papers Written

#### Skills
- Languages Used
- Frameworks Used
- Hardware Platforms Used

#### Typing
- Current Monkeytype Metrics
  - WPM
  - Accuracy
  - Tests Completed

#### Experience
- Years Building Projects
- Organizations Worked With
- Open Source Contributions

### Data Architecture

Create a telemetry generator layer.

Suggested structure:
```
/src/data
  /projects
  telemetry.ts
```

All statistics should be generated from project metadata.

Example:
```typescript
project.ts
{
  title
  category
  status
  technologies
  protocols
  components
}
```

Telemetry should scan project metadata and calculate values automatically.

**Never duplicate data.**

Single source of truth principle.

### Status Bar Integration

Display selected telemetry metrics inside the VS Code bottom status bar.

Examples:
- `ESP32 Projects: 12`
- `Research: 4`
- `WPM: 118`
- `Repositories: 27`

Metrics should rotate automatically every few seconds.

Framer Motion can be used for smooth transitions.

### Dedicated Telemetry Page

Create:
```
/telemetry
```

This page should resemble a VS Code diagnostics dashboard.

Sections:
- Engineering
- Development
- Research
- Typing
- Hardware

Each section should display cards and summary statistics.

---

## Feature 2: Interactive BOM Viewer

### Purpose

Provide deep visibility into engineering projects.

Most portfolios show project screenshots.

This portfolio should expose actual engineering design decisions.

Visitors should be able to inspect hardware architecture.

### Data Model

Extend every project object.

Example:
```typescript
{
  title,
  description,
  components,
  protocols,
  architecture
}
```

`components`:
```typescript
[
  {
    name,
    role,
    interface,
    voltage,
    quantity
  }
]
```

Example:
```typescript
{
  name: "NEO-6M GPS",
  role: "Location Tracking",
  interface: "UART",
  voltage: "3.3V",
  quantity: 1
}
```

### BOM Panel UI

Create a dedicated BOM section for each project.

VS Code appearance:
```
Explorer
├── Overview
├── Architecture
├── Components (17)
└── Documentation
```

Selecting **Components** opens the BOM viewer.

### BOM Table

Columns:
- Component
- Purpose
- Protocol
- Voltage
- Quantity
- Notes

Support:
- Sorting
- Searching
- Filtering

### Component Detail Drawer

Clicking a component should open a side panel.

Display:
- Name
- Role
- Electrical Interface
- Power Requirements
- Usage in Project
- Implementation Notes
- Lessons Learned
- Optional image support

### Architecture Relationship View

Visualize component connections.

Example:
```
ESP32
├── OLED (I2C)
├── BME280 (I2C)
├── GPS (UART)
└── SD Card (SPI)
```

Tree view preferred.

Must remain lightweight.

No heavy graph libraries initially.

### Future Expansion

Potential additions:
- PCB viewer
- Schematic viewer
- KiCad exports
- Interactive pin mapping
- Power consumption analysis
- Signal flow diagrams
- Firmware module mapping

---

## Feature 3: Tabsbar Horizontal Scrolling

### Purpose

Enhance the Tabsbar component to support horizontal scrolling when multiple tabs exceed the viewport width.

Currently, tabs may overflow or wrap awkwardly. Implementing smooth horizontal scrolling with navigation controls will provide a more authentic VS Code experience and improve usability on smaller screens.

The tabsbar should feel native and responsive, matching VS Code's tab management behavior.

### Current State

The Tabsbar component (`components/Tabsbar.tsx`) displays open tabs representing different portfolio pages.

Current limitations:
- No horizontal scroll support
- Tabs may overflow on smaller viewports
- No visual indicators for overflow state
- No keyboard navigation for tab scrolling

### Requirements

#### Scroll Behavior

- **Smooth horizontal scrolling** using CSS scroll-behavior or Framer Motion
- **Auto-scroll on tab click** - Ensure active tab is always visible
- **Momentum scrolling** on touch devices (native browser behavior)
- **Keyboard support** - Arrow keys to scroll left/right

#### Navigation Controls

Add scroll buttons (optional, can be hidden on desktop):
- **Left arrow button** - Scroll tabs left
- **Right arrow button** - Scroll tabs right
- Buttons should be disabled when at scroll boundaries
- Smooth fade-in/fade-out based on scroll position

#### Visual Indicators

- **Scroll shadow** - Subtle gradient shadow on left/right edges when scrollable
- **Active tab visibility** - Automatically scroll to show active tab
- **Overflow indicator** - Visual cue that more tabs exist off-screen

#### Responsive Design

| Screen Size | Behavior |
|-------------|----------|
| Desktop (>1200px) | Scroll buttons hidden, native scrolling |
| Tablet (768-1200px) | Scroll buttons visible, smooth scrolling |
| Mobile (<768px) | Compact tabs, scroll buttons visible, smaller font |

### Implementation Architecture

#### Component Structure

```typescript
// components/Tabsbar.tsx
interface TabsbarProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

interface ScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollPosition: number;
}
```

#### Key Features

1. **Scroll Container**
   - Use `useRef` to access scroll container DOM element
   - Track scroll position with `onScroll` event listener
   - Update button states based on scroll boundaries

2. **Scroll Methods**
   ```typescript
   const scroll = (direction: 'left' | 'right', amount: number = 200) => {
     const container = scrollContainerRef.current;
     if (container) {
       container.scrollBy({
         left: direction === 'left' ? -amount : amount,
         behavior: 'smooth'
       });
     }
   };
   ```

3. **Auto-scroll Active Tab**
   ```typescript
   useEffect(() => {
     const activeTabElement = document.querySelector('[data-tab-active="true"]');
     if (activeTabElement) {
       activeTabElement.scrollIntoView({
         behavior: 'smooth',
         block: 'nearest',
         inline: 'center'
       });
     }
   }, [activeTab]);
   ```

4. **Scroll State Management**
   ```typescript
   const updateScrollState = () => {
     const container = scrollContainerRef.current;
     if (container) {
       setScrollState({
         canScrollLeft: container.scrollLeft > 0,
         canScrollRight: 
           container.scrollLeft < 
           (container.scrollWidth - container.clientWidth),
         scrollPosition: container.scrollLeft
       });
     }
   };
   ```

#### Styling

**CSS Module: `styles/Tabsbar.module.css`**

```css
.tabsContainer {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--tabsbar-bg);
  border-bottom: 1px solid var(--tabsbar-border);
}

.scrollContainer {
  flex: 1;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) transparent;
}

.scrollContainer::-webkit-scrollbar {
  height: 4px;
}

.scrollContainer::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 2px;
}

.scrollButton {
  width: 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.scrollButton:hover:not(:disabled) {
  color: rgba(255, 255, 255, 0.8);
}

.scrollButton:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.leftShadow,
.rightShadow {
  position: absolute;
  top: 0;
  height: 100%;
  width: 20px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.leftShadow {
  left: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
}

.rightShadow {
  right: 0;
  background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
}

.leftShadow.visible,
.rightShadow.visible {
  opacity: 1;
}
```

### Data Flow

```
Tabsbar Component
├── Track scroll position
├── Update button states
├── Listen for active tab changes
├── Auto-scroll to active tab
└── Render scroll buttons + shadows
```

### Keyboard Shortcuts

- **Left Arrow** - Scroll tabs left by 200px
- **Right Arrow** - Scroll tabs right by 200px
- **Home** - Scroll to first tab
- **End** - Scroll to last tab

### Performance Considerations

- Use `useCallback` for scroll handlers to prevent unnecessary re-renders
- Debounce scroll event listener (50ms)
- Use CSS `scroll-behavior: smooth` instead of JavaScript animations where possible
- Lazy-load scroll buttons on mobile only

### Browser Compatibility

- ✓ Chrome/Edge (Chromium) - Full support
- ✓ Firefox - Full support
- ✓ Safari - Full support (with `-webkit-` prefixes)
- ✓ Mobile browsers - Native momentum scrolling

### Testing Checklist

- [ ] Scroll buttons appear/disappear correctly
- [ ] Smooth scrolling works on all browsers
- [ ] Active tab auto-scrolls into view
- [ ] Keyboard navigation works
- [ ] Touch scrolling works on mobile
- [ ] Shadows appear at scroll boundaries
- [ ] No layout shift when scrolling
- [ ] Performance is smooth (60fps)
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility - ARIA labels on buttons

### Future Enhancements

- Tab grouping/organization
- Tab context menu (close, close others, close all)
- Tab drag-and-drop reordering
- Tab preview on hover
- Recently closed tabs recovery
- Tab search/filter

---

## Design Principles

Everything should feel like an engineering tool.

### Avoid:
- Skill bars
- Percentages
- Generic portfolio widgets

### Focus on:
- Data
- Architecture
- Hardware
- Documentation
- Engineering decision making

The visitor should leave understanding **how** projects were built, not merely that they exist.

---

## Implementation Notes

This document serves as a long-term specification.

Features should be implemented incrementally.

Each feature should maintain the VS Code aesthetic.

All new data structures should be TypeScript-first.

Configuration-driven architecture is preferred over hardcoded values.

Responsive design is mandatory.

Performance must not degrade with additional features.
