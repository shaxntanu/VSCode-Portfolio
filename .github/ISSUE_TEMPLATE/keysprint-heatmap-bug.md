---
name: Bug Report - Keysprint Heatmap
about: 2026 activity data not displaying in MonkeyType heatmap
title: "[BUG] Keysprint heatmap not showing 2026 test activity"
labels: bug
assignees: shaxntanu
---

## Description
The GitHub-style activity heatmap on the Keysprint page is not displaying test activity for 2026, despite having 95+ completed tests in 2026 and an active streak.

## Expected Behavior
- Selecting "2026" from the year dropdown should display all typing test activity for that year
- Activity squares should be colored based on the number of tests completed each day
- The heatmap should dynamically show data for any future year as tests are completed

## Actual Behavior
- 2026 shows zero tests / empty heatmap
- 2025 data displays correctly
- Streak data shows correctly (proving API connection works)

## Technical Details

### MonkeyType API Response Structure
The `testsByDays` array from the MonkeyType API uses `lastDay` timestamp as the reference point:
- Index 0 = `lastDay` (the most recent day with data)
- Index 1 = `lastDay - 1 day`
- Index N = `lastDay - N days`

### Suspected Issue
The day index calculation may not be correctly mapping dates to the `testsByDays` array for 2026 dates. The calculation needs to:
1. Use `lastDay` from the API response as the reference point (not "today")
2. Calculate the day offset from `lastDay` to determine the correct array index
3. Handle year boundaries correctly

### Relevant Files
- `pages/keysprint.tsx` - Heatmap rendering logic
- `pages/api/monkeytype.ts` - API route fetching MonkeyType data
- `styles/KeysprintPage.module.css` - Heatmap styling

### API Endpoints Used
- `/users/{username}/profile` - Public profile with `testActivity`
- `/users/currentTestActivity` - Authenticated activity data (preferred)

## Steps to Reproduce
1. Navigate to the Keysprint page
2. Select "2026" from the year dropdown
3. Observe that no activity is displayed despite having completed tests

## Environment
- Next.js 15.5.7
- MonkeyType API
- User: shaxntanu

## Additional Context
- Started using MonkeyType in 2025
- Current streak is active (verified via streak API)
- 95 tests completed in 2026 (verified on monkeytype.com)
