// constants.ts

export const MODEL_NAME = "gemini-1.5-flash";

// Image validation
export const MAX_IMAGE_SIZE_MB = 10;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

// Gemini system prompt (needed for model call)
export const SYSTEM_PROMPT = `
You are a plant disease detection AI.

Analyze the plant leaf image and return:
- isPlant (true/false)
- plantName
- disease (if any)
- confidence (0-100)
- careTips

If not a plant → set isPlant to false.
If plant is healthy → provide care tips.
`;
