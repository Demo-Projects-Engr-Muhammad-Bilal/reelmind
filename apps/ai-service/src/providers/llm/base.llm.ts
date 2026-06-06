export abstract class BaseLLMProvider {
          /**
           * AI ke ganda (Markdown) output ko saaf karke pure JSON nikaalta hai.
           */
          protected sanitizeJSON(text: string): any {
                    const sanitized = text.replace(/```json|```/g, "").trim();
                    const startIndex = sanitized.indexOf('{') !== -1 ? sanitized.indexOf('{') : sanitized.indexOf('[');
                    const endIndex = Math.max(sanitized.lastIndexOf('}'), sanitized.lastIndexOf(']'));

                    if (startIndex === -1 || endIndex === -1) throw new Error("Invalid JSON structure from AI");

                    const jsonString = sanitized.substring(startIndex, endIndex + 1);
                    return JSON.parse(jsonString);
          }
}