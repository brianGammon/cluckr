export class UploadResult {
  message: string;
  imageUrl: string;
  imagePath: string;
  thumbnailUrl: string;
  thumbnailPath: string;
  error: any;

  constructor(message: string, imageUrl?: string, imagePath?: string, thumbnailUrl?: string, thumbnailPath?: string, error?: any) {
    this.message = message;
    this.imageUrl = imageUrl;
    this.imagePath = imagePath;
    this.thumbnailUrl = thumbnailUrl;
    this.thumbnailPath = thumbnailPath;
    this.error = error;
  }
}
