import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from '../models/task.model';
import { enviroment } from 'src/enviroments/enviroment';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _url = `${enviroment.url}/tasks`;

  constructor(private http: HttpClient) {}

  addTask(task: ITask): Observable<any> {

    const added = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      createdDate: task.createdDate,
      category: task.category,
    };
    return this.http.post(`${this._url}`, added);
  }

  getTasks(): Observable<any> {
    const api = `${this._url}`;
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
    searchTerm: string
  ): Observable<any> {
    return this.http.get(`${this._url}/search?searchTerm=${searchTerm}`);
  }

  getAllUsersTasks(): Observable<any> {
    return this.http.get(`${this._url}/all`).pipe(tap((c) => console.log("Service: " + JSON.stringify(c))));
  }
}
