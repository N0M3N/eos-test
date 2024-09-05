import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, interval, map } from "rxjs";
import { v4 } from "uuid";

export type Notification = {
  text: string;
  type: 'info' | 'success' | 'error';
}

type IdNotification = { id: string, shown?: Date } & Notification;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private queue = new BehaviorSubject<IdNotification[]>([])

  public notifications$ = combineLatest([interval(1000), this.queue.pipe(distinctUntilChanged())]).pipe(
    map(([_, queue]) => queue),
    filter(queue => queue.length > 0),
    map(queue => {
      const filtered = this.filterQueue(queue);
      const first3 = [];
      for (let i = 0; i < 3; i++) { // slice makes copies
        const elem = filtered.shift();
        if (elem)
          first3.push(elem);
      }
      first3.forEach(x => {
        if (!x.shown)
          x.shown = new Date();
      })
      return first3;
    })
  )

  show(notification: Notification) {
    const queue = this.filterQueue(this.queue.value);
    queue.push({ ...notification, id: v4() });
    this.queue.next(queue);
  }

  private filterQueue(queue: IdNotification[]) {
    return queue.filter(x => !x.shown || (new Date().getTime() - x.shown.getTime()) < 3000);
  }
}