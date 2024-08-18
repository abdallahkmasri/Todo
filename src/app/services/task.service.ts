import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from '../models/task.model';
import { enviroment } from 'src/enviroments/enviroment';
import { Observable } from 'rxjs';
import { SigninService } from './signin.service';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _url = `${enviroment.url}/tasks`;

  private token = this.signinService.getToken();

  constructor(private http: HttpClient, private signinService: SigninService) {}

  addTask(task: ITask): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });

    const added = {
        title: task.title,
        description: task.description,
        dueDate: formatDate(new Date(task.dueDate), 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
        status: task.status,
        priority: task.priority,
        isComplete: task.isComplete,
    }

    return this.http.post(`${this._url}`, added, { headers });
  }

  getTasks(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${this._url}?userId=${Number(userId)}`, { headers });
  }
}
