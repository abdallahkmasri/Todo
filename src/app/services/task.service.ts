import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from '../models/task.model';
import { enviroment } from 'src/enviroments/enviroment';
import { Observable } from 'rxjs';
import { SigninService } from './signin.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _url = `${enviroment.url}/tasks`;

  private token = this.signinService.getToken();

  constructor(private http: HttpClient, private signinService: SigninService) {}

  addTask(task: ITask): Observable<any> {
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
    return this.http.post(`${this._url}`, added);
  }

  getTasks(userId: string): Observable<any> {
    const api = `${this._url}?userId=${encodeURIComponent(userId)}`;
    return this.http.get(api);
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this._url}/${id}`);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this._url}/${id}`);
  }

  markComplete(id: string): Observable<any> {
    return this.http.put(`${this._url}/${id}/complete`, null);
  }

  editTask(id: string, task: ITask): Observable<any> {
    return this.http.put(`${this._url}/${id}`, task);
  }

  searchTasks(
    id: string,
    searchTerm: string
  ): Observable<any> {
    return this.http.get(`${this._url}/search?userId=${id}&searchTerm=${searchTerm}`);
  }
}
