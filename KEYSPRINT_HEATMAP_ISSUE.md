# [BUG] Keysprint heatmap not showing 2026 test activity

## Description
The GitHub-style activity heatmap on the Keysprint page is not displaying test activity for 2026, despite having 95+ completed tests and an active streak.

## Expected Behavior
- Selecting "2026" from the year dropdown should display all typing test activity
- Activity squares should be colored based on tests completed each day

## Actual Behavior
- 2026 shows zero tests / empty heatmap
- 2025 data displays correctly
- Streak data shows correctly (API connection works)

## Root Cause Analysis

The MonkeyType API `testsByDays` array structure:
```
Index 0 = lastDay (most recent day with data)
Index 1 = lastDay - 1 day
Index N = lastDay - N days
```

The bug is likely in the day index calculation - it needs to:
1. Use `lastDay` from API as reference (NOT current date)
2. Calculate offset: `dayIndex = daysBetween(lastDay, targetDate)`
3. Handle year boundaries correctly

## Debug Info
```javascript
// API returns:
{
  testsByDays: [3, 2, 0, 5, ...], // index 0 = lastDay
  lastDay: 1737072000000          // timestamp of index 0
}

// Correct calculation:
const lastDayDate = new Date(lastDay * 1000);
const targetDate = new Date(year, month, day);
const dayIndex = Math.floor((lastDayDate - targetDate) / (1000 * 60 * 60 * 24));
const tests = testsByDays[dayIndex] || 0;
```

## Files to Fix
- `pages/keysprint.tsx` - Heatmap date calculation logic

## Verification
- User has 95 tests in 2026 (confirmed on monkeytype.com)
- Streak is active and displaying correctly
- 2025 data works fine
