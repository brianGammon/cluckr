import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ImageProcessingResult, ImageSet } from '../models';

@Injectable()
export class ImageService {
  constructor(
    private ng2ImgMaxService: Ng2ImgMaxService,
    private sanitizer: DomSanitizer
  ) { }

  processImage(file: File): Promise<ImageProcessingResult> {
    const promise = new Promise<ImageProcessingResult>((resolve, reject) => {
      const processResult = new ImageProcessingResult();
      processResult.result = 'success';
      processResult.imageSet = new ImageSet();

      if (!file.type.startsWith('image')) {
        processResult.result = 'error';
        processResult.error = new Error('Must be an image mime type');
        reject(processResult);
      } else {
        this.ng2ImgMaxService.resizeImage(file, 480, 10000).subscribe(result => {
          const processedImage = new File([result], result.name, { type: file.type });
          processResult.imageSet.image = processedImage;
          console.log('Successfully processed main image');
          // Do thumbnail next
          this.ng2ImgMaxService.resizeImage(file, 128, 10000).subscribe(thumbResult => {
            const processedThumb = new File([thumbResult], 'thumb_' + thumbResult.name, { type: file.type });
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(processedThumb);
            reader.onload = () => {
              const imagePreview = this.sanitizer.sanitize(SecurityContext.URL, reader.result);
              processResult.imageSet.thumbnail = processedThumb;
              processResult.preview = imagePreview;
              console.log('Successfully processed images');
              resolve(processResult);
            };
          }, error => {
            processResult.result = 'error';
            processResult.error = error;
            console.log('Thumbnail image processing error', error);
            reject(processResult);
          }
          );
        }, error => {
          processResult.result = 'error';
          processResult.error = error;
          console.log('Main image processing error', error);
          reject(processResult);
        });
      }
    });

    return promise;
  }
}
