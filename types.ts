export enum AppView {
  HOME = 'HOME',
  DIAGNOSIS = 'DIAGNOSIS',
  CHAT = 'CHAT',
}

export interface Crop {
  id: string;
  name: string;
  emoji: string;
  scientificName?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string; // base64
}

export interface AnalysisResult {
  pestOrDisease: string;
  confidence: string;
  description: string;
  treatmentChemical: string;
  treatmentOrganic: string;
  prevention: string;
}