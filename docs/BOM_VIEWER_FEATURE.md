# BOM (Bill of Materials) Viewer Feature

## Overview

The BOM Viewer is an interactive component that displays detailed hardware specifications for engineering projects in a VS Code Explorer-style interface. It provides a professional, data-driven view of project components, making it easy to understand the hardware architecture and costs.

---

## ✨ Key Features

### 1. **Collapsible Dropdown Interface**
- Click the BOM header to expand/collapse content
- Smooth Framer Motion animations
- Chevron icon rotates to indicate state
- Displays component count and total cost in header

### 2. **Component Data Table**
Shows comprehensive information for each component:
- **Component Name** - Hardware part identifier
- **Purpose/Role** - What the component does
- **Protocol/Interface** - Communication method (I2C, SPI, UART, etc.)
- **Voltage** - Operating voltage requirements
- **Quantity** - Number of units needed
- **Price** - Estimated cost in INR (₹)
- **Details Button** - Opens detailed view

### 3. **Search & Filter**
- Real-time search across component names, roles, and interfaces
- Instant filtering as you type
- "No results" message when no matches found

### 4. **Sorting Options**
Sort components by:
- Name (alphabetical)
- Interface (protocol type)
- Voltage (operating voltage)

### 5. **System Architecture Diagram**
- ASCII-style diagram showing component connections
- Displays bus assignments (I2C Bus 0, 1, 2, etc.)
- Shows GPIO pin connections
- Communication flow visualization

### 6. **Component Detail Drawer**
Click any component row to open a slide-out panel showing:
- Complete specifications
- Detailed notes and implementation details
- Technical specifications
- Purchase information
- Close button (×) to dismiss

---

## 📊 Data Structure

### Component Interface
```typescript
interface Component {
  name: string;           // "ESP32 DevKit V1"
  role: string;           // "Main Controller & WiFi"
  interface: string;      // "WiFi/Bluetooth"
  voltage: string;        // "3.3V/5V"
  quantity: number;       // 1
  notes?: string;         // "Dual-core Xtensa processor..."
  price?: string;         // "₹300"
}
```

### Project Integration
```typescript
interface Project {
  // ... other fields
  components?: Component[];     // Array of BOM components
  architecture?: string;        // System architecture diagram
  totalCost?: string;          // Total project cost "₹1,202"
}
```

---

## 🎨 Visual Design

### Color Scheme
- **Primary Accent**: Cyan (`rgb(100, 200, 255)`)
- **Protocol Badges**: Cyan with transparency
- **Prices**: Green (`rgb(100, 255, 150)`)
- **Background**: Dark theme matching VS Code
- **Borders**: Subtle cyan/white borders

### Typography
- **Headers**: Bold, uppercase, 0.5px letter spacing
- **Component Names**: Bold, cyan colored
- **Body Text**: 0.85rem - 0.95rem
- **Monospace**: 'Fira Code' for technical values

---

## 📱 Responsive Design

### Desktop (>768px)
- Full table layout
- Side drawer (400px width)
- All columns visible
- Hover effects enabled

### Mobile (<768px)
- Compact table with reduced padding
- Full-width drawer
- Stacked layout for controls
- Touch-friendly buttons

---

## 🔧 Implementation Example

### Adding BOM to a Project

```typescript
// In data/projects.ts
{
  title: 'Zephyr Station',
  description: 'ESP32-based IoT station...',
  // ... other fields
  
  components: [
    {
      name: 'ESP32 DevKit V1',
      role: 'Main Controller & WiFi',
      interface: 'WiFi/Bluetooth',
      voltage: '3.3V/5V',
      quantity: 1,
      notes: 'Dual-core Xtensa processor, built-in WiFi and Bluetooth',
      price: '₹300'
    },
    {
      name: 'SSD1306 OLED Display',
      role: 'Real-time Visualization',
      interface: 'I2C (0x3C)',
      voltage: '3.3V',
      quantity: 1,
      notes: '0.96" 128x64 monochrome display on I2C Bus 0',
      price: '₹150'
    },
    // ... more components
  ],
  
  architecture: `ESP32 → [I2C Bus 0: OLED] → [I2C Bus 1: BME280] → [I2C Bus 2: RTC]`,
  
  totalCost: '₹1,202'
}
```

### Usage in Component

```tsx
import BOMViewer from '@/components/BOMViewer';

// In your component
{project.components && project.components.length > 0 && (
  <BOMViewer 
    components={project.components} 
    architecture={project.architecture}
    totalCost={project.totalCost}
  />
)}
```

---

## 🎯 Use Cases

### 1. **Hardware Project Documentation**
- Document all components used in embedded systems projects
- Show exact part numbers and specifications
- Track project costs accurately

### 2. **Educational Reference**
- Help visitors understand hardware architecture
- Show communication protocols and pin assignments
- Demonstrate component selection rationale

### 3. **Project Replication**
- Provide complete shopping list with prices
- Show exact components needed
- Include technical specifications for ordering

### 4. **Engineering Transparency**
- Demonstrate engineering decision-making
- Show system complexity and integration
- Highlight fault-tolerant design (multiple sensors)

---

## 🚀 Features Demonstrated

### Zephyr Station Project
**11 Components Total - ₹1,202**

1. **ESP32 DevKit V1** - Main controller with WiFi/Bluetooth (₹300)
2. **SSD1306 OLED** - 128x64 display for real-time data (₹150)
3. **BME280** - Temperature, humidity, pressure sensor (₹200)
4. **DS18B20** - Backup waterproof temperature probe (₹120)
5. **DS3231 RTC** - Real-time clock with battery backup (₹80)
6. **MicroSD Module** - Data logging storage via SPI (₹50)
7. **MQ-135** - Air quality gas sensor (₹100)
8. **Active Buzzer** - Alert system for threshold violations (₹20)
9. **4.7kΩ Resistor** - Pull-up for 1-Wire communication (₹2)
10. **Breadboard & Wires** - Prototyping platform (₹80)
11. **5V Power Supply** - USB power adapter (₹100)

**Architecture**: 7 separate communication buses
- 3 × I2C buses (OLED, BME280, RTC)
- 1 × SPI bus (SD Card)
- 1 × 1-Wire bus (DS18B20)
- 1 × Analog input (MQ-135)
- 1 × Digital output (Buzzer)

---

## 🔍 Technical Details

### Component Extraction Process
1. **Clone project repository** from GitHub
2. **Analyze source code** (.ino/.cpp files)
3. **Identify all hardware** mentioned in:
   - Header comments
   - Include statements
   - Pin definitions
   - Setup functions
4. **Extract specifications** from code and datasheets
5. **Estimate prices** from Indian electronics market
6. **Clean up repository** after extraction

### Data Accuracy
- Components verified against actual project code
- Pin assignments match hardware implementation
- Prices are market estimates (user confirms actual costs)
- Architecture diagrams reflect code structure

---

## 💡 Best Practices

### When Adding BOM Data

1. **Be Specific**
   - Use exact part numbers (BME280, not "humidity sensor")
   - Include I2C addresses (0x3C, 0x76)
   - Specify voltage levels (3.3V, 5V)

2. **Add Context**
   - Explain component role in notes
   - Mention key specifications
   - Note any quirks or requirements

3. **Price Accuracy**
   - Use current market prices
   - Include currency symbol (₹)
   - Mark TBD if unsure

4. **Architecture Clarity**
   - Show bus assignments
   - Include GPIO pin numbers
   - Indicate communication flow

---

## 🎨 Styling Reference

### CSS Classes
- `.bomContainer` - Outer wrapper with border
- `.bomHeader` - Clickable header bar
- `.bomContent` - Collapsible content area
- `.architectureSection` - Architecture diagram box
- `.bomTable` - Component data table
- `.detailDrawer` - Side panel for details

### Key Animations
- Header chevron rotation (90deg)
- Content expand/collapse (height: 0 → auto)
- Drawer slide-in (x: 300 → 0)
- Row hover effects
- Button transforms

---

## 📦 File Structure

```
portfolio/
├── components/
│   ├── BOMViewer.tsx          # Main BOM component
│   └── ProjectCard.tsx         # Integrates BOM viewer
├── styles/
│   └── BOMViewer.module.css   # BOM-specific styles
├── types/
│   └── index.ts               # Component & Project interfaces
├── data/
│   └── projects.ts            # Project data with BOM arrays
└── docs/
    └── BOM_VIEWER_FEATURE.md  # This documentation
```

---

## 🔮 Future Enhancements

### Potential Additions
- [ ] PCB layout viewer integration
- [ ] Schematic diagram display
- [ ] KiCad file import
- [ ] Interactive pin mapping
- [ ] Power consumption calculator
- [ ] Signal flow visualization
- [ ] Component datasheet links
- [ ] Shopping cart integration
- [ ] Price comparison across vendors
- [ ] Availability status tracking

---

## 📄 License

MIT License - Feel free to use this feature in your own projects!

---

## 👨‍💻 Author

**Shantanu**  
Portfolio: [VSCode Portfolio](https://shantanu-vsc-portfolio.vercel.app)  
GitHub: [@shaxntanu](https://github.com/shaxntanu)

---

*Last Updated: February 2026*

