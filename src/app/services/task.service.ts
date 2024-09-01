import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from '../models/task.model';
import { enviroment } from 'src/enviroments/enviroment';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _url = `${enviroment.url}/tasks`;

  private categories = [
    { id: 1, name: 'Work' },
    { id: 2, name: 'Family' },
    { id: 3, name: 'Health' },
    { id: 4, name: 'Financial' },
    { id: 5, name: 'Other' },
  ];

  constructor(private http: HttpClient) {}

  addTask(task: ITask): Observable<any> {
    const taskData = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      createdDate: task.createdDate,
    };

    // Convert category IDs to query string parameters
    const categoryIds = task.taskCategories
      .map(
        (categoryName) =>
          this.categories.find((c) => c.name === categoryName)?.id
      )
      .filter((id) => id !== undefined) as number[]; // Ensure we only pass valid IDs

    const params = new HttpParams({ fromObject: { CategoryIds: categoryIds } });

    return this.http.post(`${this._url}`, taskData, { params });
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
    const taskData = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      createdDate: task.createdDate,
    };

    const categoryIds = task.taskCategories
      .map(
        (categoryName) =>
          this.categories.find((c) => c.name === categoryName)?.id
      )
      .filter((id) => id !== undefined) as number[]; // Ensure we only pass valid IDs

    const params = new HttpParams({ fromObject: { CategoryIds: categoryIds } });

    return this.http.put(`${this._url}/${id}`, taskData, { params });
  }

  searchTasks(searchTerm: string): Observable<any> {
    return this.http.get(`${this._url}/search?searchTerm=${searchTerm}`);
  }

  getAllUsersTasks(): Observable<any> {
    return this.http.get(`${this._url}/all`);
  }
}
