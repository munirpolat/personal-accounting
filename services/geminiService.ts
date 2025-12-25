
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { MODEL_MAP } from "../constants";
import { Language } from "../translations";

// Fix: Strictly follow the GoogleGenAI initialization guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeReceipt = async (base64Image: string, lang: Language): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_MAP.complex,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: `Extract details from this receipt. Use language: ${lang}. Return total amount, category (from: food, transport, entertainment, bills, rent, health, education, other), date, and merchant name. Return as JSON.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amount: { type: Type.NUMBER },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          date: { type: Type.STRING }
        },
        required: ["amount", "category", "description"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

// Fix: Comply with search grounding rules. Do not attempt to parse it as JSON if search is used.
export const fetchExchangeRates = async (): Promise<{ rates: Record<string, number>, sources: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: MODEL_MAP.complex,
      contents: "Search for current exchange rates for 1 USD to TRY, 1 EUR to TRY, 1 GBP to TRY, and 1 CAD to TRY. Provide the latest rates clearly in text.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Fix: Instead of JSON.parse, use robust regex extraction as per search guidelines
    const rates: Record<string, number> = { TRY: 1 };
    const currencies = ['USD', 'EUR', 'GBP', 'CAD'];
    
    currencies.forEach(curr => {
      const regex = new RegExp(`${curr}[:\\s-]+(\\d+(\\.\\d+)?)`, 'i');
      const match = text.match(regex);
      if (match) {
        rates[curr] = parseFloat(match[1]);
      } else {
        // Fallback for missing matches
        const fallbackMap: Record<string, number> = { USD: 34.2, EUR: 37.1, GBP: 44.5, CAD: 25.1 };
        rates[curr] = fallbackMap[curr];
      }
    });

    return { rates, sources };
  } catch (error) {
    console.error("Currency fetch failed, using fallback:", error);
    return { 
      rates: { TRY: 1, USD: 34.2, EUR: 37.1, GBP: 44.5, CAD: 25.1 },
      sources: []
    };
  }
};

export const chatWithThinking = async (prompt: string, lang: Language): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_MAP.complex,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: `You are a helpful personal finance assistant. Please respond in ${lang === 'tr' ? 'Turkish' : 'English'}.`
    }
  });
  return response.text || (lang === 'tr' ? "Üzgünüm, bir hata oluştu." : "Sorry, an error occurred.");
};

export const searchFinancialData = async (query: string, lang: Language) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_MAP.text,
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: `You are a financial researcher. Respond in ${lang === 'tr' ? 'Turkish' : 'English'}.`
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K", aspectRatio: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_MAP.image,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size
      }
    }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateVideoWithVeo = async (prompt: string, aspectRatio: '16:9' | '9:16') => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: MODEL_MAP.video,
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};
