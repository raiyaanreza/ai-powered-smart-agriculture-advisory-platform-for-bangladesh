// @agri-packages/ai-tools
export const AI_CONFIG = {
  MODEL_NAME: "gemini-3.1-flash-lite",
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000,
};

export const CROP_ROUTING_PROMPT = `
Identify the crop category from user queries and route them to crop-specific models.
Valid Categories: Rice, Wheat, Potato, Corn, Brassica, General.
`;
