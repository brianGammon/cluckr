import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { UploadService } from './upload.service';
import { EggService } from './egg.service';
import { Chicken } from '../models';

@Injectable()
export class ChickenService {
  private uid: string;

  constructor(
    private eggService: EggService,
    private uploadService: UploadService,
    private db: AngularFireDatabase
  ) {
  }

  getChicken(flockId: string, chickenId: string): Observable<Chicken> {
    return this.db.object(`chickens/${flockId}/${chickenId}`);
  }

  getChickensList(flockId: string) {
    return this.db.list(`chickens/${flockId}`);
  }

  addChicken(flockId: string, chicken: Chicken) {
    const ref = this.db.list(`chickens/${flockId}`);
    return ref.push(chicken);
  }

  deleteChicken(flockId: string, chicken: Chicken) {
     return this.eggService.deleteEggsByChickenId(flockId, chicken['$key'])
     .then(() => {
       if (chicken.photoPath) {
        return this.uploadService.deleteFromPath(chicken.photoPath);
       } else {
        return new Promise(resolve => resolve({success: true}));
       }
      })
     .then(() => {
       if (chicken.thumbnailPath) {
        return this.uploadService.deleteFromPath(chicken.thumbnailPath);
       } else {
        return new Promise(resolve => resolve({success: true}));
       }
      })
     .then(() => this.db.object(`chickens/${flockId}/${chicken['$key']}`).remove());
  }

  deleteChickensByFlockId(flockId: string) {
    return this.db.object(`chickens/${flockId}`).set(null);
  }
}
