
import { performance } from 'perf_hooks';

// Mock data structure
interface MockTemplate {
    id: string;
    businessType: string;
    name: string;
}

const NUM_TEMPLATES = 100; // Larger list to demonstrate scaling
const NUM_RENDERS = 100000;
const CATEGORIES = ['saas', 'ecommerce', 'coaching', 'lead-magnet', 'webinar'];

// Create random templates
const templatePresets: MockTemplate[] = Array.from({ length: NUM_TEMPLATES }, (_, i) => ({
    id: `template-${i}`,
    name: `Template ${i}`,
    businessType: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
}));

console.log(`Benchmarking filter operation...`);
console.log(`Templates: ${NUM_TEMPLATES}`);
console.log(`Simulated Renders: ${NUM_RENDERS}`);

const selectedCategory = 'saas';

// Baseline: Filter on every render
const startBaseline = performance.now();
for (let i = 0; i < NUM_RENDERS; i++) {
    // Simulate what the component does: filter on every render
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtered = selectedCategory === 'all'
        ? templatePresets
        : templatePresets.filter((t) => t.businessType === selectedCategory);
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

console.log(`\nBaseline (Filter every time): ${baselineTime.toFixed(2)}ms`);

// Optimized: Filter only once (Memoized)
const startOptimized = performance.now();

// Initial filter (simulating the first render)
const filteredMemoized = selectedCategory === 'all'
    ? templatePresets
    : templatePresets.filter((t) => t.businessType === selectedCategory);

for (let i = 1; i < NUM_RENDERS; i++) {
    // Simulate re-render where dependencies (selectedCategory) haven't changed
    // We just reuse the result
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtered = filteredMemoized;
}
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Optimized (Memoized): ${optimizedTime.toFixed(2)}ms`);

const improvement = baselineTime / optimizedTime;
console.log(`\nSpeedup: ${improvement.toFixed(1)}x`);
