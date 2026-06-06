export const SHARED_STRUCTURE = `
{
  "metadata": { "mood": "string", "bgm": "string", "colorPalette": "string" },
  "type": "Storytelling" | "Educational",
  "hook": "string",
  "body": "string",
  "closing": "string",
  "scenes": [
    {
      "order": 1,
      "duration": "0:08",
      "visualPrompt": "string",
      "cameraMovement": "string",
      "audioText": "string",
      "onScreenText": "string"
    }
  ]
}
`;

export const PROMPT_FACTORY = {
  HOOKS: (config: any, topic: string, count: number = 3, isRetake: boolean = false) => {
    const retakeInstruction = isRetake 
      ? `\n      CRITICAL INSTRUCTION FOR RETAKE: The previous hooks were REJECTED. Provide completely new angles. VARIANCE SEED: ${Date.now()}` 
      : "";

    return `
      SYSTEM: ${config.systemPrompt}
      ROLE: Viral Content Strategist.
      TASK: Generate exactly ${count} high-retention hooks for: "${topic}".${retakeInstruction}
      
      INSTRUCTION: Return ONLY a JSON array of strings. No markdown, no prose.
      Example: ["hook1", "hook2", "hook3"]
    `;
  },

  SCRIPT: (config: any, winnerHook: string, isRetake: boolean = false) => {
    const retakeInstruction = isRetake 
      ? `\n      CRITICAL INSTRUCTION FOR RETAKE: The user REJECTED the previous script. Take a completely fresh creative direction. VARIANCE SEED: ${Date.now()}` 
      : "";

    return `
      SYSTEM: ${config.systemPrompt}
      ROLE: High-End Scriptwriter.
      WINNER HOOK: "${winnerHook}"
      STYLE: ${config.expansionInstruction}

      TASK: Create exactly ONE (1) script with 5 scenes.${retakeInstruction}

      STRICT LIMITS (To prevent truncation):
      1. visualPrompt: MAX 35 words. Be descriptive but punchy.
      2. audioText: MAX 18 words.
      3. Return ONLY a valid JSON object. No prose, no backticks.
      4. Use single quotes (') for interior text, NEVER double quotes (").

      FORMAT TEMPLATE: 
      ${SHARED_STRUCTURE}
    `;
  },

  // ⚡ NEW: Exclusively for Single Scene Retakes
  RETAKE_SCENE: (config: any, winnerHook: string, oldAudio: string, oldVisual: string) => {
    return `
      SYSTEM: ${config.systemPrompt}
      ROLE: High-End Scriptwriter.
      WINNER HOOK: "${winnerHook}"

      TASK: The user explicitly REJECTED the following scene from the video script:
      OLD AUDIO: "${oldAudio}"
      OLD VISUAL: "${oldVisual}"

      You must generate EXACTLY ONE completely fresh and different variation for this specific scene. Change the emotional angle, vocabulary, and visual context. DO NOT repeat the old concepts.
      VARIANCE SEED: ${Date.now()}

      STRICT LIMITS:
      1. visualPrompt: MAX 35 words.
      2. audioText: MAX 18 words.
      3. Return ONLY a valid JSON object matching this structure:
      {
        "order": 1,
        "duration": "0:08",
        "visualPrompt": "string",
        "cameraMovement": "string",
        "audioText": "string",
        "onScreenText": "string"
      }
    `;
  }
};