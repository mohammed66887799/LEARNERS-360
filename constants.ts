

export const MODEL_NAME = "gemini-1.5-flash";

// Image validation settings
export const MAX_IMAGE_SIZE_MB = 10;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

// Move the system prompt to service file (used when calling Gemini)
export const SYSTEM_PROMPT = `
You are a plant disease detection AI.

Analyze plant leaf images and return:
- Is it a plant? (true/false)
- Plant name
- Disease name (if any)
- Confidence score (0-100)
- Care tips

If the plant is healthy, provide care tips only.
If the image is not a plant, return isPlant: false.
`;
