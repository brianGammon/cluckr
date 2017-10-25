import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { ChickenService } from './chicken.service';
import { EggService } from './egg.service';
import { Flock } from '../models/flock';
import { User } from '../models/user';
import * as _ from 'lodash';

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

  getFlocks(user): Observable<Flock[]> {
    if (!user.flocks || user.flocks.length === 0) {
      return Observable.of([]);
    }
    const flocks: Array<Observable<Flock>> = [];
    _.forOwn(user.flocks, (value, key) => {
      flocks.push(this.getFlock(key));
    });
    return Observable.combineLatest(flocks);
  }

  addFlock(name: string, userId: string) {
    const ref = this.db.list('flocks/');
    const flock = new Flock();
    flock.name = name;
    flock.ownedBy = userId;
    return ref.push(flock);
  }

  deleteFlock(userId: string, flockId: string) {
    return this.eggService.deleteEggsByFlockId(flockId)
      .then(() => this.chickenService.deleteChickensByFlockId(flockId))
      .then(() => this.db.object(`flocks/${flockId}`).set(null))
      .then(() => this.db.object(`deletedFlocks/${userId}/${flockId}`).set(true));
  }
}
