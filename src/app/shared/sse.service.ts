import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ServerSideEventsService {

  constructor(private zone: NgZone) {}

  getServerSentEvent(url: string) {
    return Observable.create(observer => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error);
        });
      };
    });
  }
}
