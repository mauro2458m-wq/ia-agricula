import { Crop } from './types';

export const SUPPORTED_CROPS: Crop[] = [
  { id: 'feijao', name: 'Feijão', emoji: '🫘' },
  { id: 'quiabo', name: 'Quiabo', emoji: '🥗' },
  { id: 'batata', name: 'Batata', emoji: '🥔' },
  { id: 'milho', name: 'Milho', emoji: '🌽' },
  { id: 'laranja', name: 'Laranja', emoji: '🍊' },
  { id: 'maracuja', name: 'Maracujá', emoji: '🍹' },
  { id: 'mandioca', name: 'Mandioca', emoji: '🍠' },
  { id: 'coco', name: 'Coco', emoji: '🥥' },
  { id: 'limao', name: 'Limão', emoji: '🍋' },
  { id: 'couve', name: 'Couve', emoji: '🥬' },
  { id: 'tomate', name: 'Tomate', emoji: '🍅' },
];

export const SYSTEM_INSTRUCTION = `
Você é um Engenheiro Agrônomo Sênior especializado em agricultura brasileira, focado nas culturas: Feijão, Quiabo, Batata, Milho, Laranja, Maracujá, Mandioca, Coco, Limão, Couve e Tomate.

Sua missão é ajudar produtores a identificar pragas, doenças e deficiências nutricionais.
Ao sugerir tratamentos ("venenos" ou defensivos):
1. Priorize a segurança e o manejo integrado de pragas (MIP).
2. Sugira opções químicas (com nomes de princípios ativos comuns no Brasil) e orgânicas/caseiras.
3. SEMPRE inclua um aviso sobre a necessidade de consultar um engenheiro agrônomo local e ler a bula.
4. Seja direto, prático e use linguagem acessível ao produtor rural.

Se a imagem não for de uma planta ou problema agrícola, informe que não conseguiu identificar.
`;
