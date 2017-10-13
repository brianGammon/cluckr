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
    return this.eggsByChickenId(flockId, chickenId);
  }

  getEggsByDate(flockId: string, dateString: string) {
    return this.db.list(`eggs/${flockId}`, {
      query: {
        orderByChild: 'date',
        equalTo: dateString
      }
    });
  }

  getEggsByMonth(flockId: string, dateString: string) {
    return this.db.list(`eggs/${flockId}`, {
      query: {
        orderByChild: 'date',
        startAt: '2017-10-01',
        endAt: '2017-10-31'
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

  deleteEggsByFlockId(flockId: string) {
    return this.db.object(`eggs/${flockId}`).set(null);
  }

  deleteEggsByChickenId(flockId: string, chickenId: string) {
    const eggsRef = this.eggsByChickenId(flockId, chickenId);
    return eggsRef.remove();
  }

  private eggsByChickenId(flockId: string, chickenId: string) {
    return this.db.list(`eggs/${flockId}`, {
      query: {
        orderByChild: 'chickenId',
        equalTo: chickenId
      }
    });
  }

}
