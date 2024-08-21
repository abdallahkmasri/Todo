import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from '../models/task.model';
import { enviroment } from 'src/enviroments/enviroment';
import { Observable, tap } from 'rxjs';
import { SigninService } from './signin.service';

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

    const userId = this.signinService.getUserId();

    const added = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      isComplete: task.isComplete,
      createdDate: task.createdDate,
      userId: userId,
    };
    console.log('task: ' + added.userId);
    return this.http.post(`${this._url}`, added, { headers });
  }

  getTasks(userId: string): Observable<any> {
    const api = `${this._url}?userId=${encodeURIComponent(userId)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(api, { headers });
  }

  getTaskById(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this._url}/${id}`, { headers });
  }

  deleteTask(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.delete(`${this._url}/${id}`, { headers });
  }

  markComplete(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.put(`${this._url}/${id}/complete`, null, { headers });
  }

  editTask(id: string, task: ITask): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.put(`${this._url}/${id}`, task, { headers });
  }

  searchTasks(
    id: string,
    searchTerm: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });

    // let params = new HttpParams().set('userId', id);

    // const _title: string = title?.toString();
    // console.log('title:' + _title);
    // if (title) {
    //   params = params.set('title', title);
    // }
    // if (createdDate) {
    //   params = params.set('createdDate', createdDate);
    // }
    // if (dueDate) {
    //   params = params.set('dueDate', dueDate);
    // }
    return this.http.get(`${this._url}/search?userId=${id}&searchTerm=${searchTerm}`, { headers });
  }
}
