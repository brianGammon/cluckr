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
      let mainImageUrl: string = null;
      let mainImagePath: string = null;
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
            null,
            null,
            error
          ));
        },
        () => {
          mainImageUrl = uploadTask.snapshot.downloadURL;
          mainImagePath = uploadTask.snapshot.metadata.fullPath;
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
                mainImagePath,
                uploadTask.snapshot.downloadURL,
                uploadTask.snapshot.metadata.fullPath
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

  deleteFromPath(path: string) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(path).delete().catch((error: any) => {
      if (error.code && error.code === 'storage/object-not-found') {
        // Swallow the error if image already deleted
        return new Promise(resolve => resolve({success: true}));
      } else {
        throw(error);
      }
    });
  }
}
