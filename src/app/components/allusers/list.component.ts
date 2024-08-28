import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ITask } from "src/app/models/task.model";
import { TaskService } from "src/app/services/task.service";

@Component({
    standalone:true,
    templateUrl: './list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})

export class AllUsers implements OnInit{
    tasks$: Observable<ITask[]>;

    constructor(private taskService: TaskService){}
    
    ngOnInit(): void {
        this.tasks$ = this.taskService.getAllUsersTasks();
    }

    getCategory(category: string): string {
        return category ? category : "No Category";
    }
}