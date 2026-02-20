import { env } from '../config/env';

/**
 * Clean abstraction for Storage Services.
 * The prompt requires Supabase Storage but indicates keeping it cleanly abstracted
 * so we can swap to AWS S3 or other providers easily.
 */
export interface StorageProvider {
    /**
     * Generates a signed URL for a client to upload a file directly to the bucket.
     */
    getSignedUploadUrl(fileName: string, contentType: string): Promise<{ url: string; path: string }>;
}

class SupabaseStorageProvider implements StorageProvider {
    private url: string;
    private serviceKey: string;
    private bucket: string;

    constructor() {
        this.url = env.SUPABASE_URL || '';
        this.serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
        this.bucket = env.SUPABASE_STORAGE_BUCKET || 'uploads';
    }

    async getSignedUploadUrl(fileName: string, contentType: string): Promise<{ url: string; path: string }> {
        if (!this.url || !this.serviceKey) {
            // Fallback for dev if no supabase keys provided
            console.warn('⚠️ Supabase URL or Key not found in environment. Generating a mock URL.');
            return {
                url: `http://localhost:5000/mock-upload/${fileName}`,
                path: `mock/${fileName}`,
            };
        }

        const path = `user-uploads/${Date.now()}-${fileName}`;

        // We do a direct REST call to Supabase storage to mint a signed upload URL
        const res = await fetch(`${this.url}/storage/v1/object/upload/sign/${this.bucket}/${path}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.serviceKey}`,
                apikey: this.serviceKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                expiresIn: 3600, // 1 hour
                contentType,
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to generate signed url: ${errorText}`);
        }

        const data = await res.json();
        return {
            url: `${this.url}/storage/v1${data.url}`,
            path, // The relative path within the bucket
        };
    }
}

// Export a singleton instance of the chosen provider
export const storageService: StorageProvider = new SupabaseStorageProvider();
