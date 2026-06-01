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
