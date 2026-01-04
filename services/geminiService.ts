import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { WidgetPayload } from "../types";

// Modelos disponibles de Gemini 3.0
export type GeminiModel = 'flash' | 'pro';

export interface GeminiConfig {
  model: GeminiModel;
  thinkingLevel: 'minimal' | 'low' | 'medium' | 'high';
}

const MODEL_MAP: Record<GeminiModel, string> = {
  flash: 'gemini-3-flash-preview',
  pro: 'gemini-3-pro-preview'
};

const mockGenerate = async (): Promise<WidgetPayload> => {
  await new Promise(r => setTimeout(r, 1000));
  return {
    type: 'insight-card',
    props: { message: "Modo Offline: Configura tu API Key para usar Gemini 3.0.", level: 'INFO' },
    thought: "Simulación local activa."
  };
};

export const GeminiService = {
  // Configuración por defecto
  defaultConfig: { model: 'flash', thinkingLevel: 'medium' } as GeminiConfig,

  callAPI: async (
    prompt: string,
    systemInstruction: string = SYSTEM_PROMPT,
    config: Partial<GeminiConfig> = {}
  ): Promise<WidgetPayload | null> => {
    const finalConfig = { ...GeminiService.defaultConfig, ...config };

    if (!process.env.API_KEY) {
      console.warn("API Key no detectada. Usando mock fallback.");
      return mockGenerate();
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelId = MODEL_MAP[finalConfig.model];

      console.log(`[Gemini] Usando ${modelId} con thinking: ${finalConfig.thinkingLevel}`);

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          thinkingConfig: {
            thinkingLevel: finalConfig.thinkingLevel
          }
        }
      });

      const textResponse = response.text;

      if (!textResponse) throw new Error("No se recibió respuesta de Gemini 3.0");

      return JSON.parse(textResponse);

    } catch (error) {
      console.error("Fallo en Gemini 3.0 API:", error);
      return {
        type: 'alert-banner',
        props: { type: 'error', message: `Error de generación: ${error instanceof Error ? error.message : String(error)}` },
        thought: "Fallo en la conexión con Gemini 3.0."
      };
    }
  }
};