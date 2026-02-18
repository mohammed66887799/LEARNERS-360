import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MODEL_NAME, SYSTEM_INSTRUCTION } from "../constants";
import { Diagnosis } from "../types";

// Initialize the API client
// CRITICAL: process.env.API_KEY is guaranteed to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const diagnosisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isPlant: {
      type: Type.BOOLEAN,
      description: "True if the image contains a plant or leaf, false otherwise.",
    },
    plantName: {
      type: Type.STRING,
      description: "The common name of the plant identified.",
    },
    diseaseName: {
      type: Type.STRING,
      description: "The name of the disease, pest, or condition. If healthy, state 'Healthy'.",
    },
    isHealthy: {
      type: Type.BOOLEAN,
      description: "True if the plant appears healthy, false if infected or damaged.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score of the diagnosis from 0 to 100.",
    },
    description: {
      type: Type.STRING,
      description: "A brief, professional description of the visual symptoms or the healthy state.",
    },
    treatments: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of recommended treatments or care tips (if healthy).",
    },
  },
  required: ["isPlant", "plantName", "diseaseName", "isHealthy", "confidence", "description", "treatments"],
};

/**
 * Converts a File object to a base64 string suitable for the Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzePlantImage = async (file: File): Promise<Diagnosis> => {
  try {
    const base64Data = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
          {
            text: "Analyze this image for plant diseases.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from the model.");
    }

    const result = JSON.parse(text) as Diagnosis;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};