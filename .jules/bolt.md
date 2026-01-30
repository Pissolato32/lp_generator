## 2026-10-24 - Verification Scripts and Profiling Cleanup

**Context:** I implemented a performance optimization and verified it using a Playwright script that counted console logs. I then removed the console logs as part of cleanup.

**Learning:** The verification script became useless after cleanup because it relied on the logs. The reviewer noted this as a flaw.

**Why it matters:** Artifacts submitted for review should demonstrate correctness *at the time of submission* or be clearly marked as "already run". If a script is provided as proof, it should work with the code in the PR (or the PR should include the instrumentation under a debug flag).

**Action:** When submitting performance verification scripts that rely on instrumentation:
1.  Either keep the instrumentation behind a debug flag/env var.
2.  Or explicitely state that the script was for development only and provide the results in the PR description, potentially deleting the script if it won't work anymore.

**Evidence:** Reviewer comment: "The user provided a Python script... which relies on console.log entries... which are not present in the patch."

**Tags:** #process #verification #testing
