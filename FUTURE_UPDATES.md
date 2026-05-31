---
inclusion: manual
---

# Future Updates - VS Code Portfolio Features

This steering guide details 7 features to implement for the Next.js VS Code portfolio. Each feature is self-contained but builds on existing architecture. Follow the implementation order for optimal workflow.

---

## FEATURE 1: Active File Highlight in Explorer

**Goal:** Highlight the currently viewed file in the Explorer sidebar to match VS Code behavior.

**Files to modify:**
- `components/Explorer.tsx`
- `styles/Explorer.module.css`

### Implementation Steps

1. **Verify router import in Explorer.tsx**
   - Confirm `useRouter` from 'next/router' is already imported
   - The hook should be called at component top: `const router = useRouter()`

2. **Update all file div elements**
   - Find every `<div className={styles.file}>` that wraps file entries
   - Apply conditional active class: `${router.pathname === item.path ? styles.activeFile : ''}`
   - Apply to ALL file entries:
     - Root file (home)
     - Portfolio files
     - All nested folder files (development, skills, career, research, resume)

   **Example pattern:**
   ```tsx
   <div className={`${styles.file} ${router.pathname === item.path ? styles.activeFile : ''}`}>
     {/* file content */}
   </div>
   ```

3. **Add CSS for active state in Explorer.module.css**
   ```css
   .activeFile {
     background: var(--explorer-hover-bg);
     border-left: 2px solid var(--accent-color);
     padding-left: calc(1rem - 2px);
   }
   ```

4. **Verify hover state precedence**
   - Ensure `.file:hover` styles don't override `.activeFile`
   - Active state should take visual precedence

---

## FEATURE 2: VS Code Breadcrumbs Bar

**Goal:** Add a breadcrumb navigation bar showing current file path, positioned between Tabsbar and main content.

**Files to create:**
- `components/Breadcrumbs.tsx` (new)
- `styles/Breadcrumbs.module.css` (new)

**Files to modify:**
- `components/Layout.tsx`
- `styles/globals.css`

### Implementation Steps

1. **Create Breadcrumbs.tsx component**
   - Import: `useRouter`, `Image`, `Link`, navigation data
   - Component logic:
     - Get current pathname from router
     - Find which file/folder matches current route
     - Return null if no match found
     - Display: `shantanu-portfolio › [Folder] › [File]`
   
   **Key function:**
   ```tsx
   const findFile = () => {
     if (path === '/') return { file: rootFile, folder: null }
     const portfolioFile = portfolioFiles.find(f => f.path === path)
     if (portfolioFile) return { file: portfolioFile, folder: 'Portfolio' }
     for (const folder of navFolders) {
       const found = folder.files.find(f => f.path === path)
       if (found) return { file: found, folder: folder.label }
     }
     return null
   }
   ```

2. **Create Breadcrumbs.module.css**
   - Container: flex layout, 28px height, monospace font
   - Segments: 0.78rem font size, 50% opacity
   - Separators: › symbol, 25% opacity
   - Current file: 90% opacity, display icon + name
   - Scrollable on overflow (hide scrollbar)
   - Mobile: reduce font to 0.7rem, padding to 0.75rem

3. **Update Layout.tsx**
   - Import Breadcrumbs component
   - Render between `<Tabsbar />` and `<main id="main-editor">`
   - Structure:
     ```tsx
     <Tabsbar />
     <Breadcrumbs />
     <main id="main-editor" className={styles.content}>
       {children}
     </main>
     ```

4. **Update globals.css**
   - Find `--page-height` CSS variable
   - Change from: `calc(100vh - 154px)`
   - Change to: `calc(100vh - 182px)`
   - Reason: titlebar(30) + tabsbar(35) + breadcrumbs(28) + bottombar(25) + padding(64) = 182px

---

## FEATURE 3: Command Palette (Ctrl+K)

**Goal:** Implement a fuzzy-search command palette for navigation and theme switching. This is the most important feature.

**Files to create:**
- `components/CommandPalette.tsx` (new)
- `styles/CommandPalette.module.css` (new)

**Files to modify:**
- `components/Layout.tsx`
- `components/Titlebar.tsx`
- `styles/Titlebar.module.css`

### Implementation Steps

1. **Create CommandPalette.tsx component**
   - State management:
     - `open`: boolean for palette visibility
     - `query`: search input string
     - `selectedIndex`: keyboard navigation index
   
   - Command structure:
     ```tsx
     interface Command {
       id: string
       label: string
       description?: string
       icon?: string
       action: () => void
       category: 'navigation' | 'theme' | 'settings'
     }
     ```
   
   - Build commands array from:
     - All files (rootFile + portfolioFiles + nested folder files) → navigation commands
     - Theme list → theme commands (GitHub Dark, Dracula, Ayu Dark, Ayu Mirage, Nord, Night Owl)
     - Settings → toggle lite mode, open settings
   
   - Keyboard shortcuts:
     - `Ctrl+K` or `Cmd+K`: toggle palette open/close
     - `Escape`: close palette
     - `ArrowUp/ArrowDown`: navigate results
     - `Enter`: select highlighted command
   
   - Fuzzy search: filter commands by label or description (case-insensitive)
   
   - Theme switching function:
     ```tsx
     const setTheme = (themeId: string) => {
       document.documentElement.setAttribute('data-theme', themeId)
       localStorage.setItem('theme', themeId)
       window.dispatchEvent(new Event('themeChange'))
       window.dispatchEvent(new Event('themeChanged'))
     }
     ```

2. **Create CommandPalette.module.css**
   - Overlay: fixed, full screen, dark backdrop with blur
   - Palette: max-width 600px, centered, slide-down animation
   - Input: monospace font, transparent background, › prefix icon
   - Results: max-height 380px, scrollable
   - Items: hover/selected states with accent color border
   - Footer: keyboard hints (↑↓ navigate, ↵ select, esc close, Ctrl K toggle)
   - Mobile: max-width 95vw, hide descriptions, wrap footer

3. **Update Layout.tsx**
   - Import CommandPalette
   - Render at bottom of returned JSX, before closing `</FolderProvider>`
   - Position: `<CommandPalette />`

4. **Update Titlebar.tsx**
   - Add `handleOpen` function:
     ```tsx
     const handleOpen = () => {
       window.dispatchEvent(new KeyboardEvent('keydown', { 
         key: 'k', 
         ctrlKey: true, 
         bubbles: true 
       }))
     }
     ```
   - In title element, after mode indicator span, add:
     ```tsx
     <span className={styles.paletteHint} onClick={handleOpen}>
       [Ctrl+K]
     </span>
     ```

5. **Update Titlebar.module.css**
   - Add `.paletteHint` styles:
     - Font: 0.7rem, monospace
     - Color: 30% opacity, hover to accent color
     - Cursor: pointer
     - Transition: 0.2s ease
   - Hide on mobile: `@media (max-width: 900px) { display: none; }`

---

## FEATURE 4: Per-Page Open Graph Images

**Goal:** Allow each page to have custom OG metadata for better social sharing.

**Files to modify:**
- `components/Head.tsx`
- `pages/_app.tsx`
- Individual pages: `about.tsx`, `projects.tsx`, `experience.tsx`, `research.tsx`, `github.tsx`

### Implementation Steps

1. **Update Head.tsx component**
   - Add props to interface:
     ```tsx
     interface CustomHeadProps {
       title: string
       ogImage?: string
       ogDescription?: string
     }
     ```
   - Define defaults:
     ```tsx
     const defaultImage = 'https://vs-code-portfolio-one.vercel.app/og-image.png'
     const defaultDesc = 'IoT/Embedded Systems Engineer building the physical internet with ESP32, custom PCB design, and end-to-end IoT integration.'
     ```
   - Use provided values or defaults:
     ```tsx
     const image = ogImage || defaultImage
     const description = ogDescription || defaultDesc
     ```
   - Update meta tags:
     ```tsx
     <meta property="og:title" content={title} />
     <meta property="og:description" content={description} />
     <meta property="og:image" content={image} />
     ```

2. **Update _app.tsx**
   - Pass ogDescription to Head component:
     ```tsx
     <Head 
       title={`Shantanu | ${pageProps.title}`} 
       ogDescription={pageProps.ogDescription} 
     />
     ```

3. **Add ogDescription to page getStaticProps**
   - `pages/about.tsx`: `'Shantanu Maratha - IoT & Embedded Systems Engineer. Origin story, startup experience at Ragastra and Grosity, and the dream build.'`
   - `pages/projects.tsx`: `'Hardware modules, IoT systems, and software projects - ESP32, custom PCBs, dashboards, and more.'`
   - `pages/experience.tsx`: `'Work experience as Core Engineer at Ragastra, Founder of Arceus Labs, and Early-Stage Engineer at Grosity.'`
   - `pages/research.tsx`: `'Technical reports and research papers covering Zephyr Station, Jolt Locator, The Ruin Machine, and more.'`
   - `pages/github.tsx`: `'GitHub stats, contribution graph, and repositories for shaxntanu.'`

---

## FEATURE 5: Recently Viewed Tabs Persistence

**Goal:** Store recently visited pages in sessionStorage and display them as persistent tabs in Tabsbar.

**Files to create:**
- `hooks/useRecentTabs.ts` (new)

**Files to modify:**
- `components/Tabsbar.tsx`
- `styles/Tabsbar.module.css`

### Implementation Steps

1. **Create useRecentTabs.ts hook**
   - Interface:
     ```tsx
     export interface RecentTab {
       name: string
       path: string
       icon: string
     }
     ```
   - Constants: `MAX_TABS = 6`
   - Hook logic:
     - Load from sessionStorage on mount
     - Add current route to tabs on navigation
     - Prevent duplicates (check if path already exists)
     - Keep only most recent 6 tabs
     - Provide `closeTab(path)` function to remove tabs
     - Persist to sessionStorage after each change

2. **Update Tabsbar.tsx**
   - Import hook: `import { useRecentTabs } from '@/hooks/useRecentTabs'`
   - Call hook at component top: `const { tabs, closeTab } = useRecentTabs()`
   - After existing folder-based tab rendering, add recent tabs section:
     - Filter out tabs already visible from folder open state
     - Map remaining tabs with close button
     - Use motion.div for animation consistency
     - Close button: `×` symbol, positioned absolutely on right

3. **Update Tabsbar.module.css**
   - Add `.recentTab` styles:
     - Position: relative
     - Display: flex, align-items center
   - Add `.closeTab` styles:
     - Position: absolute right 4px, top 50%
     - Background: none, border: none
     - Color: 40% opacity, hover to 90% opacity
     - Font-size: 1rem
     - Opacity: 0 by default, 1 on parent hover
     - Transition: 0.15s ease
     - Padding: 0 4px, border-radius: 3px

---

## FEATURE 6: PWA Manifest

**Goal:** Add Progressive Web App support for installability and offline capability.

**Files to create:**
- `public/manifest.json` (new)

**Files to modify:**
- `pages/_document.tsx`

### Implementation Steps

1. **Create public/manifest.json**
   ```json
   {
     "name": "Shantanu Maratha - Portfolio",
     "short_name": "Shantanu",
     "description": "IoT & Embedded Systems Engineer building the physical internet",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#0a0e14",
     "theme_color": "#e6b450",
     "orientation": "portrait-primary",
     "icons": [
       {
         "src": "/logos/vscode_icon.svg",
         "sizes": "any",
         "type": "image/svg+xml",
         "purpose": "any maskable"
       }
     ]
   }
   ```

2. **Update _document.tsx Head section**
   - Add manifest link:
     ```tsx
     <link rel="manifest" href="/manifest.json" />
     ```
   - Add theme color:
     ```tsx
     <meta name="theme-color" content="#e6b450" />
     ```
   - Add mobile web app meta tags:
     ```tsx
     <meta name="mobile-web-app-capable" content="yes" />
     <meta name="apple-mobile-web-app-capable" content="yes" />
     <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
     <meta name="apple-mobile-web-app-title" content="Shantanu" />
     ```
   - Add Apple touch icon:
     ```tsx
     <link rel="apple-touch-icon" href="/logos/vscode_icon.svg" />
     ```

---

## FEATURE 7: Decorative Minimap

**Goal:** Add a non-functional decorative minimap on the right side of long-content pages to enhance VS Code aesthetic.

**Files to create:**
- `components/Minimap.tsx` (new)
- `styles/Minimap.module.css` (new)

**Files to modify:**
- `components/Layout.tsx`

### Implementation Steps

1. **Create Minimap.tsx component**
   - Pages to show minimap: `/about`, `/experience`, `/projects`, `/research`, `/certificates`
   - Canvas rendering:
     - Width: 80px, Height: 600px
     - Draw decorative code-like lines (80 lines total)
     - Each line: random indent (0-24px), random width, low opacity
     - Occasional highlighted lines (15% opacity background)
     - Occasional colored tokens (accent color, 2x opacity)
     - Use accent color from CSS variable
   
   - Viewport indicator:
     - Position: absolute, height 30%, width 100%
     - Background: 6% opacity white
     - Border: 1px solid 10% opacity white
     - Follows scroll position: `top: ${scrollPercent * 70}%`
   
   - Scroll tracking:
     - Listen to `main-editor` scroll events
     - Calculate scroll percentage: `scrollTop / (scrollHeight - clientHeight)`
     - Update viewport position on scroll

2. **Create Minimap.module.css**
   - Container:
     - Width: 80px, min-width: 80px
     - Background: var(--main-bg)
     - Border-left: 1px solid var(--explorer-border)
     - Position: relative, flex-shrink: 0
     - Opacity: 0.6, hover to 1.0
     - Transition: 0.2s ease
   
   - Canvas: display block, width 100%, height 100%
   
   - Viewport: absolute positioning, smooth transition on scroll
   
   - Mobile: hide on screens ≤ 1024px

3. **Update Layout.tsx structure**
   - Wrap Tabsbar, Breadcrumbs, and main content in flex column:
     ```tsx
     <div style={{ 
       flex: 1, 
       minWidth: 0, 
       position: 'relative', 
       display: 'flex', 
       flexDirection: 'column' 
     }}>
       <Tabsbar />
       <Breadcrumbs />
       <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
         <main id="main-editor" className={styles.content}>
           {children}
         </main>
         <Minimap />
       </div>
     </div>
     ```

---

## Background Implementation Notes

For the minimap background rendering:
- Use static canvas rendering (no animations)
- Generate decorative code-like pattern on component mount
- Regenerate only when route changes
- Use CSS variable `--accent-color` for token highlighting
- Keep opacity low (8-12% base, 15% for highlights) to maintain subtle aesthetic
- Pattern should feel like code but be completely non-functional

---

## Implementation Order Recommendation

1. **Feature 1** (Active File Highlight) - Quick, foundational
2. **Feature 2** (Breadcrumbs) - Builds on Feature 1
3. **Feature 3** (Command Palette) - Most complex, highest impact
4. **Feature 4** (OG Images) - Independent, quick
5. **Feature 5** (Recent Tabs) - Builds on existing Tabsbar
6. **Feature 6** (PWA Manifest) - Independent, quick
7. **Feature 7** (Minimap) - Visual polish, last

---

## Testing Checklist

- [ ] Active file highlight updates on navigation
- [ ] Breadcrumbs display correct path for all pages
- [ ] Command palette opens with Ctrl+K, closes with Escape
- [ ] Fuzzy search filters commands correctly
- [ ] Theme switching persists across page reloads
- [ ] Recent tabs persist across page reloads (sessionStorage)
- [ ] Recent tabs close button works
- [ ] OG metadata appears in social share previews
- [ ] PWA manifest is valid (check DevTools)
- [ ] Minimap renders on long-content pages
- [ ] Minimap viewport follows scroll position
- [ ] All features work on mobile (responsive)
- [ ] No console errors or warnings
- [ ] Performance is smooth (no jank)
