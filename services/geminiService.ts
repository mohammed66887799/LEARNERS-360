import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { MODEL_NAME, SYSTEM_INSTRUCTION } from "../constants";
import { Diagnosis } from "../types";

// Initialize the API client using Vite's env variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const diagnosisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    isPlant: {
      type: SchemaType.BOOLEAN,
      description: "True if the image contains a plant or leaf, false otherwise.",
    },
    plantName: {
      type: SchemaType.STRING,
      description: "The common name of the plant identified.",
    },
    diseaseName: {
      type: SchemaType.STRING,
      description: "The name of the disease, pest, or condition. If healthy, state 'Healthy'.",
    },
    isHealthy: {
      type: SchemaType.BOOLEAN,
      description: "True if the plant appears healthy, false if infected or damaged.",
    },
    confidence: {
      type: SchemaType.NUMBER,
      description: "Confidence score of the diagnosis from 0 to 100.",
    },
    description: {
      type: SchemaType.STRING,
      description: "A brief, professional description of the visual symptoms or the healthy state.",
    },
    treatments: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of recommended treatments or care tips (if healthy).",
    },
  },
  required: ["isPlant", "plantName", "diseaseName", "isHealthy", "confidence", "description", "treatments"],
};

/**
 * Converts a File object to a base64 string suitable for the Gemini API.
 */
const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzePlantImage = async (file: File): Promise<Diagnosis> => {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
      },
    });

    const imagePart = await fileToGenerativePart(file);
    
    // Send the image and prompt
    const result = await model.generateContent([
      "Analyze this image for plant diseases according to the schema.",
      imagePart
    ]);

    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("No response received from the model.");
    }

    return JSON.parse(text) as Diagnosis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};
