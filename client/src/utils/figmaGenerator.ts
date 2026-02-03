import { LandingPageConfig, Section } from '../types';

interface FigmaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface FigmaNode {
    id: string;
    name: string;
    type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'GROUP' | 'INSTANCE';
    x: number;
    y: number;
    width: number;
    height: number;
    children?: FigmaNode[];
    fills?: { type: 'SOLID'; color: FigmaColor }[];
    characters?: string;
    fontSize?: number;
    fontName?: { family: string; style: string };
    textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT';
}

function hexToFigmaColor(hex: string): FigmaColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1
    } : { r: 0, g: 0, b: 0, a: 1 };
}

export function generateFigmaJSON(config: LandingPageConfig): string {
    const { sections, design, name } = config;
    const primaryColor = hexToFigmaColor(design.primaryColor);

    let currentY = 0;
    const SECTION_HEIGHT = 800; // Altura estimada para o mockup

    const children: FigmaNode[] = sections.map((section: Section) => {
        const y = currentY;
        currentY += SECTION_HEIGHT;

        // Simplificação: Cada seção é um Frame
        const sectionNode: FigmaNode = {
            id: section.id,
            name: section.type.toUpperCase(),
            type: 'FRAME',
            x: 0,
            y: y,
            width: 1440,
            height: SECTION_HEIGHT,
            fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }],
            children: [
                {
                    id: `${section.id}-label`,
                    name: 'Section Label',
                    type: 'TEXT',
                    x: 100,
                    y: 100,
                    width: 500,
                    height: 50,
                    characters: `Section: ${section.type}`,
                    fontSize: 32,
                    fills: [{ type: 'SOLID', color: primaryColor }],
                    fontName: { family: design.fontFamily || 'Inter', style: 'Bold' }
                }
            ]
        };

        // Adicionar detalhes específicos baseados no tipo (Mockup básico)
        if (section.type === 'hero' && 'headline' in section) {
            sectionNode.children?.push({
                id: `${section.id}-headline`,
                name: 'Headline',
                type: 'TEXT',
                x: 100,
                y: 200,
                width: 1000,
                height: 100,
                characters: section.headline,
                fontSize: 64,
                fontName: { family: design.fontFamily || 'Inter', style: 'Bold' },
                fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1, a: 1 } }]
            });
        }

        return sectionNode;
    });

    const figmaDoc = {
        document: {
            id: "0:0",
            name: "Document",
            type: "DOCUMENT",
            children: [
                {
                    id: "0:1",
                    name: "Page 1",
                    type: "CANVAS",
                    backgroundColor: { r: 0.9, g: 0.9, b: 0.9, a: 1 },
                    children: [
                        {
                            id: "1:2",
                            name: name || "Landing Page",
                            type: "FRAME",
                            x: 0,
                            y: 0,
                            width: 1440,
                            height: currentY,
                            fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }],
                            children: children
                        }
                    ]
                }
            ]
        },
        version: "1.0",
        schema: "figma-plugin-api-v1"
    };

    return JSON.stringify(figmaDoc, null, 2);
}
