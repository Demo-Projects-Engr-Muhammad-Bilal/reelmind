import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import 'dotenv/config';

export class StorageService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    /**
     * ⬆️ Upload logic with conditional auto-delete
     */
    async uploadFile(localPath: string, folder: string, autoDelete: boolean = true): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(localPath, {
                folder: `aireelgen/${folder}`,
                resource_type: "auto",
            });

            if (autoDelete && fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
                console.log(`🧹 Storage cleanup: ${path.basename(localPath)} deleted.`);
            } else {
                console.log(`🛡️ Persistence: ${path.basename(localPath)} kept on disk.`);
            }
            return result.secure_url;
        } catch (err: any) {
            console.error("❌ Cloudinary Error:", err.message);
            throw new Error(`Failed to upload to Cloudinary: ${err.message}`);
        }
    }

    /**
     * 🗑️ Cleanup Old Assets (Used during RETAKE to save Cloudinary Storage)
     */
    async deleteFromCloud(fileUrl: string) {
        if (!fileUrl || !fileUrl.includes('cloudinary.com')) return;
        try {
            // Extract public ID from secure_url
            const urlParts = fileUrl.split('/upload/');
            if (urlParts.length !== 2) return;

            let pathPart = urlParts[1];
            if (pathPart.match(/^v\d+\//)) {
                pathPart = pathPart.replace(/^v\d+\//, ''); // Remove version tag
            }
            const publicId = pathPart.substring(0, pathPart.lastIndexOf('.')); // Remove extension

            // Audio/Video map to 'video' resource type in Cloudinary
            let resourceType = 'image';
            if (fileUrl.includes('/video/upload/') || fileUrl.endsWith('.mp3') || fileUrl.endsWith('.mp4') || fileUrl.endsWith('.wav')) {
                resourceType = 'video';
            }

            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
            console.log(`🗑️ Cloud Cleanup: Deleted old asset [${publicId}]`);
        } catch (error: any) {
            console.error(`❌ Cloud Cleanup Error for ${fileUrl}:`, error.message);
        }
    }

    /**
     * ⬇️ Helper for downloading assets
     */
    async downloadToLocal(url: string, localPath: string): Promise<string> {
        const directory = path.dirname(localPath);
        if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

        try {
            const response = await axios({ url, method: 'GET', responseType: 'stream' });
            return new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(localPath);
                response.data.pipe(writer);
                writer.on('finish', () => resolve(localPath));
                writer.on('error', (err) => {
                    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
                    reject(err);
                });
            });
        } catch (err: any) {
            throw new Error(`Failed to download asset: ${err.message}`);
        }
    }
}