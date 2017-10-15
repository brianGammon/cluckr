export class UploadResult {
  message: string;
  imageUrl: string;
  thumbnailUrl: string;
  error: any;

  constructor(message: string, imageUrl?: string, thumbnailUrl?: string, error?: any) {
    this.message = message;
    this.imageUrl = imageUrl;
    this.thumbnailUrl = thumbnailUrl;
    this.error = error;
  }
}
