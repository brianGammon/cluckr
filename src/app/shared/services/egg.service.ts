import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Egg } from '../models';

@Injectable()
export class EggService {
  private uid: string;

  constructor(
    private db: AngularFireDatabase
  ) {
  }

  getEgg(flockId: string, eggId: string) {
    return this.db.object(`eggs/${flockId}/${eggId}`);
  }

  getEggs(flockId: string) {
    return this.db.list(`eggs/${flockId}`);
  }

  getEggsByChickenId(flockId: string, chickenId: string): Observable<Egg[]> {
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

  getEggsByDateRange(flockId: string, start: string, end: string) {
    return this.db.list(`eggs/${flockId}`, {
      query: {
        orderByChild: 'date',
        startAt: start,
        endAt: end
      }
    });
  }

  addEgg(flockId: string, egg: Egg) {
    const ref = this.db.list(`eggs/${flockId}`);
    return ref.push(egg);
  }

  updateEgg(flockId: string, egg: Egg) {
    return this.db.object(`eggs/${flockId}/${egg['$key']}`).set(egg);
  }

  deleteEgg(flockId: string, eggId: string) {
    const ref = this.db.object(`eggs/${flockId}/${eggId}`);
    return ref.remove();
  }

  deleteEggsByFlockId(flockId: string) {
    return this.db.object(`eggs/${flockId}`).set(null);
  }

  deleteEggsByChickenId(flockId: string, chickenId: string) {
    const promise = new Promise<boolean>((resolve, reject) => {
      const eggsRef = this.eggsByChickenId(flockId, chickenId);
      eggsRef.take(1).subscribe(eggs => {
        eggs.forEach(egg => {
          this.db.object(`/eggs/${flockId}/${egg['$key']}`).remove();
        });
        resolve(true);
      }, error => {
        console.log('error deleting eggs');
        console.log(error);

        reject(error);
      });
    });
    return promise;
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
