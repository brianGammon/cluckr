import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Egg } from '../models';

@Injectable()
export class EggService {
  private uid: string;

  constructor(
    private db: AngularFireDatabase
  ) {
  }

  getEggs(flockId: string) {
    return this.db.list(`eggs/${flockId}`);
  }

  getEggsByChickenId(flockId: string, chickenId: string) {
    return this.db.list(`eggs/${flockId}`, {
      query: {
        orderByChild: 'chicken',
        equalTo: chickenId
      }
    });
  }

  getEggsByDate(flockId: string, dateString: string) {
    return this.db.list(`eggs/${flockId}`, {
      query: {
        orderByChild: 'date',
        equalTo: dateString
      }
    });
  }

  saveEgg(flockId: string, egg: Egg) {
    const ref = this.db.list(`eggs/${flockId}`);
    return ref.push(egg);
  }

  deleteEgg(flockId: string, eggId: string) {
    const ref = this.db.object(`eggs/${flockId}/${eggId}`);
    return ref.remove();
  }

}
