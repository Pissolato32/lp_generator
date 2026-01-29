
import { performance } from 'perf_hooks';

// Mock data structure
interface MockSection {
    id: string;
    order: number;
    type: string;
}

const NUM_SECTIONS = 50;
const NUM_RENDERS = 100000;

// Create random sections
const sections: MockSection[] = Array.from({ length: NUM_SECTIONS }, (_, i) => ({
    id: `id-${i}`,
    order: Math.floor(Math.random() * 100),
    type: 'hero'
}));

console.log(`Benchmarking sort operation...`);
console.log(`Sections: ${NUM_SECTIONS}`);
console.log(`Simulated Renders: ${NUM_RENDERS}`);

// Baseline: Sort on every render
const startBaseline = performance.now();
for (let i = 0; i < NUM_RENDERS; i++) {
    // Simulate what the component does: create a shallow copy and sort
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sorted = [...sections].sort((a, b) => a.order - b.order);
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

console.log(`\nBaseline (Sort every time): ${baselineTime.toFixed(2)}ms`);

// Optimized: Sort only once (Memoized)
const startOptimized = performance.now();

// Initial sort (simulating the first render)
const sortedMemoized = [...sections].sort((a, b) => a.order - b.order);

for (let i = 1; i < NUM_RENDERS; i++) {
    // Simulate re-render where dependencies (sections) haven't changed
    // We just reuse the result
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sorted = sortedMemoized;
}
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Optimized (Memoized): ${optimizedTime.toFixed(2)}ms`);

const improvement = baselineTime / optimizedTime;
console.log(`\nSpeedup: ${improvement.toFixed(1)}x`);
