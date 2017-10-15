import { ImageSet } from './imageSet';
import { SafeUrl } from '@angular/platform-browser';

export class ImageProcessingResult {
  result: string;
  error: any;
  imageSet: ImageSet;
  preview: string;
}
