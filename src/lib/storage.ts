export interface StorageProvider {
  upload(data: Buffer | ArrayBuffer, fileName: string, contentType: string): Promise<string>;
  getDownloadUrl(fileName: string): Promise<string>;
}

export class R2Storage implements StorageProvider {
  constructor(private bucket: R2Bucket) {}

  async upload(data: Buffer | ArrayBuffer, fileName: string, contentType: string): Promise<string> {
    await this.bucket.put(fileName, data, {
      httpMetadata: { contentType },
    });
    return fileName;
  }

  async getDownloadUrl(fileName: string): Promise<string> {
    // For R2, we typically use a public URL if the bucket is public,
    // or a signed URL. For simplicity, we'll assume a public URL or a worker route.
    return `/api/download?file=${fileName}`;
  }
}
