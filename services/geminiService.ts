import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Analyzes an image of a crop to identify pests or diseases.
 */
export const analyzeCropImage = async (base64Image: string, cropName: string): Promise<AnalysisResult> => {
  // Remove header if present (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const prompt = `
    Analise esta imagem da cultura: ${cropName}.
    Identifique a praga, doença ou deficiência.
    Retorne a resposta EXATAMENTE neste formato JSON:
    {
      "pestOrDisease": "Nome da praga ou doença",
      "confidence": "Alta/Média/Baixa",
      "description": "Breve descrição do problema visualizado",
      "treatmentChemical": "Sugestão de princípio ativo ou produto químico (defensivo)",
      "treatmentOrganic": "Sugestão de tratamento orgânico ou cultural",
      "prevention": "Dica de prevenção"
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png handling for simplicity or detecting mime type
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pestOrDisease: { type: Type.STRING },
            confidence: { type: Type.STRING },
            description: { type: Type.STRING },
            treatmentChemical: { type: Type.STRING },
            treatmentOrganic: { type: Type.STRING },
            prevention: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("Não foi possível gerar a análise.");

  } catch (error) {
    console.error("Erro na análise de imagem:", error);
    throw error;
  }
};

/**
 * Sends a chat message to the agronomist assistant.
 */
export const sendChatMessage = async (history: { role: string, parts: { text: string }[] }[], newMessage: string, selectedCrop?: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const context = selectedCrop ? `[Contexto: Cultura ${selectedCrop}] ` : '';
    const response = await chat.sendMessage({
      message: context + newMessage
    });

    return response.text || "Desculpe, não consegui entender.";
  } catch (error) {
    console.error("Erro no chat:", error);
    return "Ocorreu um erro ao processar sua mensagem. Tente novamente.";
  }
};
