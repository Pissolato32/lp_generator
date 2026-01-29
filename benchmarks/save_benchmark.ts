import { LandingPageConfig, Section } from '../src/types/index.js';
import { performance } from 'perf_hooks';

// Helper to create a large string
const longString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);

// Helper to create a dummy section
const createSection = (id: string, index: number): Section => ({
    id: `section-${id}`,
    type: 'hero', // Using 'hero' as a representative type
    order: index,
    variant: 'full-width',
    headline: `Headline ${index} ${longString}`,
    subheadline: `Subheadline ${index} ${longString}`,
    ctaText: 'Call to Action',
    ctaUrl: 'https://example.com',
    showForm: true,
    formFields: [
        { id: 'f1', type: 'text', label: 'Name', placeholder: 'Enter name', required: true },
        { id: 'f2', type: 'email', label: 'Email', placeholder: 'Enter email', required: true },
    ]
});

// Create a large configuration
const createLargeConfig = (numSections: number): LandingPageConfig => {
    const sections: Section[] = [];
    for (let i = 0; i < numSections; i++) {
        sections.push(createSection(i.toString(), i));
    }

    return {
        id: 'bench-config-id',
        name: 'Benchmark Config',
        sections: sections,
        design: {
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            fontFamily: 'Arial',
            buttonStyle: 'rounded',
        },
        integrations: {
            webhookUrl: 'https://example.com/webhook',
            emailApiKey: 'key_123456789',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

const runBenchmark = () => {
    const config = createLargeConfig(100); // 100 sections is a reasonably large page
    const iterations = 100; // Simulating 100 rapid updates (e.g. typing)

    console.log(`Running benchmark with ${config.sections.length} sections...`);

    // Baseline: Synchronous Save (Current Behavior)
    const startSync = performance.now();
    for (let i = 0; i < iterations; i++) {
        // Simulate modifying the config slightly each time to prevent V8 optimization (though stringify is usually not cached like that)
        const currentConfig = { ...config, updatedAt: new Date() };
        const json = JSON.stringify(currentConfig);
        // Simulate localStorage.setItem overhead (minor compared to stringify for large objects, but non-zero)
        // In a real browser, this interacts with the storage subsystem.
        // We'll mostly measure JSON.stringify cost as the main CPU blocker.
    }
    const endSync = performance.now();
    const totalSyncTime = endSync - startSync;

    // Optimized: Debounced Save (Ideal Behavior)
    // With debouncing, we only save ONCE after the burst of updates.
    const startDebounced = performance.now();

    // In a real debounce scenario, the effect runs but clears timeout 99 times, and runs logic 1 time.
    // We simulate the overhead of setting/clearing timeouts (negligible) + 1 actual save.

    // Simulate 99 "skipped" updates (overhead of useEffect trigger + timeout set/clear is minimal compared to stringify)
    for (let i = 0; i < iterations - 1; i++) {
        // No-op or minimal overhead
    }

    // The final save
    const finalConfig = { ...config, updatedAt: new Date() };
    const jsonFinal = JSON.stringify(finalConfig);

    const endDebounced = performance.now();
    const totalDebouncedTime = endDebounced - startDebounced;

    console.log('\nResults:');
    console.log(`Simulated updates: ${iterations}`);
    console.log(`Total Time (Sync/Current): ${totalSyncTime.toFixed(2)}ms`);
    console.log(`Total Time (Debounced/Optimized): ${totalDebouncedTime.toFixed(2)}ms`);
    console.log(`Improvement: ${((totalSyncTime - totalDebouncedTime) / totalSyncTime * 100).toFixed(2)}%`);
    console.log(`\nAverage time per "frame" (update):`);
    console.log(`Sync: ${(totalSyncTime / iterations).toFixed(2)}ms`);
    console.log(`Debounced: ${(totalDebouncedTime / iterations).toFixed(2)}ms (amortized)`);
};

runBenchmark();
