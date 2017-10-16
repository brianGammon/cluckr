import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { EggService } from './egg.service';
import { Chicken } from '../models';

@Injectable()
export class ChickenService {
  private uid: string;

  constructor(
    private eggService: EggService,
    private db: AngularFireDatabase
  ) {
  }

  getChicken(flockId: string, chickenId: string) {
    return this.db.object(`chickens/${flockId}/${chickenId}`);
  }

  getChickensList(flockId: string) {
    return this.db.list(`chickens/${flockId}`);
  }

  getChickens(flockId: string) {
    return this.db.object(`chickens/${flockId}`);
  }

  addChicken(flockId: string, chicken: Chicken) {
    const ref = this.db.list(`chickens/${flockId}`);
    return ref.push(chicken);
  }

  deleteChicken(flockId: string, chickenId: string) {
     return this.eggService.deleteEggsByChickenId(flockId, chickenId)
     .then(() => {
        const ref = this.db.object(`chickens/${flockId}/${chickenId}`);
        return ref.remove();
     })
     .catch(error => console.log(error));
  }

  deleteChickensByFlockId(flockId: string) {
    return this.db.object(`chickens/${flockId}`).set(null);
  }
}
