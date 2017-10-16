import { Injectable } from '@angular/core';
import { ImageSet, UploadResult } from '../models';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadService {

  constructor(private db: AngularFireDatabase) { }

  pushUpload(imageSet: ImageSet, userId: string, flockId: string): Promise<UploadResult> {
    const promise = new Promise<UploadResult>((resolve, reject) => {
      let mainImageUrl = '';
      const storageRef = firebase.storage().ref();

      // Main image first
      let uploadTask = storageRef.child(`uploads/user:${userId}/flock:${flockId}/${imageSet.image.name}`).put(imageSet.image);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: any) => {
          // upload in progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Main image upload progress: ${progress}`);
        },
        (error) => {
          reject(new UploadResult(
            'error',
            null,
            null,
            error
          ));
        },
        () => {
          mainImageUrl = uploadTask.snapshot.downloadURL;
          uploadTask = storageRef.child(`uploads/user:${userId}/flock:${flockId}/${imageSet.thumbnail.name}`).put(imageSet.thumbnail);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: any) => {
              // upload in progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Thumbnail upload progress: ${progress}`);
            },
            (error) => {
              // upload failed
              reject(new UploadResult(
                'error',
                null,
                null,
                error
              ));
            },
            () => {
              // upload success
              const uploadResult = new UploadResult(
                'success',
                mainImageUrl,
                uploadTask.snapshot.downloadURL
              );

              // this.saveFileData(upload);
              resolve(uploadResult);
            }
          );
        }
      );
    });

    return promise;
  }
}