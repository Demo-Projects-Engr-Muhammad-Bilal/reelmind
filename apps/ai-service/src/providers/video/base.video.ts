import fs from 'fs';
import path from 'path';

export abstract class BaseVideoProvider {
          protected getOutputVideoPath(imagePath: string): string {
                    // 'image.png' ko replace karke 'scene_video_ai.mp4' banana
                    return imagePath.replace('image.png', `scene_video_ai.mp4`);
          }
}