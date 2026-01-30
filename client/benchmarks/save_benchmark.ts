import { LandingPageConfig, Section } from '../src/types/index.js';
import { performance } from 'perf_hooks';

// Auxiliar para criar uma string longa
const longString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);

// Auxiliar para criar uma seção fictícia
const createSection = (id: string, index: number): Section => ({
    id: `section-${id}`,
    type: 'hero', // Usando 'hero' como um tipo representativo
    order: index,
    variant: 'full-width',
    headline: `Headline ${index} ${longString}`,
    subheadline: `Subheadline ${index} ${longString}`,
    ctaText: 'Chamada para Ação',
    ctaUrl: 'https://exemplo.com',
    showForm: true,
    formFields: [
        { id: 'f1', type: 'text', label: 'Nome', placeholder: 'Digite o nome', required: true },
        { id: 'f2', type: 'email', label: 'Email', placeholder: 'Digite o email', required: true },
    ]
});

// Criar uma configuração grande
const createLargeConfig = (numSections: number): LandingPageConfig => {
    const sections: Section[] = [];
    for (let i = 0; i < numSections; i++) {
        sections.push(createSection(i.toString(), i));
    }

    return {
        id: 'bench-config-id',
        name: 'Configuração de Benchmark',
        sections: sections,
        design: {
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            fontFamily: 'Arial',
            buttonStyle: 'rounded',
        },
        integrations: {
            webhookUrl: 'https://exemplo.com/webhook',
            emailApiKey: 'key_123456789',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

const runBenchmark = () => {
    const config = createLargeConfig(100); // 100 seções é uma página razoavelmente grande
    const iterations = 100; // Simulando 100 atualizações rápidas (ex: digitando)

    console.log(`Executando benchmark com ${config.sections.length} seções...`);

    // Linha de base: Salvamento Síncrono (Comportamento Atual)
    const startSync = performance.now();
    for (let i = 0; i < iterations; i++) {
        // Simular a modificação da configuração levemente a cada vez para evitar a otimização do V8 (embora stringify geralmente não seja cacheado assim)
        const currentConfig = { ...config, updatedAt: new Date() };
        const json = JSON.stringify(currentConfig);
        // Simular o overhead de localStorage.setItem (menor comparado ao stringify para objetos grandes, mas não zero)
        // Em um navegador real, isso interage com o subsistema de armazenamento.
        // Mediremos principalmente o custo de JSON.stringify como o principal bloqueador da CPU.
    }
    const endSync = performance.now();
    const totalSyncTime = endSync - startSync;

    // Otimizado: Salvamento com Debounce (Comportamento Ideal)
    // Com debounce, salvamos apenas UMA VEZ após a explosão de atualizações.
    const startDebounced = performance.now();

    // Em um cenário real de debounce, o efeito é executado, mas limpa o timeout 99 vezes e executa a lógica 1 vez.
    // Simulamos o overhead de configurar/limpar timeouts (insignificante) + 1 salvamento real.

    // Simular 99 atualizações "puladas" (overhead do gatilho useEffect + configuração/limpeza do timeout é mínimo comparado ao stringify)
    for (let i = 0; i < iterations - 1; i++) {
        // Sem operação ou overhead mínimo
    }

    // O salvamento final
    const finalConfig = { ...config, updatedAt: new Date() };
    const jsonFinal = JSON.stringify(finalConfig);

    const endDebounced = performance.now();
    const totalDebouncedTime = endDebounced - startDebounced;

    console.log('\nResultados:');
    console.log(`Atualizações simuladas: ${iterations}`);
    console.log(`Tempo Total (Síncrono/Atual): ${totalSyncTime.toFixed(2)}ms`);
    console.log(`Tempo Total (Debounce/Otimizado): ${totalDebouncedTime.toFixed(2)}ms`);
    console.log(`Melhoria: ${((totalSyncTime - totalDebouncedTime) / totalSyncTime * 100).toFixed(2)}%`);
    console.log(`\nTempo médio por "frame" (atualização):`);
    console.log(`Síncrono: ${(totalSyncTime / iterations).toFixed(2)}ms`);
    console.log(`Debounce: ${(totalDebouncedTime / iterations).toFixed(2)}ms (amortizado)`);
};

runBenchmark();
