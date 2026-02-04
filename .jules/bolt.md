
## 2026-05-24 - LivePreview Referential Integrity Optimization

**Context:** The `LivePreview` component was re-rendering all sections whenever the configuration changed, even if only one section was updated. This was caused by `useMemo` creating new object references for *every* section during a type normalization step, regardless of whether the normalization was needed.

**Learning:** Even inside `useMemo`, mapping over an array with object spread (`{ ...s }`) breaks referential equality for every item. This defeats `React.memo` on child components.

**Why it matters:** In a large list of complex components (like landing page sections), re-rendering everything on every keystroke causes significant lag. Preserving references allows `React.memo` to skip work for unchanged items.

**Action:** When normalizing or transforming lists in `useMemo`, conditionally return the *original* object if the transformation result is identical to the input.
```typescript
// Bad
return list.map(item => ({ ...item, prop: normalize(item.prop) }));

// Good
return list.map(item => {
    const normalized = normalize(item.prop);
    return normalized === item.prop ? item : { ...item, prop: normalized };
});
```

**Evidence:** Verified with `client/benchmarks/verify_fix.ts` that reference stability improved from `false` to `true` for unchanged items.

**Tags:** #react #performance #memoization #frontend
