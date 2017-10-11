import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Flock } from '../models/flock';

@Injectable()
export class FlockService {
  private uid: string;

  constructor(
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
}
