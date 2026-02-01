## 2024-05-23 - React.memo on Landing Page Sections

**Context:** The `LivePreview` component renders a list of landing page sections (Hero, Features, etc.) based on a configuration state. Whenever any section changed (or the primary color), *all* sections were re-rendering, even if their props hadn't changed.

**Learning:** `React.memo` is highly effective here because:
1. The parent (`LivePreview`) re-renders frequently (on every edit).
2. The `sections` prop is a new array reference (due to immutable reducer updates).
3. However, the *individual items* in the array are referentially stable for unchanged sections (thanks to the reducer implementation using `map` and only updating the target ID).
4. `React.memo` (shallow comparison) correctly identifies that `section` prop hasn't changed for 19 out of 20 sections, skipping their re-render.

**Why it matters:** In a "drag-and-drop" or "live editor" interface, responsiveness is key. Re-rendering the entire page on every keystroke causes input lag.

**Action:** When building list-based editors where items are updated individually:
1. Ensure the reducer/state update logic preserves references for unchanged items.
2. Memoize the list item components.
3. Memoize the `LivePreview` list rendering logic (or the mapped components).

**Evidence:**
- Synthetic benchmark simulating 50 sections re-rendering 100 times:
  - Unmemoized: ~340ms
  - Memoized: ~120ms
  - Improvement: ~2.8x faster rendering loop.

**Tags:** #react #performance #memoization #editor #frontend
