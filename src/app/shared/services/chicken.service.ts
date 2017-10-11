import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Chicken } from '../models';

@Injectable()
export class ChickenService {
  private uid: string;

  constructor(
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
    const ref = this.db.object(`chickens/${flockId}/${chickenId}`);
    return ref.remove();
  }
}
