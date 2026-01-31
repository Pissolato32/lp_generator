
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { performance } from 'perf_hooks';

// Simulate a heavy section component
const HeavySection = ({ section, primaryColor }: { section: any, primaryColor: string }) => {
    // Simulate some work (e.g. generating complex markup or just loop)
    // In a real app, this is the cumulative cost of reconciling the virtual DOM of the subtree
    let result = 0;
    for (let i = 0; i < 1000; i++) {
        result += i;
    }
    return (
        <div style={{ color: primaryColor }}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
            <span>{result}</span>
        </div>
    );
};

// Memoized version
const HeavySectionMemo = React.memo(HeavySection);

const SECTIONS_COUNT = 50;
const sections = Array.from({ length: SECTIONS_COUNT }, (_, i) => ({
    id: `sec-${i}`,
    type: 'hero',
    title: `Section ${i}`,
    content: `Content for section ${i}`,
    order: i
}));

const primaryColor = '#ffffff';

console.log('Running Render Benchmark...');

// 1. Benchmark Unmemoized (Simulating LivePreview)
const startUnmemoized = performance.now();
for (let i = 0; i < 100; i++) {
    // Simulate re-rendering the parent 100 times
    // We update the "sections" array reference, but content is same (common in Reducer)
    const newSections = [...sections];
    const element = (
        <div>
            {newSections.map(s => (
                <HeavySection key={s.id} section={s} primaryColor={primaryColor} />
            ))}
        </div>
    );
    renderToStaticMarkup(element);
}
const endUnmemoized = performance.now();
console.log(`Unmemoized Total Time: ${(endUnmemoized - startUnmemoized).toFixed(2)}ms`);


// 2. Benchmark Memoized
const startMemoized = performance.now();
for (let i = 0; i < 100; i++) {
    const newSections = [...sections];
    const element = (
        <div>
            {newSections.map(s => (
                <HeavySectionMemo key={s.id} section={s} primaryColor={primaryColor} />
            ))}
        </div>
    );
    renderToStaticMarkup(element);
}
const endMemoized = performance.now();
console.log(`Memoized Total Time: ${(endMemoized - startMemoized).toFixed(2)}ms`);

const improvement = (endUnmemoized - startUnmemoized) / (endMemoized - startMemoized);
console.log(`Improvement: ${improvement.toFixed(2)}x`);
