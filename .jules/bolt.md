## 2026-10-24 - Verification Scripts and Profiling Cleanup

**Context:** I implemented a performance optimization and verified it using a Playwright script that counted console logs. I then removed the console logs as part of cleanup.

**Learning:** The verification script became useless after cleanup because it relied on the logs. The reviewer noted this as a flaw.

**Why it matters:** Artifacts submitted for review should demonstrate correctness *at the time of submission* or be clearly marked as "already run". If a script is provided as proof, it should work with the code in the PR (or the PR should include the instrumentation under a debug flag).

**Action:** When submitting performance verification scripts that rely on instrumentation:
1.  Either keep the instrumentation behind a debug flag/env var.
2.  Or explicitely state that the script was for development only and provide the results in the PR description, potentially deleting the script if it won't work anymore.

**Evidence:** Reviewer comment: "The user provided a Python script... which relies on console.log entries... which are not present in the patch."

**Tags:** #process #verification #testing

## 2026-10-25 - React.memo on List Items in Editor Preview

**Context:** The `LivePreview` component renders a list of `Section` components based on a config array. Every time one section was updated (or global config like color changed), *all* sections were re-rendered, causing unnecessary overhead.

**Learning:** In a list where items are heavy (DOM creation, loops) and updates are frequent (typing in editor), memoizing the list items is critical. The overhead of `React.memo` (shallow prop comparison) is negligible compared to re-rendering a section component.

**Why it matters:** As the user adds more sections (10+), the editor would become sluggish without this optimization.

**Action:** When implementing list rendering in React where items are complex:
1. Wrap the item component in `React.memo`.
2. Ensure props passed to it are stable (or primitives).
3. Verify with a micro-benchmark if unsure about the cost.

**Evidence:**
Benchmark `client/benchmarks/react_render_benchmark.tsx` showed:
Unmemoized: ~3.3ms per render (synthetic)
Memoized: ~1.2ms per render (synthetic)
Improvement: ~2.8x faster for stable items.

**Tags:** #react #performance #memoization #list-rendering
