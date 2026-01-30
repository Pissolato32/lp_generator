
import { performance } from 'perf_hooks';

// Estrutura de dados mockada
interface MockTemplate {
    id: string;
    businessType: string;
    name: string;
}

const NUM_TEMPLATES = 100; // Lista maior para demonstrar escalabilidade
const NUM_RENDERS = 100000;
const CATEGORIES = ['saas', 'ecommerce', 'coaching', 'lead-magnet', 'webinar'];

// Criar templates aleatórios
const templatePresets: MockTemplate[] = Array.from({ length: NUM_TEMPLATES }, (_, i) => ({
    id: `template-${i}`,
    name: `Template ${i}`,
    businessType: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
}));

console.log(`Fazendo benchmark da operação de filtro...`);
console.log(`Templates: ${NUM_TEMPLATES}`);
console.log(`Renderizações simuladas: ${NUM_RENDERS}`);

const selectedCategory = 'saas';

// Linha de base: Filtrar em cada renderização
const startBaseline = performance.now();
for (let i = 0; i < NUM_RENDERS; i++) {
    // Simular o que o componente faz: filtrar em cada renderização
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtered = selectedCategory === 'all'
        ? templatePresets
        : templatePresets.filter((t) => t.businessType === selectedCategory);
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

console.log(`\nLinha de base (Filtrar todas as vezes): ${baselineTime.toFixed(2)}ms`);

// Otimizado: Filtrar apenas uma vez (Memoizado)
const startOptimized = performance.now();

// Filtro inicial (simulando a primeira renderização)
const filteredMemoized = selectedCategory === 'all'
    ? templatePresets
    : templatePresets.filter((t) => t.businessType === selectedCategory);

for (let i = 1; i < NUM_RENDERS; i++) {
    // Simular re-renderização onde as dependências (selectedCategory) não mudaram
    // Apenas reutilizamos o resultado
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtered = filteredMemoized;
}
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Otimizado (Memoizado): ${optimizedTime.toFixed(2)}ms`);

const improvement = baselineTime / optimizedTime;
console.log(`\nMelhoria de velocidade: ${improvement.toFixed(1)}x`);
