import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export type GoalEvent = {
  type: 'created' | 'updated' | 'deleted';
  payload: { id: number; title?: string; };
};

@Injectable()
export class GoalsEventsService {
  private readonly subject = new Subject<GoalEvent>();

  asObservable(): Observable<GoalEvent> {
    return this.subject.asObservable();
  }

  emit(event: GoalEvent): void {
    this.subject.next(event);
  }
}


