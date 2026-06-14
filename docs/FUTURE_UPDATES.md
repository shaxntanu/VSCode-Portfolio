---
inclusion: manual
---

# Future Updates — VS Code Portfolio Features

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