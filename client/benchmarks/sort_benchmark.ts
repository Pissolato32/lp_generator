
import { performance } from 'perf_hooks';

// Estrutura de dados mockada
interface MockSection {
    id: string;
    order: number;
    type: string;
}

const NUM_SECTIONS = 50;
const NUM_RENDERS = 100000;

// Criar seções aleatórias
const sections: MockSection[] = Array.from({ length: NUM_SECTIONS }, (_, i) => ({
    id: `id-${i}`,
    order: Math.floor(Math.random() * 100),
    type: 'hero'
}));

console.log(`Fazendo benchmark da operação de ordenação...`);
console.log(`Seções: ${NUM_SECTIONS}`);
console.log(`Renderizações simuladas: ${NUM_RENDERS}`);

// Linha de base: Ordenar em cada renderização
const startBaseline = performance.now();
for (let i = 0; i < NUM_RENDERS; i++) {
    // Simular o que o componente faz: criar uma cópia rasa e ordenar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sorted = [...sections].sort((a, b) => a.order - b.order);
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

console.log(`\nLinha de base (Ordenar todas as vezes): ${baselineTime.toFixed(2)}ms`);

// Otimizado: Ordenar apenas uma vez (Memoizado)
const startOptimized = performance.now();

// Ordenação inicial (simulando a primeira renderização)
const sortedMemoized = [...sections].sort((a, b) => a.order - b.order);

for (let i = 1; i < NUM_RENDERS; i++) {
    // Simular re-renderização onde as dependências (sections) não mudaram
    // Apenas reutilizamos o resultado
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtered = sortedMemoized;
}
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Otimizado (Memoizado): ${optimizedTime.toFixed(2)}ms`);

const improvement = baselineTime / optimizedTime;
console.log(`\nMelhoria de velocidade: ${improvement.toFixed(1)}x`);
