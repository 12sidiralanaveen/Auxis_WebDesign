import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DraftMode, RefinedResponse } from '../types';

const getSystemInstruction = (mode: DraftMode, context: string): string => {
  return `
    You are AuxisAI, an expert productivity assistant.
    Your goal is to take a rough spoken draft (audio) and convert it into a polished, professional written piece.
    
    Current Mode: ${mode}
    Context provided by user: "${context || 'No specific context provided.'}"

    Instructions:
    1. Transcribe the audio accurately.
    2. Analyze the intent and tone of the speaker.
    3. Rewrite the content to be professional, clear, and context-aware. 
       - If it's an Email Reply, ensure it addresses the context politely.
       - If it's a LinkedIn Post, make it engaging and suitable for a professional network.
       - If it's a New Email, structure it with a clear subject line and body.
    4. Estimate how much time was saved by speaking instead of typing (assuming typing speed is 40wpm and speaking is 150wpm, plus editing time).
  `;
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcription: { type: Type.STRING, description: "The verbatim transcription of the user's speech." },
    refinedContent: { type: Type.STRING, description: "The polished, formatted final text output." },
    toneAnalysis: { type: Type.STRING, description: "A brief analysis of the original tone and how it was improved." },
    savedTime: { type: Type.STRING, description: "Estimated time saved, e.g., '2 minutes'." },
  },
  required: ["transcription", "refinedContent", "toneAnalysis", "savedTime"],
};

export const processAudioDraft = async (
  audioBase64: string,
  mode: DraftMode,
  context: string,
  mimeType: string = 'audio/webm'
): Promise<RefinedResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Ensure we strip the data URL prefix if present for the API call
    const cleanBase64 = audioBase64.replace(/^data:.+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: `Please process this audio draft for a ${mode}.`
          }
        ]
      },
      config: {
        systemInstruction: getSystemInstruction(mode, context),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Slightly creative but professional
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini.");

    const parsed = JSON.parse(text) as RefinedResponse;
    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
