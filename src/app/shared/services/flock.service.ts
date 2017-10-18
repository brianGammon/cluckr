import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { ChickenService } from './chicken.service';
import { EggService } from './egg.service';
import { Flock } from '../models/flock';

@Injectable()
export class FlockService {
  private uid: string;

  constructor(
    private chickenService: ChickenService,
    private eggService: EggService,
    private db: AngularFireDatabase
  ) {
  }

  getFlock(flockId): FirebaseObjectObservable<Flock> {
    return this.db.object(`flocks/${flockId}`);
  }

  getFlocks(userId): FirebaseListObservable<Flock[]> {
    return this.db.list('flocks', {
      query: {
        orderByChild: `users/${userId}`,
        equalTo: true
      }
    });
  }

  addFlock(name: string, userId: string) {
    const ref = this.db.list('flocks/');
    const flock = new Flock();
    flock.name = name;
    flock.users = {};
    flock.users[userId] = true;
    return ref.push(flock);
  }

  joinFlock(flockId: string, userId: string) {
    const ref = this.db.object(`flocks/${flockId}/users`);
    const newObj = {};
    newObj[userId] = true;
    return ref.update(newObj);
  }

  deleteFlock(userId: string, flockId: string) {
    return this.eggService.deleteEggsByFlockId(flockId)
      .then(() => this.chickenService.deleteChickensByFlockId(flockId))
      .then(() => this.db.object(`flocks/${flockId}`).set(null))
      .then(() => this.db.object(`deletedFlocks/${userId}/${flockId}`).set(true));
  }
}
