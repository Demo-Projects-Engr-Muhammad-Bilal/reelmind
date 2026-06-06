// Imported In: generate.controller.ts

import * as tf from '@tensorflow/tfjs';

/**
 * 🧠 ScoringService
 * ML logic use karke hooks ki quality analyze karta hai.
 */
export class ScoringService {
          /**
           * Aik single hook ko length aur power-words par score karta hai.
           */
          static async scoreHook(hook: string): Promise<number> {
                    return tf.tidy(() => {
                              const length = hook.length;
                              // 💡 Length constraint logic
                              const lengthScore = length > 40 && length < 100 ? 1.0 : 0.4;

                              const powerWords = ['secret', 'dark', 'hidden', 'trick', 'never', 'instantly', 'stop', 'why'];
                              const wordsFound = powerWords.filter(word => hook.toLowerCase().includes(word)).length;
                              const powerScore = Math.min(wordsFound * 0.35, 1.0);

                              // 🏋️ Weighted Calculation using Tensors
                              const weights = tf.tensor1d([0.4, 0.6]);
                              const features = tf.tensor1d([lengthScore, powerScore]);

                              const finalScore = features.dot(weights);
                              return (finalScore.dataSync()[0] * 100);
                    });
          }

          /**
           * Multiple hooks ko rank karke highest score wala pehle return karta hai.
           */
          static async rankAllHooks(hooks: string[]) {
                    const rankedHooks = await Promise.all(
                              hooks.map(async (hook, index) => {
                                        const score = await this.scoreHook(hook);
                                        return { index, hook, score };
                              })
                    );

                    return rankedHooks.sort((a, b) => b.score - a.score);
          }
}