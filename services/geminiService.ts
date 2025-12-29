import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { WidgetPayload } from "../types";

const mockGenerate = async (): Promise<WidgetPayload> => {
  await new Promise(r => setTimeout(r, 1000));
  return {
    type: 'insight-card',
    props: { message: "Modo Offline: Configura tu API Key para usar la IA real.", level: 'INFO' },
    thought: "Simulación local activa."
  };
};

export const GeminiService = {
  callAPI: async (prompt: string, systemInstruction: string = SYSTEM_PROMPT): Promise<WidgetPayload | null> => {
    if (!process.env.API_KEY) {
      console.warn("API Key no detectada. Usando mock fallback.");
      return mockGenerate();
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash-preview-09-2025';

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const textResponse = response.text;
      
      if (!textResponse) throw new Error("No se recibió respuesta de Gemini");
      
      return JSON.parse(textResponse);

    } catch (error) {
      console.error("Fallo en Gemini API:", error);
      return {
        type: 'alert-banner',
        props: { type: 'error', message: `Error de generación: ${error instanceof Error ? error.message : String(error)}` },
        thought: "Fallo en la conexión neuronal."
      };
    }
  }
};