import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITask } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})

export class TaskState {
    protected stateList: BehaviorSubject<ITask[]> = new BehaviorSubject([]);
    stateList$: Observable<ITask[]> = this.stateList.asObservable();

    setList(data: ITask[]): Observable<ITask[]> {
        this.stateList.next(data);
        return this.stateList$;
    }

    get CurrentList(): ITask[] {
        return this.stateList.getValue();
    }

    addItem(data: ITask): void {
        this.stateList.next([...this.CurrentList, data]);
    }

    editItem(data: ITask): void {
        const current = [...this.CurrentList];
        const index = current.findIndex(i => i.id === data.id);

        if(index > -1) {
            current[index] = structuredClone(data);
            this.stateList.next([...this.CurrentList]);
        }
    }

    removeItem(id: string): void {
        this.stateList.next(this.CurrentList.filter((i) => i.id !== Number(id)));
    }
}
